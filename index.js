'use strict';

const Alexa = require('alexa-sdk');
const https = require('https');

const handlers = {
    'LaunchRequest': function () {
        this.emit(':elicitSlot', 'numberplate', 'Hi, I\'m Toxicity Charge and can check if you have to pay the T-charge for driving in London. What\'s your numberplate to check?', 'I need the numberplate given letter by letter. Also, I can understand the NATO phonetic alphabet. What\'s your numberplate?');
    },
    'CheckVehicle': function () {
        if(!this.event.request.intent.slots.numberplate.value) {
            // Prompt for the numberplate if not provided
            this.emit(':elicitSlot', 'numberplate', 'Sure. What\'s your numberplate?', 'I need the numberplate done letter by letter. Also, I can understand the NATO phonetic alphabet. What\'s your numberplate?');
        } else {
            let numberplate = this.event.request.intent.slots.numberplate.value;

            // Interpret NATO phonetic alphabet if numberplate > expected length
            // Well - any words that begin with the desired letters would work
            if (numberplate.replace(/\s/g, '').length > 7) {
                // Create empty new numberplate field, add first letter of each
                // word to it. If block of numbers, leave intact.
                let nn = '';
                numberplate.split(' ').forEach((l) => {
                    if(parseInt(l).toString() == l) {
                        nn += l;
                    } else {
                        nn += l[0];
                    }
                });

                numberplate = nn;
            }

            // Remove spaces and capitalise
            numberplate = numberplate.replace(/\s/g, '').toUpperCase();

            // TfL Unified API
            let url = 'https://api.tfl.gov.uk/Vehicle/EmissionSurcharge?vrm=' + numberplate;
            getData(url, (car) => {
                let speech = '';

                // Create nice sentence explaining whether they need to pay or not
                if (car.compliance) {
                    if (car.make && car.model) {
                        speech += 'Your ' + toTitleCase(car.make + ' ' + car.model) + ' is ';
                    } else {
                        speech += 'Your car is ';
                    }

                    switch (car.compliance) {
                        case "Compliant":
                            speech += 'not subject to the T-Charge, so you don\'t need to pay';
                            break;
                        case "NotCompliant":
                            speech += 'subject to the T-Charge, so you need to pay.';
                            break;
                        case "Exempt":
                            speech += 'exempt from the T-Charge, so you don\'t need to pay';
                            break;
                        default:
                            speech = 'I couldn\'t find details for your vehicle with registration <say-as interpret-as="characters">' + numberplate + '</say-as>.';
                    }
                } else {
                    speech = 'I couldn\'t find details for your vehicle with registration <say-as interpret-as="characters">' + numberplate + '</say-as>.';
                }

                this.emit(':tell', speech);
            });
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit('LaunchRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Ok, Bye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Ok, Bye!');
    },
    'Unhandled': function () {
        this.emit(':ask', 'Sorry, I didn\'t get that. Please can you repeat it?', 'Sorry, what was that?');
    }
};

// Gets JSON data from a HTTPS source.
function getData (url, callback) {
    let req = https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            callback(JSON.parse(data));
        });
    }).on('error', (err) => {
        console.error('Error getting data: ', err);
        this.emit(':tell', 'There was an error connecting to the database. Please try again later.');
    });
}

// Dirty toTitleCase method - almost certainly a better way to do this,
// but I'm still proud at the mess this is anyways
function toTitleCase(str) {
	return str.toLowerCase().split(' ').map((str) => {return str.charAt(0).toUpperCase() + str.slice(1)}).join(' ');
}

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
