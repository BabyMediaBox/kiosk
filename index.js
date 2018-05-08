const express = require('express');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const app = express();
const server = require('http').Server(app);

var port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
});
  
function setColor( r, g, b, callback)
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
function rgbSequence(list, callback )
{
    if( list.length > 0 )
    {
        setColor( list[0][0], list[0][1], list[0][2], function(){
            console.log('set color from sequence');
            list.shift();
            setTimeout( function(){
                rgbSequence( list, callback );
            }, 2000);
            
        });
    }
    else
    {
        callback();
    }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

server.listen(3030);

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
    console.log(req.body);
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

app.post('/rgb/sequence', (req, res) => {

    var list = req.body;
    rgbSequence(list, function(){
        console.log("complete");
    } );
    console.log("rgb sequence", req.body );
    res.send('ok');
});