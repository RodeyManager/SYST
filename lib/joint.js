'use strict';

var Stream = require('stream');
var fs = require('fs');
var util = require('util');

function banner(str, position) {

  if(/^[\.]*[\/\\]+/.test(str)){
    str = fs.readFileSync(str, 'utf8');
  }

  var stream = new Stream.Transform({objectMode: true});

  stream._transform = function(file, unused, callback) {
    var content = file.contents.toString('utf-8');
    if(str){
      content = position == 'top' ? str + '\n\t' + content : content + '\n' + str;
    }
    file.contents = new Buffer(content);
    callback(null, file);
  };

  return stream;
}

module.exports = banner;