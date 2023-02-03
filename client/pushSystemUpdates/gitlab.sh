#!/bin/bash

scriptDir=$(dirname "$0")


serverUrl=$1
gitlabUrl=$2
gitlabAccessToken=$3
deviceToken=${4:-$(cat "$scriptDir"/../deviceToken)}

# prompt user for variables if not provided
if [ -z "$serverUrl" ]; then
  echo "Enter server url:"
  read -r serverUrl
fi

if [ -z "$gitlabUrl" ]; then
  echo "Enter gitlab url:"
  read -r gitlabUrl
fi

if [ -z "$gitlabAccessToken" ]; then
  echo "Enter gitlab access token:"
  read -r gitlabAccessToken
fi

# get gitlab version
gitlabVersion=$(curl -s "$gitlabUrl"/api/v4/version --header "PRIVATE-TOKEN: $gitlabAccessToken" | jq -r .version)
echo "Current Gitlab version: $gitlabVersion"

# get newest gitlab version
newestGitlabVersion=$(curl -s https://api.github.com/repos/gitlabhq/gitlabhq/tags | jq -r '.[0].name')
# remove v from version
newestGitlabVersion=${newestGitlabVersion:1}
echo "Newest Gitlab version: $newestGitlabVersion"

# push gitlab version to server
responseFile=$(mktemp)

gitlabUpdate=$(echo "{\"updates\": [{\"name\": \"gitlab\", \"currentVersion\": \"$gitlabVersion\", \"newVersion\": \"$newestGitlabVersion\"}]}" | jq -c .)

http_code=$(curl -w '%{http_code}' -s -d "deviceToken=$deviceToken&&updateList=$gitlabUpdate"  "$serverUrl"/software/pushSystemUpdates -o "$responseFile")


# gitlab image url: https://about.gitlab.com/images/press/press-kit-icon.svg 
