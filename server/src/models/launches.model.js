
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo.js')

const launches = new Map();

let latestFlightNumber = 100;

const launch = {
flightNumber: 100,    
mission: 'Kepler Exploration X',
rocket: 'Explore IS1',
launchDate: new Date('December 27, 2030'),
target: 'Adams planet',
customers: ['ZTM', 'NASA'],
upcoming: true,
success: true,
};

saveLaunch(launch)

function existLaunchWithId(launchId){
  return launches.has(launchId)
}

async function getAllLaunches(){
    return await launchesDatabase
    .find({}, {'_id': 0, '__v': 0})
}

async function saveLaunch(launch){
   try {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

if(!planet){
  throw new Error('No matching planet found');
}
await launchesDatabase.updateOne({
  flightNumber: launch.flightNumber,
}, launch, {
  upsert: true,
})
 }catch(err){
  console.error(`could not save the planet ${err}`)
 }
};

function addNewLaunch(launch){
    latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: latestFlightNumber,
    })
  );
}
function abortLaunchById (launchId){
  const aborted =launches.get(launchId)
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

//we're going to export our launches map from our model so that we can
//use it in the rest of our code.
module.exports = {
    getAllLaunches,
    addNewLaunch,
    existLaunchWithId,
    abortLaunchById,
}
