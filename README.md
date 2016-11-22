# Export Delicious Public Posts

This node.js script is created to export public posts of a user on [Delicious](https://del.icio.us/) into a bookmarks.html file that could be imported to other browsers (e.g., Chrome and Firefox) or services.

version 0.0.1.

## Acquire Dependency

npm install

## Before Running

Before running the script, you need to set the following parameters

**user_name**: the username of the user. For instance, if the URL for a given user is https://del.icio.us/public, then you should set it to 'public'.

**max_entry_count**: the total number of posts for a given user. If the user has 135 posts, you shoudl set it to 135. The script won't stop untill it gets this number of posts.

**max_page**: the maximum number of batch (each with 10). You should set it to max_entry_count/10 + 1. For instnace, if the user has 135 posts, you should set it 14 (10 + 1).

**waitMSeconds**: number of milliseconds to wait before getting each batch of posts. The default value is 1000 (1 second).

## Running

node export_delicious_public.js