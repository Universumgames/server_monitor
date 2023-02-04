#!/bin/bash

scriptDir=$(dirname "$0")

serverUrl=$1
deviceToken=${2:-$(cat $scriptDir/../deviceToken)}

# prompt user for variables if not provided
if [ -z "$serverUrl" ]; then
  echo "Enter server url:"
  read -r serverUrl
fi

responseFile=$(mktemp)

# get system load info

# source https://stackoverflow.com/a/17732269/9551386
boottime=`sysctl -n kern.boottime | awk '{print $4}' | sed 's/,//g'`
unixtime=`date +%s`
uptimeSec=$(($unixtime - $boottime))
# uptime=`awk -v time=$timeAgo 'BEGIN { seconds = time % 60; minutes = int(time / 60 % 60); hours = int(time / 60 / 60 % 24); days = int(time / 60 / 60 / 24); printf("%.0f days, %.0f hours, %.0f minutes, %.0f seconds", days, hours, minutes, seconds); exit }'`

echo "Uptime: $uptimeSec seconds"

# get cpu load average
systemTopInfo=$(top -l 1 -s 0 | head)
cpuLoadAVGLine=$(echo "$systemTopInfo" | grep "Load Avg:" | tr -d ',')
cpuLoadAVG1m=$(echo "$cpuLoadAVGLine" | awk '{print $3}')
cpuLoadAVG5m=$(echo "$cpuLoadAVGLine" | awk '{print $4}')
cpuLoadAVG15m=$(echo "$cpuLoadAVGLine" | awk '{print $5}')
echo "Load average: $cpuLoadAVG1m (1m), $cpuLoadAVG5m (5m), $cpuLoadAVG15m (15m)"

# get ips of all interfaces with ifconfig
# source https://stackoverflow.com/a/27557715/9551386 (modified)
ips=$(ifconfig | grep "inet" | awk '{print $2}')
ipsJSON=$(echo "$ips" | jq -R -s -c 'split("\n") | [.[] | {ip: (. | split("%") | .[0]), interface: (. | split("%") | .[1])}]')

# generate json
json=$(jq -n \
  --arg uptimeSec "$uptimeSec" \
  --arg cpuLoadAVG1m "$cpuLoadAVG1m" \
  --arg cpuLoadAVG5m "$cpuLoadAVG5m" \
  --arg cpuLoadAVG15m "$cpuLoadAVG15m" \
  --argjson ipsJSON "$ipsJSON" \
  '{uptimeSeconds: $uptimeSec, cpuUsage: { avg1m: $cpuLoadAVG1m, avg5m: $cpuLoadAVG5m, avg15m: $cpuLoadAVG15m }, ipAddresses: $ipsJSON}')

http_code=$(curl -w '%{http_code}' -s -d "deviceToken=$deviceToken&status=$json" "$serverUrl"/device/pushSystemStatus -o "$responseFile")

content=$(cat "$responseFile")
rm "$responseFile"

if [ "$http_code" != "200" ]; then
  echo "Error $http_code"
  exit 1
fi

echo "Successfully pushed system load"