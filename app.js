// My first-run solution for:
// https://www.codewars.com/kata/esolang-interpreters-number-4-boolfuck-interpreter/javascript

String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
};

var Processor = function() {
  this.memory = "0";
  this.input = "0";
  this.output = "";
  this.pointer = 0;

  this.commands = {
    ';': this.print,
    '+': this.flip,
    '<': this.shift,
    '>': this.shift,
    ',': this.read,
    '[': this.loop,
    ']': this.loop
  };
};

Processor.prototype.getCommand = function(c) {
  if (!this.commands.hasOwnProperty(c)) {
    // console.log('!!! now implemented yet', c);
    return (function() {});
  }

  return this.commands[c];
};

Processor.prototype.loop = function(c, rest_code) {
  if (c == ']') {
    return 0;
  }

  var from_pos = 0;
  var pos = 0;
  var codeblock = '';
  while (true) {
    pos = rest_code.indexOf(']', from_pos);
    codeblock = rest_code.substr(1, pos - 1);
    if (codeblock.replace(/[^\[]/g, '').length == codeblock.replace(/[^\]]/g, '').length) {
      break;
    }
    from_pos = pos + 1;
  }

  while (this.memory[this.pointer] == '1') {
    this.execute(codeblock);
  }

  return pos;
};

Processor.prototype.print = function() {
  this.output += this.memory[this.pointer];
  return 0;
};

Processor.prototype.flip = function() {
  var flipped = "" + (1 - parseInt(this.memory[this.pointer], 2));
  this.insertMemoryValue(flipped);
  return 0;
};

Processor.prototype.read = function() {
  this.insertMemoryValue(this.input[0]);
  this.input = this.input.substr(1);
  if (this.input.length < 1) {
    this.input = '0';
  }
  return 0;
};

Processor.prototype.shift = function(d) {
  if (d == '<') {
    this.pointer--;
  }

  if (d == '>') {
    this.pointer++;
  }

  if (this.pointer < 0) {
    this.memory = '0' + this.memory;
    this.pointer = 0;
  }

  if (this.pointer >= this.memory.length) {
    this.memory += '0';
  }

  return 0;
};

Processor.prototype.insertMemoryValue = function(value) {
  this.memory = this.memory.substr(0, this.pointer) + value + this.memory.substr(this.pointer + 1);
};

Processor.prototype.feedInput = function(input) {
  if (input.length < 1) {
    return;
  }
  this.input = input.split('').map(function(c) {
    var value = Number(c.charCodeAt(0)).toString(2);
    value = '00000000'.substr(value.length) + value;
    return value.split('').reverse().join('');
  }).join('');
};

Processor.prototype.execute = function(code) {
  code = code.replace(/[^\+,;<>\[\]]/g, '');
  for (var i = 0, l = code.length; i < l; i++) {
    i += this.getCommand(code[i]).apply(this, [code[i], code.substr(i)]);
  }
};

Processor.prototype.displayOutput = function() {
  var pad = this.output.length % 8;
  if (pad > 0) {
    pad = 8 - pad;
  }
  for (; pad > 0; pad--) {
    this.output += '0';
  }

  var fin = "";
  for (var i = 0, l = this.output.length; i < l; i+=8) {
    fin += String.fromCharCode(parseInt(this.output.slice(i, i+8).split('').reverse().join(''), 2));
  }

  return fin;
};

function boolfuck(code, input) {
  if (typeof input == 'undefined') {
    input = '';
  }
  var p = new Processor();
  p.feedInput(input);
  p.execute(code);
  return p.displayOutput();
}
