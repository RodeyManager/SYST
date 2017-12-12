
'use strict';

var Stream = require('stream');
var util = require('util');

function banner(obj) {

  if(util.isObject(obj)){
    var s = '';
    for(var key in obj) s += '* ' + key + ' ' + obj[key] + '\n';
    obj = s;
  }

  var stream = new Stream.Transform({objectMode: true});

  stream._transform = function(file, unused, callback) {
    var content = file.contents.toString('utf-8');
    if(obj){
      content = '/*\n' + obj.toString() + '*/\n' + content;
    }
    file.contents = new Buffer(content);
    callback(null, file);
  };

  return stream;
}

module.exports = banner;

