const path = require('path');
const { fileLoader, mergeResolvers } = require('merge-graphql-schemas');

const resolversArray = fileLoader(path.join(__dirname, './**/resolver.*'));
// console.log('\nresolvers', resolversArray, '\n');

module.exports = mergeResolvers(resolversArray);
