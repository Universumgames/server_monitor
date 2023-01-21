#!/bin/bash
scriptDir=$(dirname "$0")
docker compose -f $scriptDir/compose-full.yml up -d