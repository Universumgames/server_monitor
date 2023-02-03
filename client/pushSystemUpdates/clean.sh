#!/bin/bash

scriptDir=$(dirname "$0")
serverUrl=$1
deviceToken=${2:-$(cat "$scriptDir"/../deviceToken)}

# prompt user for variables if not provided
if [ -z "$serverUrl" ]; then
  echo "Enter server url:"
  read -r serverUrl
fi

# clear system updates first
curl -s -d "deviceToken=${deviceToken}" "${serverUrl}"/software/clearSystemUpdates