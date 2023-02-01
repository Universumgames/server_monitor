#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi


scriptDir=$(dirname "$0")

serverUrl=$1
deviceToken=${2:-$(cat "$scriptDir"/../deviceToken)}

# prompt user for variables if not provided
if [ -z "$serverUrl" ]; then
  echo "Enter server url:"
  read -r serverUrl
fi

if [ -z "$deviceToken" ]; then
  echo "Enter device token:"
  read -r deviceToken
fi

responseFile=$(mktemp)

# get software updates
apt-get update

aptOutput=$(apt-get upgrade -sqV)

# isolate list of updates from apt-get output
aptUpdates=$(echo "$aptOutput" | grep "=>")
aptUpdateCount=$(echo "$aptUpdates" | wc -l)

# remove multiple spaces, leading spaces from each line
aptUpdates=$(echo "$aptUpdates" | sed 's/ */ /g' | sed 's/^ *//g')
# remove newlines
aptUpdates=$(echo "$aptUpdates" | tr '\n' ' ')
# remove "(" and ")" from each line
aptUpdates=$(echo "$aptUpdates" | sed 's/(//g' | sed 's/)//g')

# format apt updates as json
aptUpdatesJsonElements=$(echo "$aptUpdates" | while read -r line; do jq -R -s -c 'split(" ") | {name: .[0], currentVersion: .[1], newVersion: .[3]}' <<< "$line"; done;)

aptUpdatesToJsonArray=$(echo "$aptUpdatesJsonElements" | jq -s -c .)

aptUpdatesJson="{\"updates\": $aptUpdatesToJsonArray}"

http_code=$(curl -w '%{http_code}' -s -d "deviceToken=$deviceToken&updateCount=$aptUpdateCount&updateList=$aptUpdatesJson" "$serverUrl"/software/pushSystemUpdates -o "$responseFile")

content=$(cat "$responseFile")
rm "$responseFile"

if [ "$http_code" != "200" ]; then
  echo "Error $http_code"
  exit 1
fi

echo "Successfully pushed system updates"

echo "Response from server: $content"