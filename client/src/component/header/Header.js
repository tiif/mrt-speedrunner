import './Header.css';
import {useState, useEffect, useRef} from "react";
import Axios from "axios";
import { Formik, Field, Form } from 'formik';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import GetUsers from "./GetUsers";
import GetKey from "./GetKey";


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

  //api call for token
  const callToken = () => {
    Axios.get("http://localhost:6969/api/")
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


  return (
    <>
    <div id="header"k>
    <ProSidebar collapsed={menuCollapse}>
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
    <button type="submit"> Update </button>
    </Form>
    </Formik>
    <br></br>
    <br></br>
    <button id="button1" onClick={fetchTrip}> Show result </button>
    <GetUsers stations={route}/>
    </div>
    </MenuItem>

    </Menu>
    </SidebarContent>
    </ProSidebar>
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
