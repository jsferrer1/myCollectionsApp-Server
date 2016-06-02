# My Collections To Cash Web App

<img src="public/images/logo.png" alt="myCollections"><br>

My Collections to Cash would enable a user to have an overall view of their assets. Assets are also known as "collections" or "stuffs" or "items." This web app was implemented using MEAN stack in order to leverage on the power of the MVC framework.


## Features & Endpoints

a) Login or Register using Passport
   POST /users/login
   POST /users/register

b) Login using Facebook

   Use this feature to post collections to facebook.

   POST /users/facebook 

b) Collections on Sale

   GET /collections

c) Collections: create, read, update, delete

   POST /collections
   GET /collections/:id
   PUT /collections/:id
   DELETE /collections/:id

d) Add Collection Comments

   GET /collections/:id/comments
   PUT /collections/:id/comments/:commentId
   DELETE /collections/:id/comments/:commentId

e) Sell Collections

   This will add the collections to the lists of collections on sale.

   PUT /collections/:id

f) Post Collections to Facebook

   User must be logged into facebook to use this feature.

   PUT /collections/:id

g) Donate Collections

   PUT /collections/:id

h) Search



## App Preview


<!-- GIF of Android app -->
<img src="resources/gifs/myCollections-web.gif" alt="web"><br>


## Implementation

mycollectionsapp-server is the back-end REST api server of myCollections. For modularity purposes, the back-end REST server was implemented at http://mycollectionsapp-server.au-syd.mybluemix.net/.


## Directory Structure

```
mycollectionsapp-server
+---bin
+---models
+---public
|   +---images
|   +---javascripts
|   +---stylesheets
|   \---uploadedfiles
+---routes
\---views
```

## Run Locally

This assumes you already have the following tools installed: node, npm, and git.

    git clone https://github.com/jsferrer1/myCollectionsApp-Server.git mycollectionsapp-server

    cd mycollectionsapp-server

    npm install

    npm start

## LICENSE

npm is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository.
