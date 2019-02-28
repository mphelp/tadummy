This app is currently in development.
## Developer Notes

### Install node and npm
* For Amazon Linux users ...
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
```
Note: These installations are specific to the current shell user.
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
### Setup Oracle client
You must add the existing oracle client libraries on your machine within `$ORACLE_HOME/lib` to your `$LD_LIBRARY_PATH`
If your `.bashrc` or similar shell startup file:
```
export LD_LIBRARY_PATH=$ORACLE_HOME/lib:$LD_LIBRARY_PATH
```
## Usage: Go to server
```
$ npm run dev
```
