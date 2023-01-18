#!/bin/bash

scriptDir=$(dirname "$0")

serverUrl=$1

# prompt user for variables if not provided
if [ -z "$serverUrl" ]; then
  echo "Enter server url:"
  read serverUrl
fi

responseFile=$(mktemp)

# get system load info


# get ips of all interfaces with ip
# source https://stackoverflow.com/a/12624100/9551386
ips=$(ip -o addr | awk '!/^[0-9]*: ?lo|link\/ether/ {print $2" "$4}')