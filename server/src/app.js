const path = require('path');
const cors = require('cors')
const morgan = require('morgan');
const express = require('express');

const planetsRouter = require('./routes/planets/planets.router')
const launchesRouter = require('./routes/launches/launches.router')

const app = express();

app.use(cors( {
    origin: 'http://localhost:3000',
}));
//inside the use we're going to call the function that we get back from the 
//morgan module,which takes in a string that tells Morgan 
//which of the predefined formats we should use for our logs.
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..','public')));

app.use('/planets',planetsRouter);
app.use('/launches',launchesRouter);
app.get('/*', (req,res) =>{
    res.sendFile(path.join(__dirname,'..','public/','index.html'))
})
module.exports =app;