#!/bin/bash

scriptDir=$(dirname "$0")

serverUrl=$1
matrixUrl=$2
deviceToken=${3:-$(cat "$scriptDir"/../deviceToken)}

# prompt user for variables if not provided
if [ -z "$serverUrl" ]; then
  echo "Enter server url:"
  read -r serverUrl
fi

if [ -z "$matrixUrl" ]; then
  echo "Enter matrix url:"
  read -r matrixUrl
fi

# get current matrix verison
matrixVersion=$(curl -s "$matrixUrl"/_synapse/admin/v1/server_version | jq -r .server_version)
echo "Current Matrix version: $matrixVersion"

# get newest matrix version from github
newestMatrixVersion=$(curl -s https://api.github.com/repos/matrix-org/synapse/releases | jq -r '.[0].tag_name')
echo "Newest Matrix version: $newestMatrixVersion"

# push matrix version to server
responseFile=$(mktemp)

matrixUpdate=$(echo "{\"updates\": [{\"name\": \"synapse\", \"currentVersion\": \"$matrixVersion\", \"newVersion\": \"$newestMatrixVersion\"}]}" | jq -c .)

http_code=$(curl -w '%{http_code}' -s -d "deviceToken=$deviceToken&&updateList=$matrixUpdate" "$serverUrl"/software/pushSystemUpdates -o "$responseFile")

# matrix logo https://matrix.org/images/matrix-logo-white.svg