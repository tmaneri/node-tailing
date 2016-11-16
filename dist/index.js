'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fs = require('fs');
var EventEmitter = require('events');

var Tailing = function (_EventEmitter) {
  _inherits(Tailing, _EventEmitter);

  _createClass(Tailing, [{
    key: 'getLinesFromBuffer',
    value: function getLinesFromBuffer() {
      if (!this.buffer.length) {
        return [];
      }

      var lines = this.buffer.split('\n');
      this.buffer = lines.pop();
      return lines;
    }
  }, {
    key: 'read',
    value: function read() {
      var _this2 = this;

      //we're already reading, don't start again
      if (this.stream && this.stream.readable) {
        return;
      }

      this.stream = fs.createReadStream(this.path, { start: this.position, encoding: 'utf8' });
      this.stream.on('data', function (data) {
        _this2.emit('data', data);
        _this2.buffer += data;
        _this2.position += data.length;
        _this2.bytesRead += data.length;
        _this2.getLinesFromBuffer().forEach(function (line) {
          _this2.emit('line', line);
        });
      });
    }
  }]);

  function Tailing(path) {
    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Tailing);

    var _this = _possibleConstructorReturn(this, (Tailing.__proto__ || Object.getPrototypeOf(Tailing)).call(this));

    _this.settings = Object.assign({}, {
      start: 'tail'
    }, settings);

    _this.path = path;
    _this.stream = null;
    _this.position = 0;
    _this.bytesRead = 0;
    _this.buffer = '';

    fs.stat(path, function (err, stats) {
      if (_this.settings.start == 'head') {
        _this.position = 0;
      } else {
        _this.position = stats.size;
      }

      fs.watch(path, {}, function (eventType, name) {
        if (eventType == 'change') {
          _this.read();
        }
      });

      _this.read();
    });
    return _this;
  }

  return Tailing;
}(EventEmitter);

module.exports = Tailing;
