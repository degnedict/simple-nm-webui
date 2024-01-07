let selectedBSSID;
let protocol = window.location.protocol+'//';
let hostname = window.location.host;
let uri = protocol+hostname;

function searchNetworks() {
    fetch(uri+'/api/wifi-networks')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network error');
            }
            return response.json();
        })
        .then(networks => {
            if (!Array.isArray(networks)) {
                throw new Error('Response is not an array');
            }
            const list = document.getElementById('network-list');
            list.innerHTML = '';
            networks.forEach(net => {
                const item = document.createElement('li');
                item.textContent = `SSID: ${net.ssid}, Security: ${net.security}, Strength: ${net.strength}, Band: ${net.band}`;
                item.onclick = () => selectNetwork(net.ssid,net.bssid);
                list.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error retrieving the networks.');
        });
}

function selectNetwork(ssid,bssid) {
    selectedSSID = ssid;
    selectedBSSID = bssid;
    document.getElementById('selected-ssid').value = ssid;
}

function connectToNetwork() {
    // Verwenden Sie den Wert aus dem SSID-Feld, falls keine SSID aus der Liste ausgewählt wurde
    const network = selectedBSSID ?? document.getElementById('selected-ssid').value;
    const password = document.getElementById('wifi-password').value;

    fetch(uri+'/api/connect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ network: network, password: password })
    })
    .then(response => response.json())
    .then(data => {
        alert('Connection result: ' + data.result);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error connecting to the network.');
    });
}