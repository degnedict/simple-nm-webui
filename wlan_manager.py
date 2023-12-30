from flask import Flask, jsonify, request
import subprocess
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/wifi-networks')
def get_wifi_networks():
    try:
        scan_result = subprocess.check_output(['nmcli', '-t', '-f', 'SSID,SECURITY,BARS,FREQ', 'dev', 'wifi']).decode('utf-8')
        networks = []
        for line in scan_result.strip().split('\n'):
            ssid, security, strength, freq = line.split(':')

            # Remove 'MHz' from freq and convert string to int
            freq = int(freq.replace(' MHz', ''))

            band = '5 GHz' if freq >= 5000 else '2.4 GHz'
            networks.append({'ssid': ssid, 'security': security, 'strength': strength, 'band': band})
        return jsonify(networks)
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/api/connect', methods=['POST'])
def connect_to_network():
    data = request.json
    ssid = data['ssid']
    password = data['password']

    try:
        subprocess.run(['nmcli', 'dev', 'wifi', 'connect', network, 'password', password], check=True)
        return jsonify({'result': 'Successfully connected!'})
    except subprocess.CalledProcessError as e:
        return jsonify({'result': f'Error connecting. Wrong password?'}), 500

if __name__ == '__main__':
    app.run(port=5000)
