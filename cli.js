#!/usr/bin/env node

var _ = require('lodash'),
    request = require('request');

var config = require('./config.json'),
    services = {},
    reqOptions = {},
    accounts = {},
    emails = [],
    count;

services = {
    'listaccts': config.api + 'json-api/listaccts',
    'listpopssingle': config.api + 'json-api/cpanel?cpanel_jsonapi_user=<%= user %>&cpanel_jsonapi_module=Email&cpanel_jsonapi_func=listpopssingle'
};
reqOptions = {
    json: true,
    headers: {
        'Authorization': 'WHM root:' + config.credentials.hash
    },
    rejectUnauthorized: false
};


function onAccountsResponse(error, response, body) {
    var url;

    if (!error && response.statusCode == 200) {
        count = body.acct.length;
        if (count) {
            body.acct.forEach(function(account, index) {
                accounts[account.user] = account;
                url = _.template(services['listpopssingle'], account);
                request.get(_.merge({url: url}, reqOptions), onEmailsResponse.bind(null, account));
            });
        }
    }
}
function onEmailsResponse(account, error, response, body) {
    var data,
        line;

    if (!error && response.statusCode == 200) {
        data = body.cpanelresult.data;
        if (data.length) {
            data.forEach(function(email) {
                line = account.owner + ',' + account.user + ',' + email.email;
                emails.push(line);
            });
        }
    }
    if (--count == 0) {
        console.log(emails.sort().join("\n"));
    }
}

request.get(_.merge({url: services['listaccts']}, reqOptions), onAccountsResponse);
