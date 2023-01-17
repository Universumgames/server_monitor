#!/bin/bash

deviceToken=${1:-$(cat ./deviceToken)}
serverUrl=$2
softwareName=$3
softwareVersion=$4
newestVersion=${5:-$softwareVersion}

# prompt user for variables if not provided
if [ -z "$deviceToken" ]; then
  echo "Enter device token:"
  read deviceToken
fi

if [ -z "$serverUrl" ]; then
  echo "Enter server url:"
  read serverUrl
fi

if [ -z "$softwareName" ]; then
  echo "Enter software name:"
  read softwareName
fi

if [ -z "$softwareVersion" ]; then
  echo "Enter software version:"
  read softwareVersion
fi

if [ -z "$newestVersion" ]; then
  echo "Enter newest version:"
  read newestVersion
fi

responseFile=$(mktemp)

# register software
http_code=$(curl -w '%{http_code}' -s -d "deviceToken=$deviceToken&softwareName=$softwareName&softwareVersion=$softwareVersion&newestVersion=$newestVersion" "$serverUrl"/registerSoftware -o "$responseFile")

content=$(cat "$responseFile")
rm "$responseFile"

if [ "$http_code" != "200" ]; then
  echo "Error $http_code"
  exit 1
fi

echo "Successfully registered $softwareName $softwareVersion"
echo $content