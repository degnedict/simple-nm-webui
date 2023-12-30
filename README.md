# simple-nm-webui
A webUI for network-manager to connect to wifi networks using the Touchscreen

![image](https://github.com/degnedict/simple-nm-webui/assets/138185406/1755136a-d4ec-43eb-951e-5a7ea46b7326)

# Prerequisites

## Webserver
To access the web-interface a [webserver](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_web_server) is needed.
Place the content of this repository into a directory the webserver has access e.g. `/var/www/html`.

### apache2
tbd

### nginx
#### Install nginx
```
apt update && apt install nginx -y
```

#### Minimal configuration
```
server {
        listen 80 default_server;
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;
        server_name _;
        location / {
                try_files $uri $uri/ =404;
        }
        location /api/ {
                # The host and port of the flask application
                proxy_pass http://localhost:5000/api/;
        }
}
```

#### Restart service
```
sudo systemctl restart nginx
```

## Raspberry Pi
### Update package list
```
sudo apt-get update
```
### Make sure network-manager is installed
```
sudo apt-get install network-manager
```
### Call the raspi-config tool
```
sudo raspi-config
```
### Enable NetworkManager for Network configuration on the Raspberry Pi
```
6 Advanced Options -> AA Network Config -> NetworkManager -> Ok 
```
### Reboot
```
sudo reboot
```

### OPTIONAL: Make sure nmcli commands can be executed
```
nmcli dev
```
**Should list your network devices*

### OPTIONAL: Get state of Wi-Fi-device
```
nmcli radio wifi
```

### OPTIONAL: Identify a WI-Fi Access Point
```
nmcli dev wifi list
```

### OPTIONAL: Connect to Wi-Fi using `BSSID` or `SSID`
```
sudo nmcli --ask dev wifi connect network-ssid
```
**Using --ask you will be asked to type-in the Wi-Fi password in a password prompt*


# Installation Instructions

Next, install dependencies by executing the following command:
```
sudo apt install python3 python3-flask python3-flask-cors dbus
```
After this, you are ready to run the Python script. Since it requires permissions to manage the Wi-Fi, you should either run it as root (note that this is risky and should only be done for testing purposes) or assign the necessary permissions to another user. [This](https://superuser.com/questions/1148322/how-to-allow-non-su-user-to-configure-network) is a good resource on this topic.

As long as the Python script is active, you should be able to search for networks and establish connections with them.

If everything is functioning correctly, you'll need to configure a service to keep the Python script running in the background continuously.
Place a file named YOUR_SERVICE.service in `/etc/systemd/system`

This is an Example, Adjust Path and User to your needs:
```
[Unit]
Description=Python WLAN Manager Service
After=network.target

[Service]
Environment="FLASK_HOST=0.0.0.0"
Environment="FLASK_PORT=5000"
User=USERNAME
ExecStart=python3 PATH/TO/wlan_manager.py
Restart=always
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
```
Now enable and start the service using:
```
sudo systemctl enable YOUR_SERVICE.service
sudo systemctl start YOUR_SERVICE.service
```
now check if the service is running:
```
sudo systemctl status YOUR_SERVICE.service
```
the outout should contain the word "Active" in green letters.

Now we need to install a Firefox extension to get a virtual keyboard which can be found [Here](https://addons.mozilla.org/en-US/firefox/addon/fx-osk/)

Now everything should work, if not feel free to ask.
