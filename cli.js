#!/usr/bin/env node

var _ = require('lodash');
var request = require('request');
var async = require('async');

var config = require('./config.json');
var services = {};
var reqOptions = {};

services = {
    'listaccts': config.api + 'json-api/listaccts?api.version=1',
    'listpopssingle': config.api + 'json-api/cpanel?cpanel_jsonapi_apiversion=3&cpanel_jsonapi_user=<%= user %>&cpanel_jsonapi_module=Email&cpanel_jsonapi_func=list_pops'
};
reqOptions = {
    json: true,
    headers: {
        'Authorization': 'WHM root:' + config.credentials.hash
    },
    rejectUnauthorized: false
};


function onAccountsResponse(error, response, body) {
    var data;

    if (error) {
        console.error(error);
    } else {
        if (response.statusCode == 200) {
            data = body.data;

            if (data.acct.length) {
                async.eachLimit(data.acct, 3, function(account, cb) {
                    var url = _.template(services['listpopssingle'], account);
                    request.get(_.merge({url: url}, reqOptions), onEmailsResponse.bind(null, account, cb));
                });
            }
        } else {
            console.error('Error %s on listaccts.', response.statusCode);
        }
    }
}

function onEmailsResponse(account, cb, error, response, body) {
    var data;
    var line;

    if (error) {
        console.error('Error ' + error);
    } else {
        if (response.statusCode == 200) {
            data = body.result.data;

            if (data.length) {
                data.forEach(function(email) {
                    line = account.owner + ',' + account.user + ',' + email.email;
                    console.log(line);
                });
            }
        } else {
            console.error('Error %s on listpopssingle.', response.statusCode);
        }
    }

    cb();
}

request.get(_.merge({url: services['listaccts']}, reqOptions), onAccountsResponse);
