var lastMessages = '';

function updateChannelList(channels) {
  var currentChannel = window.location.href.split('/');
  currentChannel = currentChannel[currentChannel.length - 1];

  document.getElementById('channels').innerHTML = '';

  for (const channel of channels) {
    var newChannel = document.createElement('a')
    newChannel.text = '#' + channel;
    newChannel.href = '/channel/' + channel;
    newChannel.classList.add('channel-name');

    if (channel == currentChannel) {
      newChannel.style.textDecoration = 'underline';
    }

    document.getElementById('channels').appendChild(newChannel);
  }
}

function updateMessageHTML(messageData) {
  var messagesElem = document.getElementById('messages');

  if (JSON.stringify(messageData) != lastMessages) {
    messagesElem.innerHTML = '';

    for (const message of messageData) {
      var newMessage = document.createElement('div');
      newMessage.innerHTML = '<b class="message-name">' + message['name'] + '</b> ' + message['msg'];
      newMessage.classList.add('message')

      messagesElem.appendChild(newMessage);
    }

    lastMessages = JSON.stringify(messageData);

    messagesElem.lastChild.scrollIntoView(false);
  }
}

function GetJSON(url, callback) {
  var request = new XMLHttpRequest();

  request.open('GET', url, true);

  request.onload = () => {
    if (request.status == 200) {
      callback(JSON.parse(request.response));
    }
  };

  request.send(null);
}

function PostJSON(url, json) {
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader('Content-Type', 'application/json;');

  request.send(JSON.stringify(json));
}

function refreshMessages() {
  var currentChannel = window.location.href.split('/');
  currentChannel = currentChannel[currentChannel.length - 1];

  GetJSON('/api/channel/' + currentChannel, updateMessageHTML);
}

function sendMessage() {
  var message = document.getElementById('message-input').value;

  if (message == '') {
    return;
  }

  var currentChannel = window.location.href.split('/');
  currentChannel = currentChannel[currentChannel.length - 1];

  var messageData = {
    'channel': currentChannel,
    'name': 'User',
    'msg': message,
  }

  PostJSON('/api/send_message', messageData);

  document.getElementById('message-input').value = '';
}

GetJSON('/api/channels', updateChannelList);

refreshMessages();

setInterval(refreshMessages, 500);

document.getElementById('message-input').onkeypress = (e) => {
  if (!e) {
    e = window.event;
  }

  var keyCode = e.code || e.key;

  if (keyCode == 'Enter') {
    sendMessage();
  }
}
