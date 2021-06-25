const port    = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 8765;
const express = require('express');
const Gun     = require('gun');
const fetch   = require('node-fetch');
require('axe');

const app = express();
app.use(Gun.serve);
app.use(express.static(`${__dirname}/public`));
app.use(express.json());

// Register new user. May contain duplicates
app.post('/signup', function(req, res) {
    const {uname, pass} = req.body;
    const user = gun.user(); 
    user.create(uname, pass, (ack) => res.send(ack));
});

// Login user.
app.post('/login', function(req, res) {
    const {uname, pass} = req.body;
    const user = gun.user(); 
    user.auth(uname, pass, (ack) => {
        if (ack.err) {
            res.send(ack);
        } else {
            res.send(ack.put);            
        }
    });
});


const server = app.listen(port);
const gun = Gun({	file: 'data', web: server });


console.log('Server started on port ' + port + ' with /gun');
console.log(`open link : http://localhost:${port}`);

// const keepAlive = async () => fetch('/');
// setTimeout(keepAlive, 1500, 'funky');