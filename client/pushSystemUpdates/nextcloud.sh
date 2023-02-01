#!/bin/bash

scriptDir=$(dirname "$0")

serverUrl=$1
nextcloudUrl=$2
deviceToken=${3:-$(cat "$scriptDir"/../deviceToken)}

# prompt user for variables if not provided
if [ -z "$serverUrl" ]; then
  echo "Enter server url:"
  read -r serverUrl
fi

if [ -z "$nextcloudUrl" ]; then
  echo "Enter nextcloud url:"
  read -r nextcloudUrl
fi

# get current nextcloud verison
nextcloudVersion=$(curl -s "$nextcloudUrl"/status.php | jq -r .versionstring)
echo "Current Nextcloud version: $nextcloudVersion"

# get newest nextcloud version from github
newestNextcloudVersion=$(curl -s https://api.github.com/repos/nextcloud/server/releases | jq -r '.[0].tag_name')
echo "Newest Nextcloud version: $newestNextcloudVersion"

# push nextcloud version to server
responseFile=$(mktemp)

nextcloudUpdate=$(echo "{\"updates\": [{\"name\": \"nextcloud\", \"currentVersion\": \"$nextcloudVersion\", \"newVersion\": \"$newestNextcloudVersion\"}]}" | jq -c .)

http_code=$(curl -w '%{http_code}' -s -d "deviceToken=$deviceToken&&updateList=$nextcloudUpdate" "$serverUrl"/software/pushSystemUpdates -o "$responseFile")

# nextcloud image url: https://nextcloud.com/media/nextcloud-logo.png

