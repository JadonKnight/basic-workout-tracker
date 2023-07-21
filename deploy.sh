#!/bin/bash

# Simple script to deploy the docker container

platform=$1

BUILD_PLATFORM=$platform docker compose build && \
BUILD_PLATFORM=$platform docker compose up -d


