const express = require('express');
const handle  = require('./handlers');

const service = (name, collection) => {
  const router = express.Router();

  const respond = handler => {
    return (req, res) => {
      const args = {params: req.params, data: Object.assign({}, req.query, req.body)};

      // console.log(`Handler called on ${name} with: ${args}`);

      return Promise.resolve(handler(args))
        .then(response => {
          var result = {};
          result[name] = response.body;
          res.status(response.status).json(result).end();
        });
    }
  }

  const handlers = handle(collection);

  // console.log(`Mounting REST endpoints for ${name}...`);

  router.get(`/${name}/:id`, respond(handlers.get));
  router.post(`/${name}`,    respond(handlers.create));
  router.put(`/${name}`,     respond(handlers.update));
  router.get(`/${name}`,      respond(handlers.find));

  const routes = router.stack ? router.stack.map(r => {
    if (r.route && r.route.path) return `${r.route.path}`;
  }) : [];

  // console.log(`Done setting up ${name} route with: ${routes.join('\n')}`);


  return router;
}

module.exports = service;
