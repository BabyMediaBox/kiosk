#!/bin/bash
#awk -F"[][]" '/dB/ { print $2 }' <(amixer sget Master)
vol=$(awk '/%/ {gsub(/[\[\]]/,""); print $4}' <(amixer sget Master))
echo $vol