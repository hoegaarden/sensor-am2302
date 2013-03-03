var TempHum = require('..')
  , sensor = new TempHum()
;

sensor.on('error', function(err){
    console.error('Error on reading sensor data:', err);
    process.exit(err.code);
});

sensor.read(function(err, data) {
    console.log('Temp:', data.temp);
    console.log('Hum: ' , data.hum);
    process.exit();
});

