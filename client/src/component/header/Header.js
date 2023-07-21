import './Header.css';
import {useState, useEffect, useRef} from "react";
import Axios from "axios";
import { Formik, Field, Form } from 'formik';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import GetUsers from "./GetUsers";

import { MapContainer, TileLayer, LayerGroup, Circle, SVGOverlay, Marker, Popup } from "react-leaflet";
import osm from "./osm-providers";
import "leaflet/dist/leaflet.css";

import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";

import {FiMenu, FiArrowLeftCircle, FiArrowRightCircle} from "react-icons/fi";
import "react-pro-sidebar/dist/css/styles.css";


const Header = () => {


  const position = [1.287953, 103.851784]
 


 /*
   const [center, setCenter] = useState({ lat: 1.287953, lng: 103.851784 });

  const beautyworld = [1.3411, 103.7758]
  const mapRef = useRef();
  const bounds = [
      [1.287953, 103.851784],
      [1.287953, 103.851784],
    ]
    */
  const fillRedOptions = { fillColor: 'red', color: 'red', fillOpacity: '0.1', strokeWeight:'0' }


  //initial coordinate values
  const initialBegCoorValues = {
    lat_beg:'', 
    long_beg: '', 
  };
  const initialEndCoorValues = {
    lat_end: '', 
    long_end: '',
  };
  //initial value of the input form
  const initialPlace = {
    begin:'',
    end:''
  };
  //set begin and end input (the place to go, for example CC22)
  //TODO: can be further optimized 
  const [begin, setBegin] = useState("");
  const [end, setEnd] = useState("");
  //prevent getBeginCoor and getEndCoor from being called when first mount
  const shouldRender = useRef(false);
  //begin and end coordinate
  const [begCor, setBegCor] = useState(initialBegCoorValues);
  const [endCor, setEndCor] = useState(initialEndCoorValues);
  //api token 
  const [token, setToken] = useState("");
  //route result
  const [route, setRoute] = useState([]);
  const [latcoord, setLatCoord] = useState([]);
  const [loncoord, setLonCoord] = useState([]);

  //api call for token
  const callToken = () => {
    Axios.get("https://mrt-speedrunner-server.vercel.app/api")
      .then((res) => {setToken(res.data.access_token)});
  };

  //when submit the form, update the value of begin and end 
  const handleFormSubmit = (values) => {
    //getBeginCoor and end equiv should only be called when there is value
    shouldRender.current = true;
    setBegin(values.begin);
    setEnd(values.end);
  };

  //api call to get begin and end coordinate
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
  //DT12 to CC13 for double transit
  //fetch trip information 
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
        //temporarily suspend
        /*
          subway_result.forEach(x => {
            if (x.from.name == transit_result[result_index].from.name) {
              result.push("Transit");
              result_index++;
            }
            result.push(x.from.name + " (" + x.from.stopCode + ")");
            result.push(x.intermediateStops.map(y => y.name + " (" + y.stopCode + ")"));
            result.push(x.to.name + " (" + x.to.stopCode + ")");
          } */
            //trial for code result
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

  function getLatCoord() {
    Axios.get(`https://developers.onemap.sg/privateapi/routingsvc/route?start=${begCor.lat_beg}%2C${begCor.long_beg}&end=${endCor.lat_end}%2C${endCor.long_end}%2C&routeType=pt&token=${token}&date=2023-03-12&time=15%3A30%3A00&mode=RAIL&maxWalkDistance=1000`)
      .then((res) => {
        var result1 = [];
        var subway_result = res.data.plan.itineraries[0].legs.filter(x => x.mode === "SUBWAY");
        subway_result.forEach(x => {result1.push(x.from.lat);
          result1.push(x.intermediateStops.map(y => y.lat));
          result1.push(x.to.lat);
        }
        );
        console.log(result1.flat()); //debug purpose
        setLatCoord(result1.flat()); //.flat()
      });
  }; 


  function getLonCoord() {
    Axios.get(`https://developers.onemap.sg/privateapi/routingsvc/route?start=${begCor.lat_beg}%2C${begCor.long_beg}&end=${endCor.lat_end}%2C${endCor.long_end}%2C&routeType=pt&token=${token}&date=2023-03-12&time=15%3A30%3A00&mode=RAIL&maxWalkDistance=1000`)
      .then((res) => {
        var result2 = [];
        var subway_result = res.data.plan.itineraries[0].legs.filter(x => x.mode === "SUBWAY");
        subway_result.forEach(x => {result2.push(x.from.lon);
          result2.push(x.intermediateStops.map(y => y.lon));
          result2.push(x.to.lon);
        }
        );
        console.log(result2.flat()); //debug purpose
        setLonCoord(result2.flat()); //.flat()
      });
  }; 

  //begin and end coordinate will be get after the value of begin and end change, ie after form submittion
  useEffect(callToken, []);
  useEffect(getBeginCoor, [begin]);
  useEffect(getEndCoor, [end]);


  //create initial menuCollapse state using useState hook
  const [menuCollapse, setMenuCollapse] = useState(false)

  //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };
  const [toggled, setToggled] = useState(false);
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <>
    <div className='stuff grid'>
      <div id="header">
          {}
        <ProSidebar collapsed={menuCollapse} >
          <SidebarHeader>
          <div className="logotext">
              {}
              <p id="title1"> {menuCollapse ? "" : "MRT Speedrunner"}</p>

            
              </div>
            <div className="closemenu" onClick={menuIconClick}>
                {}
              {menuCollapse ? (
                <FiMenu/>
              ) : (
                <FiMenu/>
              )}
            </div>
    </SidebarHeader>
    <SidebarContent>
    <Menu>
    <MenuItem active={true}>
    <div className="App1">
    <Formik 
    initialValues= {initialPlace}
    onSubmit = {handleFormSubmit}> 
    <Form>
    <label for="begin">From: </label>
    <Field id="begin" name="begin" placeholder="CC22"/>
    <br></br>
    <br></br>
    <label for="end">To: </label>
    <Field id="end" name="end" placeholder="CC25"/>
    <br></br>
    <br></br>
    <button type="submit" id="button1" > Update </button>
    </Form>
    </Formik>
    <br></br>
    <br></br>
    <button id="button2" onClick={()=>{fetchTrip(); getLatCoord(); getLonCoord(); } }> Show result </button>
    {console.log('route is: ', route)}
    
    
   
     <GetUsers stations={route}/>
    

    </div>


    </MenuItem>

    </Menu>
    </SidebarContent>
    </ProSidebar>
      </div>
      <MapContainer center={position} zoom={12} scrollWheelZoom={true}>

    <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={osm.maptiler.url}
            />
        <LayerGroup>
        {latcoord.map((value1, value3) => loncoord.map((value2) => (
         
         <Circle
         center={[value1, loncoord[value3]]}
         pathOptions={fillRedOptions}
         radius={200}
         stroke={true}
         />    
         )))}


     </LayerGroup>


      </MapContainer>
    </div>

    </>
  );
};

export default Header;

/*suspended for trial
  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
  {route.map((value) => (
    <ListItem
    key={value} 
    disableGutters>
    <ListItemText primary={`${value}`} />
    </ListItem>
  ))}
  </List> */
