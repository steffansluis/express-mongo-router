const test        = require('blue-tape'),
      proxyquire      = require('proxyquire'),
      sinon           = require('sinon'),

      CollectionStub = {
        s: { name: 'CollectionStub' },
        save: sinon.stub().returns(Promise.resolve({ops: [{_id: "someMongoId"}]})),
        findOne: sinon.stub().returns(Promise.resolve({_id: "someMongoId"})),
        find: sinon.stub().returns(Promise.resolve({
          toArray: () => [{_id: "someMongoId"}]
        })),
        updateOne: sinon.stub().returns(Promise.resolve({_id: "someMongoId"})),
        findAndModify: sinon.stub().returns(Promise.resolve({value: {_id: "someMongoId"}})),
        remove: sinon.stub(),
      },

      Mongo = require('../src/mongo');

const Helper = Mongo(CollectionStub);

// const testConnect = t => res => {
//   t.test('connect', t => {
//     const arg = MongoStub.firstCall.args[0];
//
//     return Promise.resolve()
//
//     return res;
//   });
// }

test('create', t => {
  const prop = "prop";
  const params = { prop };

  return Helper.create(params)
    .then( (res) => {
      const arg = CollectionStub.save.firstCall.args[0];
      return arg.prop === prop;
    })
    .then(t.ok, t.error)
});

test('get', t => {
  const prop = "prop";
  const query = { prop };

  return Helper.get(query)
    .then( (res) => {
      const arg = CollectionStub.findOne.firstCall.args[0];
      return arg.prop === prop;
    })
    .then(t.ok, t.error)
});

test('find', t => {
  const prop = "prop";
  const query = { prop };

  return Helper.find(query)
    .then( (res) => {
      const arg = CollectionStub.find.firstCall.args[0];
      return arg.prop === prop;
    })
    .then(t.ok, t.error)
});

test('put', t => {
  const prop = "prop";
  const otherProp = "otherProp";
  const query = { prop };
  const params = { otherProp }

  return Helper.put(query, params)
    .then( (res) => {
      const [arg, otherArg] = CollectionStub.updateOne.firstCall.args;

      return arg.prop === prop &&
        otherArg.$set.otherProp === otherProp;
    })
    .then(t.ok, t.error)
});

test('delete', t => {
  const prop = "prop";
  const query = { prop };

  return Helper.delete(query)
    .then( (res) => {
      const args = CollectionStub.findAndModify.firstCall.args;
      return args[0].prop === prop &&
        args[1] instanceof Array &&
        args[1].length === 0 &&
        args[2] instanceof Object &&
        args[3].remove === true;
    })
    .then(t.ok, t.error)
});

test('clear', t => {
  const prop = "prop";
  const query = { prop };

  return Helper.clear()
    .then( () => {
      return CollectionStub.remove.calledOnce;
    })
    .then(t.ok, t.error)
});
