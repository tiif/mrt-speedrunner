# mrt-speedrunner

### Quick start for user
- run https://mrt-speedrunner.vercel.app/

### Dev environment setup
- install npm
- in the project root directory, run ``npm install`` 
- after the dependencies are installed, run ``npm start``

### Usage guide 
- input the mrt station in the form of station code, exp: ``CC23``,``TE8``, ..., 
- click ``update``
- click ``show result``

### How it works
1. When the user input the station code (exp: CC23 to TE8), an api call is done to get the coordinate of the station.  
```javascript
//in ./client/src/component/header/Header.js
  const getBeginCoor = () => {
    if (shouldRender.current === false) {
      return;
    }
    Axios.get(`https://developers.onemap.sg/commonapi/search?searchVal=${begin}&returnGeom=Y&getAddrDetails=N&pageNum=1`)
      .then((res) => {
        //updte the coordinate after the api call
        setBegCor({
          lat_beg: res.data.results[0].LATITUDE,
          long_beg: res.data.results[0].LONGITUDE
        });
      });
    console.log("get begin"); //debug purpose
  };

  const getEndCoor = () => {
    if (shouldRender.current === false) {
      //updte the coordinate after the api call
      return;
    }
    Axios.get(`https://developers.onemap.sg/commonapi/search?searchVal=${end}&returnGeom=Y&getAddrDetails=N&pageNum=1`)
      .then((res) => {
        //updte the coordinate after the api call
        setEndCor({
          lat_end: res.data.results[0].LATITUDE,
          long_end: res.data.results[0].LONGITUDE
        });
      });
    console.log("get end"); //debug purpose
  };
```
2. By using the coordinate we get in previous step, we fetch the first result returned by OneMap api.
```javascript
 const fetchTrip = () => {
    Axios.get(`https://developers.onemap.sg/privateapi/routingsvc/route?start=${begCor.lat_beg}%2C${begCor.long_beg}&end=${endCor.lat_end}%2C${endCor.long_end}%2C&routeType=pt&token=${token}&date=2023-03-12&time=15%3A30%3A00&mode=RAIL&maxWalkDistance=1000`)
      .then((res) => {
        console.log(res);
        var result = [];
        var subway_result = res.data.plan.itineraries[0].legs.filter(x => x.mode === "SUBWAY");
        var transit_result= res.data.plan.itineraries[0].legs.filter(x => (x.mode === "WALK" && x.from.vertexType == "TRANSIT"));
        var code_result = res.data.plan.itineraries[0].legs.filter(x => x.mode === "SUBWAY");
        //trial variable for the array passed in Getuser
        console.log(transit_result[0].from.name); //transit mrt station name
        //variable to keep track of all transit result
        var result_index = 0;
            code_result.forEach(x => {
              if (x.from.name == transit_result[result_index].from.name) {
                result.push("Transit");
                result_index++;
              }
              result.push(x.from.stopCode);
              result.push(x.intermediateStops.map(y => y.stopCode));
              result.push(x.to.stopCode);
            }
            );
            console.log(result.flat()); //debug purpose
            setRoute(result.flat());
          });
  }; 

```
3. The route is then passed in for ``GetUser.js`` to get the nearest door for quickest transit. //need to change the name.
```javascript
     <GetUsers stations={route}/>
```
4. In ``GetUser.js``, the door data is queried from the GraphQL database.
```javascript
  const { error, loading, data } = useQuery(LOAD_USERS);
```
5. If it is a transit station, then we will add the nearest door to the escalator for the fastest transit result.
```javascript
          if (stations[i] == "Transit") {
            var dir = determineDirection(stations[i - 2], stations[i - 1]);
            var station2 = stations[i + 1];
            var door = GetDoor(data, dir, station2);
            result.push("Board " + stations[i - 1].substr(0, 2) + " at door " + door);
          }
```


### Further improvement
- use menu for user to select the mrt station
- try catch possible errors


