"use strict";

var inherits = require('util').inherits
  , spawn = require('child_process').spawn
  , Emitter = require('events').EventEmitter
  , path = require('path')
;

var defaults = {
    bin  : path.join(__dirname, '..', 'bin', 'Adafruit_DHT')
  , args : [ '2302' ]
  , pin  : 17
  , temp : /Temp\s*=\s*([-+]?[0-9]*\.?[0-9]+)/
  , hum  : /Hum\s*=\s*([-+]?[0-9]*\.?[0-9]+)/
  , sudo : true
};

var Sensor = function(conf) {
    var self = this;

    self.constructor.super_.call(self);

    conf = (typeof conf === 'object') ? conf : {};
    self.conf = {};
    Object.keys(defaults).forEach(function(key){
	self.conf[key] =
	    conf.hasOwnProperty(key) ? conf[key] : defaults[key]
	;
    });
}
inherits(Sensor, Emitter);

Sensor.prototype.read = function(cb) {
    var err = ''
      , out = ''
      , self = this
      , spawn_args
      , spawn_cmd
    ;

    spawn_cmd = self.conf.bin;
    spawn_args = self.conf.args.concat( [self.conf.pin] );

    if (self.conf.sudo == true) {
	spawn_args.unshift(spawn_cmd);
	spawn_cmd = 'sudo';
    }

    var child = spawn( spawn_cmd, spawn_args );

    child.stdout.on('data', function(data) {
	out += data;
	return self.emit('stdout', data);
    });
    child.stderr.on('data', function(data) {
	err += data;
	return self.emit('stderr', data);
    });

    child.on('exit', function(code) {
	process.nextTick(function() {
	    var temp = null
	      , hum = null
	      , ret_data = {}
              , ret_err = null
	    ;
	    
	    if (temp = self.conf.temp.exec(out)) {
		ret_data.temp = parseFloat(temp[1]);
		self.emit('temp', ret_data.temp);
	    };
	    
	    if (hum = self.conf.hum.exec(out)) {
		ret_data.hum = parseFloat(hum[1]);
		self.emit('hum', ret_data.hum);
	    }
	    
	    if (code != 0 || ret_data == {} || ret_data.temp == null || ret_data.hum == null) {
		ret_err = {
		    'code'   : code
		  , 'stdout' : out
		  , 'stderr' : err 
		};
		self.emit('error', ret_err);
	    } else {
		self.emit('data', ret_data);
	    }

	    if (typeof cb === 'function')
		cb(ret_err, ret_data);

	    return self.emit('done');
	});
    });
};

module.exports = Sensor;
