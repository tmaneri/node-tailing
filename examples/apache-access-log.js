var Tailing = require('tailing');

var pattern = /^(\S+) (\S+) (\S+) \[([^:]+):(\d+:\d+:\d+) ([^\]]+)\] \"(\S+) (.*?) (\S+)\" (\S+) (\S+) "([^"]*)" "([^"]*)"/i;
var tail = new Tailing('/var/log/apache2/access.log');

tail.on('line', function(line) {
  var matches = line.match(pattern);
  if (matches) {
    console.log(line);
  }
});
