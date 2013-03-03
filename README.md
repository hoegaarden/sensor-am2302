# sensor-am2302

## About

This is a small module to read data from a AM2302 (and others) Temp/Hum-Sensor.
For reading data, it spawns a binary (stolen from [Adafruit]) and parsing its output.

This module comes with a precompiled binary for RaspberryPi.

## Usage

    var Sensor = require("sensor-am2303")
      , temp_hum = new Sensor({pin:17})
    ;
    temp_hum.read(function(err, data) {
        if (err) {
            console.error(err);
        } else {
            console.log("Temp: ", data.temp);
            console.log("Hum:  ", data.hum);
        }
    });

## Functions / Methods

### Constructor

The constructor can take an object with configuration data. The defaults are:

    var defaults = {
        bin  : path.join(__dirname, '..', 'bin', 'Adafruit_DHT')
      , args : [ '2302' ]
      , pin  : 17
      , temp : /Temp\s*=\s*([-+]?[0-9]*\.?[0-9]+)/
      , hum  : /Hum\s*=\s*([-+]?[0-9]*\.?[0-9]+)/
      , sudo : true
    };
    
 - `bin` is the path to the binary which gets called to read the sensor data
 - `args` holds additional arguments with which the `bin` gets called.
 - `pin` is the GPIO pin to which the sensor is connected - actually this gets passed to `bin` as the last argument
 - `temp` & `hum` are regular expressions with parse the STDOUT of `bin` to extract the meassured values
 - `sudo` should `bin` get executed via sudo?

### read(cb)

This method spanws teh binary, reads its output and extracts the meassured data. You can pass a callback function which takes two arguments `error` and `data`.

#### <a id="error-object"></a>`error`
    null
or

    { code: 1, stdout: 'some string', stderr: 'some other string' }

`code` is the return code of the binary and `stdout`/`stderr` is the data the binary wrote to SDTOUT/STDERR.
    

#### <a id="data-object"></a>`data`
    { temp: 23.1, hum: 50 }

`temp` is the current tempeature in degrees celsius and `hum` is the humidity in percent.

## Events 

This module is derived from `EventEmitter` and therefore exposes followig events:

### Event `stdout`

The binary wrote something to STDOUT. The data it wrote gets passed as an argument.

### Event `stderr`

Same as `stdout`, but for STDERR.

### Event `temp`

The module could parse the temprature. The temperature gets passed as argument.

### Event `hum`

Same as `temp`

### Event `data`

Bot the temperature and humidity were read. Both get passed in an object like [the data object](#data-object) for the callback for the `read()`-method.

### Event `error`

Some error occured. An object like [the error object](#error-object) gets passed.

### Event `done`

Everything is done, the reading of the sensor is finished. This Event gets emitted even when there were errors. It doesn't pass any arguments.


  [adafruit]: https://github.com/adafruit/Adafruit-Raspberry-Pi-Python-Code/tree/master/Adafruit_DHT_Driver


