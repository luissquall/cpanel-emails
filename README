# cpanel-emails

This script retrieves & prints a list of all the email addresses of a cPanel server. The list consists of lines formatted as: owner,user,email.

## Requirements

* [Node.js](http://nodejs.org/)
* [cPanel API2](http://docs.cpanel.net/twiki/bin/view/SoftwareDevelopmentKit/ApiIntroduction#API2)
* [A Remote Acces Key](http://docs.cpanel.net/twiki/bin/view/AllDocumentation/WHMDocs/RemoteAccess)

## Installation & configuration

Clone this project and install the package:

```
git clone git@github.com:luissquall/whm-emails.git
cd whm-emails
npm install
```
Copy config. template and set program settings:
```
cp config.json.default config.json
vim config.json
```

### Settings

* `api`: URL of the WHM address of your server. E.g. https://server.monkey.com:2087/
* `credentials.hash`: Server's remote access key

## How does it work?

The program requests [a list of all the accounts](http://docs.cpanel.net/twiki/bin/view/SoftwareDevelopmentKit/ListAccounts#Using the JSON API) in the server, extracts the users from the list and issues a new request per user to [Email::listpopssingle](http://docs.cpanel.net/twiki/bin/view/ApiDocs/Api2/ApiEmail#=Email::listpopssingle=) to obtain all email accounts from the user's account.
