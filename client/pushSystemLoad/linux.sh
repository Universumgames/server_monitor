#!/bin/bash

scriptDir=$(dirname "$0")

serverUrl=$1

# prompt user for variables if not provided
if [ -z "$serverUrl" ]; then
  echo "Enter server url:"
  read serverUrl
fi

responseFile=$(mktemp)

# get system uptime
uptimeSec=$(awk '{print $1}' /proc/uptime)
echo "Uptime: $uptimeSec seconds"

# get cpu load average
uptime=$(uptime)
cpuLoadAVG1m=$(echo "$uptime" | awk '{print $10}' | tr -d ',')
cpuLoadAVG5m=$(echo "$uptime" | awk '{print $11}' | tr -d ',')
cpuLoadAVG15m=$(echo "$uptime" | awk '{print $12}' | tr -d ',')
echo "Load average: $cpuLoadAVG1m (1m), $cpuLoadAVG5m (5m), $cpuLoadAVG15m (15m)"

# get ips of all interfaces with ip
# source https://stackoverflow.com/a/12624100/9551386
ips=$(ip -o addr | awk '!/^[0-9]*: ?lo|link\/ether/ {print $2" "$4}')
ipsJSON=$(echo "$ips" | jq -R -s -c 'split("\n") | [.[] | {ip: (. | split(" ") | .[0]), interface: (. | split(" ") | .[1])}]')

# generate json
json=$(jq -n \
  --arg uptimeSec "$uptimeSec" \
  --arg cpuLoadAVG1m "$cpuLoadAVG1m" \
  --arg cpuLoadAVG5m "$cpuLoadAVG5m" \
  --arg cpuLoadAVG15m "$cpuLoadAVG15m" \
  --argjson ipsJSON "$ipsJSON" \
  '{uptimeSeconds: $uptimeSec, cpuUsage: { avg1m: $cpuLoadAVG1m, avg5m: $cpuLoadAVG5m, avg15m: $cpuLoadAVG15m }, ipAddresses: $ipsJSON}')

http_code=$(curl -w '%{http_code}' -s -d "status=$json" "$serverUrl"/device/pushSystemStatus -o "$responseFile")

echo "Successfully pushed system load"