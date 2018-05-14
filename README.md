# kiosk
The kiosk handles incomming http request send when the socket receives a command from the remote. 

## Implemented:
- Setting single RBG color
- Setting and RGB sequence that changes color after 2 seconds.
- Send to server when a button is pressed
- Load playlists for each button

# Requirements:
- tmux ( you can run witout )
- nodejs 4+
- browser ( supporting kiosk mode )
- [Running the BabyMediaBox server](https://github.com/BabyMediaBox/server)
- (Optional) [Running the BabyMediaBox arduino controller](https://github.com/BabyMediaBox/controller)

# Running

Start your browser in kiosk mode and point it to the BabyBox server machine

For example
```
/usr/bin/chromium --kiosk --window-position=0,0 http://BabyBoxServer:3010 &
```

# [![Demo](https://mraiur.com/files/BabyMediaBox.gif)](https://youtu.be/wDMkf0tSyG4)