const express = require('express');
const handle  = require('./handlers');
const Errors  = require('./errors');

const respond = Config => {
  const { resultName, handler } = Config;
  const mapper = Config.mapper || JSON.stringify;

  return (req, res, next) => {
    const args = {params: req.params, data: Object.assign({}, req.query, req.body)};

    // console.log(`Handler called on ${name} with: ${args}`);

    return Promise.resolve(handler(args))
      .then(response => {
        if (response.body == null) throw new Errors.NotFound(`${resultName} not found`);

        var result = {};
        result[resultName] = response.body;
        res.status(response.status).json(mapper(result)).end();
      }).catch(next);
  }
}

const reject = (error, req, res, next) => {
  if (!error) return next();

  const { message, code } = error;
  res.status(code || 500).json({error}).end()
}

const handles = Config => {
  const { collectionName, modelName, collection, mapper } = Config;
  const handlers = handle(collection);

  return {
    get: {
      method: 'get',
      route: `/${collectionName}/:id`,
      handler: respond({ resultName: modelName, handler: handlers.get, mapper})
    },
    create: {
      method: 'post',
      route: `/${collectionName}`,
      handler: respond({ resultName: modelName, handler: handlers.create, mapper})
    },
    put: {
      method: 'put',
      route: `/${collectionName}`,
      handler: respond({ resultName: modelName, handler: handlers.update, mapper})
    },
    find: {
      method: 'get',
      route: `/${collectionName}`,
      handler: respond({ resultName: collectionName, handler: handlers.find, mapper})
    }
  }
}

const service = Config => {
  var { names, collection, only, mapper } = Config;
  const { modelName, collectionName } = names;
  const handlers = handles({collectionName, modelName, collection, mapper});

  // If no filter is specified, mount all the handles
  if (!only) only = Object.keys(handlers);

  const router = express.Router();
  only.forEach(handle => {
    const config = handlers[handle];
    const { method, route, handler } = config;
    router[method](route, handler);
  });

  // Handle errors
  // router.use(reject);

  return router;
}

module.exports = service;
