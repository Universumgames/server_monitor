#!/bin/bash
scriptDir=$(dirname "$0")
export COMPOSE_PROJECT_NAME=server_monitoring
docker compose -f $scriptDir/compose-full.yml up -d