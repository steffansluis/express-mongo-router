const express = require('express');
const handle  = require('./handlers');
const Errors  = require('./errors');

const respond = (resultName, handler) => {
  return (req, res, next) => {
    const args = {params: req.params, data: Object.assign({}, req.query, req.body)};

    // console.log(`Handler called on ${name} with: ${args}`);

    return Promise.resolve(handler(args))
      .then(response => {
        if (response.body == null) throw new Errors.NotFound(`${resultName} not found`);

        var result = {};
        result[resultName] = response.body;
        res.status(response.status).json(result).end();
      }).catch(next);
  }
}

const reject = (error, req, res, next) => {
  if (!error) return next();
  
  const { message, code } = error;
  res.status(code).json({error}).end()
}

const service = (names, collection) => {
  const { modelName, collectionName } = names;
  const router = express.Router();

  const handlers = handle(collection);

  // console.log(`Mounting REST endpoints for ${modelName}...`);

  router.get(`/${collectionName}/:id`, respond(modelName, handlers.get));
  router.post(`/${collectionName}`,    respond(modelName, handlers.create));
  router.put(`/${collectionName}`,     respond(modelName, handlers.update));
  router.get(`/${collectionName}`,     respond(collectionName, handlers.find));

  // Handle errors
  router.use(reject);

  // const routes = router.stack ? router.stack.map(r => {
  //   if (r.route && r.route.path) return `${r.route.path}`;
  // }) : [];

  // console.log(`Done setting up ${name} route with: ${routes.join('\n')}`);


  return router;
}

module.exports = service;
