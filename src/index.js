const fs = require('fs');
const events = require('events');

class Tailing extends events {

  getLinesFromBuffer()
  {
    if (!this.buffer.length) {
      return [];
    }

    const lines = this.buffer.split('\n');
    this.buffer = lines.pop();
    return lines;
  }

  read() {
    //we're already reading, don't start again
    if (this.stream && this.stream.readable) {
      return;
    }

    this.stream = fs.createReadStream(this.path, { start: this.position, encoding: 'utf8' });
    this.stream.on('data', (data) => {
      this.emit('data', data);
      this.buffer += data;
      this.position += data.length;
      this.bytesRead += data.length;
      this.getLinesFromBuffer().forEach((line) => {
        this.emit('line', line);
      });
    });
  }

  constructor(path, settings = {}) {
    super();

    this.settings = Object.assign({}, {
      start: 'tail'
    }, settings);

    this.path = path;
    this.stream = null;
    this.position = 0;
    this.bytesRead = 0;
    this.buffer = '';

    fs.stat(path, (err, stats) => {
      if (this.settings.start == 'head') {
        this.position = 0;
      } else {
        this.position = stats.size;
      }

      fs.watch(path, {}, (eventType, name) => {
        if (eventType == 'change') {
          this.read();
        }
      });

      this.read();
    });
  }
}

module.exports = Tailing;
