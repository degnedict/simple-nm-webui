# simple-nm-webui
A webUI for network-manager to connect to wifi networks using the Touchscreen

![image](https://github.com/degnedict/simple-nm-webui/assets/138185406/1755136a-d4ec-43eb-951e-5a7ea46b7326)

# Installation Instructions

I am utilizing Apache, and I have simply transferred the folder into a directory within my `/var/www/html`. It can be accessed via `localhost/path/to/folder/index.html`.

Next, install Flask and CORS by executing the following command:

sudo apt install python3-flask python3-flask-cors

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
now check if the serive is running:
```
sudo systemctl status YOUR_SERVICE.service
```
the outout should contain the word "Active" in green letters.

Now we need to install a Firefox extension to get a virtual keyboard which can be found [Here](https://addons.mozilla.org/en-US/firefox/addon/fx-osk/)

Now everything should work, if not feel free to ask.
