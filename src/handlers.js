const Mongo   = require('./mongo');

const service = collection => {
  const db = Mongo(collection);

  // console.log(`Handlers called with ${collection.s.name}`);

  // Endpoint handlers
  const get = args => {
    const id = args.params.id;
    return db.get({id})
      .then(res => ({
        status: 200,
        body: res
      }));
  }

  const create = args => {
    const data = args.data;
    return db.create(data)
      .then(res => ({
        status: 201,
        body: res
      }));
  }

  const update = args => {
    const query = args.params;
    const data  = args.data;

    return db.update(query, data)
      .then(res => ({
        status: 200,
        body: res
      }));
  }

  const find = args => {
    // console.log(`Find called with ${JSON.stringify(args)}.`);
    const query = args.data;

    return db.find(query)
      .then(res => ({
        status: 200,
        body: res
      }));
  }

  return {
    create,
    get,
    find,
    update,
    // put,
    // delete: del,
    // clear
  }
}

module.exports = service;
