const fs =require('fs'); 
const path = require('path');
const {parse} = require('csv-parse');
const { hasSubscribers } = require('diagnostics_channel');
const planets = require('./planets.mongo')
//with each chunk of data that comes in let create an array 
//const isHabitablePlanets = []


function isHabitablePlanet(planet) {
    return planet['koi_disposition'] ==='CONFIRMED'
    && planet['koi_insol'] >0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

 function loadPlanetsData(){
    //this will give us an event emitter which we can react to
//events from using the on function and the most important function for us
//is going to be data, comingin to our stream, which will recieve
//in this data callback as a parameter to that call back function
return new Promise((resolve,reject) =>{

 fs.createReadStream(path.join(__dirname, '..', '..','data', 'kepler_data.csv'))
.pipe(parse({
    comment:'#',
    columns: true,
}))
.on('data', async(data) =>{
    if(isHabitablePlanet(data)){
         savePlanet(data)
    }
})
.on('err', (err)=>{
    console.log(err)
    reject(err);
})
.on('end', async()=>{
    const countPlanetsFound = (await getAllPlanets()).length;
    console.log(`${countPlanetsFound} habitable planets found!`);
    resolve();
})

})
}

async function getAllPlanets(){
    return await planets.find({});
}

async function savePlanet(planet){
    try {
    await planets.updateOne({
            
                keplerName: planet.kepler_name,
               }, {
                keplerName: planet.kepler_name,
               }, {
                upsert: true,
                });
            }catch(err){
                console.error(`could not save the planet ${err}`)
            }
        }
    

module.exports = {
    loadPlanetsData,
    getAllPlanets,
    
}