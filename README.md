# Export Delicious Public Posts

This node.js script is created to export public posts of a user on [Delicious](https://del.icio.us/) into a bookmarks.html file that could be imported to other browsers (e.g., Chrome and Firefox) or services.

Note: This script is basically a crawler, and it does not interact with Delicious's API. I created it because Delicious disables the export feature due to server loading, see [export](https://del.icio.us/export).

version 0.0.1.

## Acquire Dependency
Note: The script will be executed on top of the [Node.js](https://nodejs.org/) environment. If you have not installed Node.js and npm, please install Node.js first. NPM is a package manager that comes with Node.js installation.

After the installation, you can execute the following command in the project folder.
```
npm install
```

## Before Running

Before running the script, you need to set the following parameters

**user_name**: the username of the user. For instance, if the URL for a given user is https://del.icio.us/public, then you should set it to 'public'.

**max_entry_count**: the maximum number of public posts to retrieve for a given user. Set it to the total number of public posts of that user to retrieve all the public posts.

**waitMSeconds**: number of milliseconds to wait between the requests to get each batch of posts. The default value is 1000 (1 second). Please don't reduce the value to be less than 1000 so that the script will not create too much burden for the server at Delicious.

## Running
```
node export_delicious_public.js
```