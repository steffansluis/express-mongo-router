# express-mongo-router

This is a small library that offers easy access to MongoDB collection via REST endpoint by offering an Express router.

# Example

This example starts an express server on port 3000 with a fruits resource.

```javascript
const express = require('express');
const MongoClient = require('mongodb');
const Router = require('.').Router;

const MongoURI = 'mongodb://localhost:27017/example';
const server = express();
const port = 3000;

const Collection = name => {
  return MongoClient.connect(MongoURI)
    .then(database => {
      return database.collection(name);
    });
}

const name = 'fruits';
Collection(name).then(collection => {

  const router = Router(name, collection);
  server.use(router);

  console.log(`Express server listening on port ${port}`);
  server.listen(port);
});

```
