This app is currently in development.
# Developer Notes

### Install node and npm
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
### Configure client, server, and db: Create **config.js** file in base directory, then create links to this file in both the client and server directories
```
module.exports = {
    ip:     <YOUR DEVICE IP>,
    client: {
        port:   <YOUR CLIENT PORT>
    },
    server: {
        port: <YOUR SERVER PORT>,
        https:  null,
        database: {
            user: <YOUR ORACLE DB USER>,
            password: <YOUR ORACLE DB PASSWORD>,
            connectString: <CONNECT STRING>
        }
    },
    netid: <NET ID>
}
```
### Configure client: Create .env.local file in client directory
```
PORT = <YOUR CLIENT PORT>
```
### Setup Oracle client
You must add the existing oracle client libraries on your machine within `$ORACLE_HOME/lib` to your `$LD_LIBRARY_PATH` environment variable
In your `.bashrc`, `.zshrc`, or similar shell startup file (exact syntax may vary):
```
export LD_LIBRARY_PATH=$ORACLE_HOME/lib:$LD_LIBRARY_PATH
```
Make sure that source your `oracle_env.sh` file **before** your update your `$LD_LIBRARY_PATH`, otherwise `$ORACLE_HOME` won't yet exist.

------

## Usage: Go to server
```
$ npm run dev
```
