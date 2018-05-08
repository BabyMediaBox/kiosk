# kiosk
The kiosk handles incomming http request send when the socket receives a command from the remote. 

## Implemented:
- Setting single RBG color
- Setting and RGB sequence that changes color after 2 seconds.

## TODO :
- Send to server when a button is pressed


# Requirements:
tmux ( you can run witout )
nodejs 4+
browser ( supporting kiosk mode )

# Running

Start your browser in kiosk mode and point it to the BabyBox server machine

For example
```
/usr/bin/chromium --kiosk --window-position=0,0 http://BabyBoxServer:3010 &
```