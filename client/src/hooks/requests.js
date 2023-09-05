const API_URL='http://localhost:8000/v1';

//Load planets and return as JSON
async function httpGetPlanets() {
  const response =
  await fetch(`${API_URL}/planets`)
  return await response.json()
}
// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response =
  await fetch(`${API_URL}/launches`)
  const fetchedLaunches= await response.json();
  //the sort function will take 2 launches, a and b, and in the callback we'll
  //return a.flightNumber-b.flightNumber. if B has a flight number that is
  //greater than A's flight number, a smaller number minus a large number
  //will give us a negative results, which means our sort function will give us our
  //launches in ascending order by flight number.
  return fetchedLaunches.sort((a,b) =>{
    return a.flightNumber-b.flightNumber
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try{
  return await fetch(`${API_URL}/launches`, {
    method:"post",
    headers: {
      "Content-Type" :"application/json",
    },
    body: JSON.stringify(launch),
  })
}catch(err) {
  return {
    ok:false,
  }
}
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try{
  return await fetch(`${API_URL}/launches/${id}`, {
    method:"delete",
  });
}catch(err){
  return {
    ok:false,
  }
}
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};