const axios = require('axios');
const planets = require('./planets.mongo')
const launchesDatabase = require('./launches.mongo');
const { response } = require('../app');
console.log(planets)

const DEFAULT_FLIGHT_NUMBER =100;
const SPACEX_API_URL ='https://api.spacexdata.com/v4/launches/query'


async function populateLaunches(){
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, {
       query: {},
       options: {
           pagination: false,
           populate: [
               {
                   path: 'rocket',
                   select: {
                       name: 1
                   }
               }, {
                 path: 'payloads',
                 select: {
                   'customers':1
                 }
               }
           ]
       } 
   });
   if(response.status !== 200){
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed.')
   }
   const launchDocs =response.data.docs;
  for(const launchDoc of launchDocs){
   const payloads = launchDoc['payloads'];
   const customers = payloads.flatMap((payload)=>{
     return payload['customers'];
   });
 
   const launch = {
     flightNumber: launchDoc['flight_number'],
     mission: launchDoc['name'],
     rocket: launchDoc['rocket']['name'],
     launchDate: launchDoc['date_local'],
     upcoming: launchDoc['upcoming'],
     success: launchDoc['success'],
     customers,
   };
 
   console.log(`${launch.flightNumber} ${launch.mission}`)
 
   await saveLaunch(launch);
   //TODO: populate launches collection..
  }
}

async function loadLaunchData(){
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  })
  if(firstLaunch) {
    console.log('Launch data was already loaded')
  }else{
      await populateLaunches();

  }
};


async function findLaunch(filter){
  return await launchesDatabase.findOne(filter)
}

async function existLaunchWithId(launchId){
  return await findLaunch({
    flightNumber: launchId,
  })
  }


async function getLatestFlightNumber(){
  const latestLaunch =await launchesDatabase
  .findOne()
  .sort('-flightNumber');

  if(!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip,limit){
    return await launchesDatabase
    .find({}, {'_id': 0, '__v': 0})
    .sort({flightNumber: 1 })
    .skip(skip) //skips over the number of documents you're passing
    .limit(limit);
}

async function saveLaunch(launch){
   try {
//   let planet = await planets.findOne({
//     keplerName: launch.target,
//   });

// if(!planet){
//   throw new Error('No matching planet found');
// }
await launchesDatabase.findOneAndUpdate({
  flightNumber: launch.flightNumber,
}, launch, {
  upsert: true,
})
 }catch(err){
  console.error(`could not save the planet ${err}`)
 }
};

async function scheduleNewLaunch(launch){
  const newFlightNumber = await getLatestFlightNumber() +1;
  console.log(newFlightNumber);
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById (launchId){
    return await launchesDatabase.updateOne({
       flightNumber: launchId,
    }, {
      upcoming: false,
      success: false,
    });

  //return aborted.ok === 1 && aborted.nModified === 1;
}

//we're going to export our launches map from our model so that we can
//use it in the rest of our code.
module.exports = {
    loadLaunchData,
    getAllLaunches,
    existLaunchWithId,
    abortLaunchById,
    scheduleNewLaunch,
}
