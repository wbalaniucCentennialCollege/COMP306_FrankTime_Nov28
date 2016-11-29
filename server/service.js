'use strict'

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

// geokey : AIzaSyCG0t3-haR1enIywKMUEI6zK67YwJb1LTs
// https://maps.googleapis.com/maps/api/geocode/json?address=berlin&key=AIzaSyCG0t3-haR1enIywKMUEI6zK67YwJb1LTs

// timezone key: AIzaSyCPcvT0EePNTelpu3oTH-VxlM9PxyMu7qA
// https://maps.googleapis.com/maps/api/timezone/json?location=&timestamp=&key=AIzaSyCPcvT0EePNTelpu3oTH-VxlM9PxyMu7qA

service.get('/service/:location', (req, res, next) => {

    request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key=AIzaSyCG0t3-haR1enIywKMUEI6zK67YwJb1LTs', (err, response) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        const location = response.body.result[0].geometry.location;
        const timestamp = +moment().format('X');

        request.get('https://maps.googleapis.com/maps/api/timezone/json?location='+ location.lat + ',' + location.lng + '&timestamp='+ timestamp +'&key=AIzaSyCPcvT0EePNTelpu3oTH-VxlM9PxyMu7qA', (err, response) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            } 

            const result = response.body;
            const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

            res.json({result: timeString});
        });
    });
});

module.exports = service;