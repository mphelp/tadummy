This app is currently in development.
## How to contribute:

### Install nodejs and npm:
* For Amazon Linux users ...
```
curl --silent --location https://rpm.nodesource.com/setup_11.x | sudo bash -
sudo yum install -y nodejs
```
### Clone
```
$ git clone git@github.com:mphelp/tadummy.git
```
### Go to server dir
```
$ npm i
```
### Go to client dir
```
$ npm i
```
### Create **config.js** file in base directory
```
module.exports = {
    server: {
        port:   <YOUR SERVER PORT>,
        dbuser: <YOUR ORACLE DB USER>,
        dbpass: <YOUR ORACLE DB PASSWORD>,
    },
    client: {},
}
```
### Usage: Go to server
```
$ npm run dev
```
