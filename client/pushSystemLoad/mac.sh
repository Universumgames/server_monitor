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
systemUptime=$(uptime)
systemTopInfo=$(top -l 1 -s 0 | head)