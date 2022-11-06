import time

from flask import Flask, request, make_response, jsonify

app = Flask(__name__)

channels = {
    'general': [
        {
            'name': 'Bot',
            'msg': 'General chat',
            'time': 0,
        }
    ],
    'games': [
        {
            'name': 'Bot',
            'msg': 'Games chat',
            'time': 0,
        }
    ],
    'secret': [
        {
            'name': 'Bot',
            'msg': 'sEcReT chat',
            'time': 0,
        }
    ]
}

f = open('messaging.html', 'r')
messaging_layout = f.read()
f.close()

def clean(string):
    return string.replace('<', '').replace('>', '')

@app.route('/')
def home():
    output = 'Welcome to my home. We appear to be lacking in <i>furniture</i>.<br><br>Channels:<br>'
    for channel in channels:
        output += '<a href="/channel/' + channel + '">#' + channel + '</a><br>'
    return output

@app.route('/channel/<channel_id>')
def channel(channel_id):
    return messaging_layout

@app.route('/api/channels')
def api_channels():
    return jsonify(list(channels))

@app.route('/api/channel/<channel_id>')
def api_channel(channel_id):
    return jsonify(channels[channel_id])

@app.route('/api/send_message', methods=['POST'])
def api_send_message():
    sent_message = request.json

    channel = sent_message['channel']

    message_data = {
        'msg': clean(sent_message['msg']),
        'name': clean(sent_message['name']),
        'time': time.time(),
    }

    channels[channel].append(message_data)

    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(port=80)
