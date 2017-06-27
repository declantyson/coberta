#!/usr/bin/env bash

projectdir=$1
recipedir=$2

cp -r $recipedir/ $projectdir/

cd $projectdir
npm init --yes
npm install grunt  grunt-contrib-concat  grunt-contrib-sass  grunt-contrib-uglify  grunt-contrib-cssmin  grunt-contrib-watch  grunt-contrib-connect  grunt-contrib-jshint  grunt-notify  git+https://github.com/declantyson/grunt-reactify --save-dev

npm install body-parser  ejs  express  fs  fs-extra  fs-path  mocha  chai  request --save-dev