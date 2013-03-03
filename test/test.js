
var Sensor = require('..')
  , Test = module.exports
;

Test['callback'] = function(T) {
    var s = new Sensor({
	sudo : false
      , bin  : 'bash'
      , args : [ '-c', 'echo "Temp =  666.22  Hum = 667.33"; exit 0;' ]
    });

    s.read(function(err, data) {
	T.strictEqual(err, null);
	T.strictEqual(data.temp, 666.2200);
	T.strictEqual(data.hum, 667.3300);
	T.done()
    });
};

Test['events'] = function(T) {
    var s = new Sensor({
	sudo : false
      , bin  : 'bash'
      , args : [ '-c', 'echo "stderr" >&2; echo "Temp =  666.22  Hum = 667.33"; exit 3;' ]
    });
    var stderr = '' , stdout = '';

    s.on('error', function(err){
	T.equal(err.code, 3);
    });
    s.on('stderr', function(err){
	stderr += err.toString();
    });
    s.on('stdout', function(out){
	stdout += out.toString();
    });
    s.on('hum',  T.strictEqual.bind(T, 667.33));
    s.on('temp', T.strictEqual.bind(T, 666.22));

    s.on('done', function(){
	T.strictEqual(stderr, 'stderr\n');
	T.strictEqual(stdout, 'Temp =  666.22  Hum = 667.33\n');
	T.done();
    });

    s.read();
};

Test['sudo'] = function(T) {
    var s = new Sensor({
	temp : /EUID:(\d+)/
      , hum : /^/
      , bin : 'bash'
      , args : [ '-c', 'echo "EUID:$EUID"; exit 0;' ]
    });

    s.read(function(err,data) {
	T.strictEqual(data.temp, 0);
	T.done();
    });
};