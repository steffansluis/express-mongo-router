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

const modelName      = 'fruit';
const collectionName = 'fruits';

Collection(collectionName).then(collection => {
  console.log('Starting server...');

  const router = Router({names: {modelName, collectionName}, collection});
  server.use(router);

  console.log(`Express server listening on port ${port}`);
  server.listen(port);
});
