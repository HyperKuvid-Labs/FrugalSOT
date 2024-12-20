#!/bin/bash
filename=data/output.txt
filename1=data/output1.txt
# read -p "Enter file name: " $filename
# data=$(<"$filename")
# echo "$data"
data1=$(<"$filename")
data2=$(<"$filename1")

python3 frugalSot.py "$data1" "$data2"


