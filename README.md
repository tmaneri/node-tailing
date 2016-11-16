#node-tailing

## Description
This package allows you to tail a file and execute a callback when new lines are written to it.

## Installation
```bash
npm install tailing
```

## Use
```javascript
var Tailing = require('tailing');
var tail = new Tailing('/path/to/file');

tail.on('line', function(line) {
  console.log(line);
});
```
