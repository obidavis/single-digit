#!/bin/bash
HOST=obidavis.com
USERNAME=ubuntu
KEY=~/.ssh/id_rsa

REMOTE_DIR=/home/$USERNAME/www/obidavis.com/sudoku
BUILD_DIR="./build/"

rsync -apvz --delete $BUILD_DIR $USERNAME@$HOST:$REMOTE_DIR
ssh -i $KEY $USERNAME@$HOST "sudo systemctl restart nginx.service"