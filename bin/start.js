module.exports = function() {
  const pkg = require('../package.json');
  const version = pkg.version;
  const name = pkg.name;
  process.env.VERSION = version;
  process.env.PACKAGE_NAME = name;

  const program = require('../lib/index').default;
  program.parse(process.argv);
};
