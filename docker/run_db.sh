#!/bin/bash
scriptDir=$(dirname "$0")
docker compose -f $scriptDir/compose-db.yml up -d