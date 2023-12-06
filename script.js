let selectedSSID = '';

function searchNetworks() {
    fetch('http://localhost:5000/api/wifi-networks')
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkfehler');
            }
            return response.json();
        })
        .then(networks => {
            if (!Array.isArray(networks)) {
                throw new Error('Antwort ist kein Array');
            }
            const list = document.getElementById('network-list');
            list.innerHTML = '';
            networks.forEach(net => {
                const item = document.createElement('li');
                item.textContent = `SSID: ${net.ssid}, Sicherheit: ${net.security}, Signal: ${net.strength}, Band: ${net.band}`;
                item.onclick = () => selectNetwork(net.ssid);
                list.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Fehler:', error);
            alert('Es gab einen Fehler beim Abrufen der Netzwerke.');
        });
}

function selectNetwork(ssid) {
    selectedSSID = ssid;
    document.getElementById('selected-ssid').value = ssid;
}

function connectToNetwork() {
    // Verwenden Sie den Wert aus dem SSID-Feld, falls keine SSID aus der Liste ausgewählt wurde
    const ssid = selectedSSID || document.getElementById('selected-ssid').value;
    const password = document.getElementById('wifi-password').value;

    fetch('http://localhost:5000/api/connect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ssid: ssid, password: password })
    })
    .then(response => response.json())
    .then(data => {
        alert('Verbindungsergebnis: ' + data.result);
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Es gab einen Fehler bei der Verbindung.');
    });
}