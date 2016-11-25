/**
 * Created by test on 11/24/16.
 */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../');
module.exports={
  dev: {
    cookieSecret: 'myblog',
    connectionstring: 'mongodb://test:test@ds163397.mlab.com:63397/brightedge',
    rootpath:rootPath,
    port: process.env.Port || 3000
  },
  prod:{
    cookieSecret: 'myblog',
    connectionstring:'mongodb://localhost/blog',
    rootpath:rootPath,
    port: process.env.Port || 3000
  }
};