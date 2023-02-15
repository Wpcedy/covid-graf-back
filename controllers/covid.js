const https = require('https');
const axios = require('axios');

const config = require('config');
const url = config.get('covid-api.url');
const key = process.env.RAPIDAPI_KEY;
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
        res.json(responseReports);
    }).catch(err => {
        res.json({ message: 'Error: ' + err.message });
    });
};

module.exports = { regions, report };
