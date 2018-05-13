recho "autostart kiosk" > ~/kiosk.log

SESSION_NAME="kiosk"
pwd=$(pwd) >> 
echo "DIR "$pwd >> ~/kiosk.log

tmux new-session -s $SESSION_NAME -n "server" -d

tmux send-keys -t $SESSION_NAME:0.0 'cd ~/kiosk ;node index.js' C-m

# force re-scan usb devices to locate /dev/ttyACM0 and run nodemon to restart on application crash ( due to not finding the arduino )
#tmux send-keys -t $SESSION_NAME:0.0 "cd ~/kiosk; sudo /etc/init.d/udev restart; sudo nodemon -x 'node index.js || touch index.js' " C-m