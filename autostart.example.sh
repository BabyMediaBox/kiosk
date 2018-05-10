recho "autostart kiosk" > ~/kiosk.log

SESSION_NAME="kiosk"
pwd=$(pwd) >> 
echo "DIR "$pwd >> ~/kiosk.log

tmux new-session -s $SESSION_NAME -n "server" -d

tmux send-keys -t $SESSION_NAME:0.0 'cd ~/kiosk ;node index.js' C-m 