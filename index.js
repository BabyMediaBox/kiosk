const express = require('express');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const exec = require('child_process').exec;
const app = express();
const request = require('request');
const server = require('http').Server(app);
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();
const Config = require('./config.json');
let port;

function sendButtonPress( buttonNumber ){
    let requestData = {
        url : Config.server  + "/button/" + buttonNumber
    };

    console.log("Button pressed", buttonNumber);

    request.post( requestData, function(err, httpResponse, body) {
        if( err )
        {
            console.log('error on button press request', err);
        }
    });
}

function setVolume( volume )
{
    console.log("send volume", volume);
    let requestData = {
        url : Config.server  + "/kiosk-volume",
        form: {
            volume: volume
        }
    };

    request.post( requestData, function(err, httpResponse, body) {
        if( err )
        {
            console.log('error on button press request', err);
        }
    });
}

function setColor( r, g, b, callback)
{
    if(port)
    {
        port.write(`${r},${g},${b}`, function(err){
            if(err)
            {
                console.log(err);
            }
            console.log('set color');
            callback();
        });
    }
    else{
        console.log(`serial missing: set color(${r},${g},${b})`);
    }
}

try {
    port = new SerialPort('/dev/ttyACM0', {
        baudRate: Config.serialPort
    });
    port.on('error', function(){
        console.log("serial not found");
    });
    port.pipe(parser);
    port.on('open', function() {
        console.log("serial open with config", Config);

        var requestData = {
            url : Config.server  + "/kiosk-serial-online",
            form: {}
        };
        request
            .post( requestData, function(err, httpResponse, body) {
                if( err )
                {
                    console.log('error on serial-online request', err);
                }
            });
	    setColor( 50, 50, 50 );
    });


    // Switches the port into "flowing mode"
    port.on('data', function (data)
    {
        let stringData = data.toString('utf8');
        if( /\n/.exec(stringData) && parseInt(stringData) > 0 )
        {
            let btn = parseInt(stringData);
            sendButtonPress( btn );
        }
    });

    // Read data that is available but keep the stream from entering "flowing mode"
    port.on('readable', function () {
        console.log('readable event:', port.read());
    });

} catch (error) {
    console.log("serialport", error);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

server.listen(Config.port, function(){
    console.log("kiosk server running");

    exec("./getVolume.sh",
        (error, stdout, stderr) => {
            if (error !== null || stderr !== "" ) {
                console.log(`exec error: ${error}, ${stderr}`);
            }
            else
            {
                let volume = stdout.replace("%", "");
                setVolume( volume );
            }
        });
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', (req, res) => {
    res.send("ok");
});

app.post('/rgb', (req, res) => {
    console.log("/rgb request ", req.body);
    var r = req.body.r;
    var g = req.body.g;
    var b = req.body.b;

    if( r && g && b )
    {
        setColor( r, g, b );
        res.send('ok');
    }
    else
    {
        res.send('fail');
    }
});


app.post('/volume', (req, res) => {
    var body = req.body;
    console.log("volume", body.volume);
    exec('amixer set Master '+body.volume+'%',
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    res.send('ok');
});

app.post('/shutdown', (req, res) => {
    exec('sudo shutdown -h now',
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    res.send('ok');
});
