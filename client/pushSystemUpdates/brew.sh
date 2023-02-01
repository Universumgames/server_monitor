#!/bin/bash

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
brew update

outdatedBrewPackages=$(brew outdated --json | jq . -c)

# change to custom json format
outdatedBrewPackages=$(echo "$outdatedBrewPackages" | jq -c '{updates: [.[][] | {name: .name, currentVersion: (.installed_versions[0]? // .installed_versions), newVersion: .current_version}]}')

# count number of updates
updateCounts=$(echo "$outdatedBrewPackages" | jq '.[] | length')
# sum update counts for software types
updateCount=$(echo "$updateCounts" | paste -s -d+ - | bc)

echo "Found $updateCount updates"

# send update count and list of updates to server
http_code=$(curl -w '%{http_code}' -s -d "deviceToken=$deviceToken&updateCount=$updateCount&updateList=$outdatedBrewPackages" "$serverUrl"/software/pushSystemUpdates -o "$responseFile")

content=$(cat "$responseFile")
rm "$responseFile"

if [ "$http_code" != "200" ]; then
  echo "Error $http_code"
  exit 1
fi

echo "Successfully pushed system updates"

echo "Response from server: $content"