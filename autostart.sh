echo "autostart kiosk" > ~/kiosk.log

SESSION_NAME="kiosk"
pwd=$(pwd)

tmux new-session -s $SESSION_NAME -n "server" -d

tmux send-keys -t $SESSION_NAME:0.0 'node index.js' C-m 