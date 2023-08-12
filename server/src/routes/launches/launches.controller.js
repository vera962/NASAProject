const {
    getAllLaunches, 
    addNewLaunch,
    existLaunchWithId,
    abortLaunchById,
} = require('../../models/launches.model')

//now we know every function that starts woth http returns
//a response.
async function httpGetAllLaunches(req, res)
{
return res.status(200).json(await getAllLaunches())
}


function httpAddNewLaunch(req, res){
    const launch =req.body;

    if(!launch.mission || !launch.rocket || !launch.launchDate
        || !launch.target)
          return res.status(400).json({
            error: 'Missing required launch property!',
          })

    launch.launchDate = new Date(launch.launchDate)
    if(launch.launchDate.toString() === 'Invalid Date') {
        return res.status(400).json({
            error: 'Invalid launch date',
        })
    }
    addNewLaunch(launch)
    return res.status(201).json(launch)
}
function httpAbortLaunch(req,res){

    const launchId = Number(req.params.id);

    if(!existLaunchWithId(launchId))
    //if launch doesn't exist 
    return res.status(404).json({
        err: "Launch not found"
    })
    const aborted=abortLaunchById(launchId)
    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};