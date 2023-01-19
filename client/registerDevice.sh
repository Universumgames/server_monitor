#!/bin/bash

registerToken=$1
deviceName=$2
serverUrl=$3

# prompt user for variables if not provided
if [ -z "$registerToken" ]; then
  echo "Enter register token:"
  read -r registerToken
fi

if [ -z "$deviceName" ]; then
  echo "Enter device name:"
  read -r deviceName
fi

if [ -z "$serverUrl" ]; then
  echo "Enter server url:"
  read -r serverUrl
fi

responseFile=$(mktemp)

# register device
http_code=$(curl -w '%{http_code}' -s -d "registerToken=$registerToken&deviceName=$deviceName" "$serverUrl"/device/registerDevice -o "$responseFile")

content=$(cat "$responseFile")
rm "$responseFile"

if [ "$http_code" != "200" ]; then
  echo "Error $http_code"
  exit 1
fi

# save device token to file
echo $(echo "$content" | jq -r '.token') > ./deviceToken

echo "Successfully registered this device as $deviceName with token $(cat ./deviceToken)"