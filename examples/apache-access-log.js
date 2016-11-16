var trailing = require('trailing');

var pattern = /^(\S+) (\S+) (\S+) \[([^:]+):(\d+:\d+:\d+) ([^\]]+)\] \"(\S+) (.*?) (\S+)\" (\S+) (\S+) "([^"]*)" "([^"]*)"/i;
var trail = trailing('/var/log/apache2/access.log');

trail.on('line', function(line) {
  var matches = line.match(pattern);
  if (matches) {
    console.log(line);
  }
});
