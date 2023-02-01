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


# get current pihole version
piholeVersionResponse=$(pihole -v)

piholeCurrentVersion=$(echo "$piholeVersionResponse" | grep "Pi-hole version" | cut -d' ' -f6)
piholeNewestVersion=$(echo "$piholeVersionResponse" | grep "Pi-hole version" | cut -d' ' -f8 | cut -d')' -f1)

adminLTECurrentVersion=$(echo "$piholeVersionResponse" | grep "AdminLTE version" | cut -d' ' -f6)
adminLTENewestVersion=$(echo "$piholeVersionResponse" | grep "AdminLTE version" | cut -d' ' -f8 | cut -d')' -f1)

FTLCurrentVersion=$(echo "$piholeVersionResponse" | grep "FTL version" | cut -d' ' -f6)
FTLNewestVersion=$(echo "$piholeVersionResponse" | grep "FTL version" | cut -d' ' -f8 | cut -d')' -f1)

# push updates to server
responseFile=$(mktemp)

piholeUpdates=$(jq -n --arg currentVersion "$piholeCurrentVersion" --arg newVersion "$piholeNewestVersion" '{"name": "pihole", "currentVersion": $currentVersion, "newVersion": $newVersion}')
adminLTEUpdates=$(jq -n --arg currentVersion "$adminLTECurrentVersion" --arg newVersion "$adminLTENewestVersion" '{"name": "pihole-adminLTE", "currentVersion": $currentVersion, "newVersion": $newVersion}')
FTLUpdates=$(jq -n --arg currentVersion "$FTLCurrentVersion" --arg newVersion "$FTLNewestVersion" '{"name": "pihole-FTL", "currentVersion": $currentVersion, "newVersion": $newVersion}')

updateList=$(jq -n --argjson piholeUpdates "$piholeUpdates" --argjson adminLTEUpdates "$adminLTEUpdates" --argjson FTLUpdates "$FTLUpdates" '{"updates": [$piholeUpdates, $adminLTEUpdates, $FTLUpdates]}')

# push updates to server
responseFile=$(mktemp)

http_code=$(curl -w '%{http_code}' -s -d "deviceToken=$deviceToken&updateList=$updateList" "$serverUrl"/software/pushSystemUpdates -o "$responseFile")
