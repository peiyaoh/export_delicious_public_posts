# Export Delicious Public Posts

This node.js script is created to export public posts of a user on [Delicious](https://del.icio.us/) into a bookmarks.html file that could be imported to other browsers (e.g., Chrome and Firefox) or services.

Note: This script is basically a crawler, and it does not interact with Delicious's API. I created it because Delicious disables the export feature due to server loading, see [export](https://del.icio.us/export).

version 0.0.1.

## Acquire Dependency
```
npm install
```
## Before Running

Before running the script, you need to set the following parameters

**user_name**: the username of the user. For instance, if the URL for a given user is https://del.icio.us/public, then you should set it to 'public'.

**max_entry_count**: the total number of posts for a given user. If the user has 135 posts, you should set it to 135. The script will not stop until it gets this number of posts.

**max_page**: the maximum number of batches (each with ten posts). You should set it to max_entry_count/10 + 1. For instance, if the user has 135 posts, you should set it 14 (13 + 1).

**waitMSeconds**: number of milliseconds to wait between the requests to get each batch of posts. The default value is 1000 (1 second). Please don't reduce the value to be less than 1000 so that the script will not create too much loading to the server of Delicious.

## Running
```
node export_delicious_public.js
```