const validator = require('../lib/validator');

test('Empty data is invalid', () => {
  const res = validator.validate({});
  expect(res.valid === false);
});