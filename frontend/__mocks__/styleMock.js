// __mocks__/styleMock.js
module.exports = new Proxy({}, {
  get: function (_, key) {
    return key;
  },
});
