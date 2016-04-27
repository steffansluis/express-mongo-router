const create = collection => params => {
  return Promise.resolve(collection.save(params))
    .then(result => result.ops[0]);
}

const get = collection => query => {
  return Promise.resolve(collection.findOne(query))
}

const find = collection => query => {
  return Promise.resolve(collection.find(query))
    .then(res => res.toArray());
}

const put = collection => query => params => {
  return Promise.resolve(collection.updateOne(query, {$set: params}))
}

const del = collection => query => {
  return Promise.resolve(collection.findAndModify(query, [], {}, {remove: true}))
    .then(result => result.value);
}

const clear = collection => () => {
  return Promise.resolve(collection.remove());
}

const Model = {
  create,
  get,
  find,
  put,
  delete: del,
  clear
}

const removeMongoId = (obj) => {
  if (obj instanceof Array) return obj.map(removeMongoId);
  if (!obj) return;
  if (!obj._id) return obj;

  delete obj._id;
  return obj;
}

module.exports = collection => {
  // console.log(`Setting up MongoDB with`, collection.s.name);

  return Object.keys(Model).reduce((memo, key) => {
    const fn = Model[key](collection);

    const proxy = (...args) => {
      // console.log(`Proxy for ${key} was called with ${args}`);

      if (!args.length) return fn();
      return args.reduce((memo, arg) => memo(arg), fn)
        .then(removeMongoId);
    }

    memo[key] = proxy;
    return memo;
  }, {
    removeMongoId
  });
}
