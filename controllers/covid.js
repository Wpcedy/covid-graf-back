// const redis = require('redis');
// const client = redis.createClient();
// client.connect();

// client.on("error", (error) => {
//     console.error(error);
// });

const https = require('https');
const axios = require('axios');

const config = require('config');
const url = config.get('covid-api.url');
const key = config.get('covid-api.key');
const host = config.get('covid-api.host');

const regions = (req, res, next) => {
    axios({
        method: 'get',
        url: url + '/regions',
        headers: {
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': host
        }
    })
        .then(response => {
            var response = response.data.data;
            res.json(response);
        })
        .catch(err => {
            res.json({ message: 'Error: ' + err.message });
        });
};

const report = async (req, res, next) => {
    // var keyRedis = req.query.region_name + '&' + req.query.iso
    // let covidReports = await client.get(`${keyRedis}`);
    // if (!covidReports) {
        axios({
            method: 'get',
            url: url + '/reports?region_name=' + req.query.region_name + '&iso=' + req.query.iso,
            headers: {
                'X-RapidAPI-Key': key,
                'X-RapidAPI-Host': host
            }
        }).then(async response => {
            var responseReports = {
                'confirmed': 0,
                'deaths': 0,
                'recovered': 0,
                'active': 0
            };
            var response = response.data.data;
            response.forEach(province => {
                responseReports.confirmed += province.confirmed;
                responseReports.deaths += province.deaths;
                responseReports.recovered += province.recovered;
                responseReports.active += province.active;
            });
            // await client.set(`${keyRedis}`, JSON.stringify(responseReports));
            res.json(responseReports);
        }).catch(err => {
            res.json({ message: 'Error: ' + err.message });
        });
    // } else {
    //     res.json(JSON.parse(covidReports));
    // }
};

module.exports = { regions, report };
