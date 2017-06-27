#!/usr/bin/env bash

grunt sass
grunt reactify
grunt concat
ttab grunt --force
ttab npm start