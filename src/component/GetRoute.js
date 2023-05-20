import logo from '../logo.svg';
import '../App.css';
import {useState, useEffect, useRef} from "react";
import Axios from "axios";
import { Formik, Field, Form } from 'formik';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
/*
  * the component that includes form, and api calls to get the route
  */
const GetRoute = () => {
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
  //api token, todo: hide it somewhere
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEwMjkwLCJ1c2VyX2lkIjoxMDI5MCwiZW1haWwiOiJwZWt5dWFuQGdtYWlsLmNvbSIsImZvcmV2ZXIiOmZhbHNlLCJpc3MiOiJodHRwOlwvXC9vbTIuZGZlLm9uZW1hcC5zZ1wvYXBpXC92MlwvdXNlclwvc2Vzc2lvbiIsImlhdCI6MTY4NDI0NjYzMSwiZXhwIjoxNjg0Njc4NjMxLCJuYmYiOjE2ODQyNDY2MzEsImp0aSI6IjZhZDNlM2FmZTM2ZDgzNmNmN2YwMTE4ZWIzNjQ5MzA2In0.ko3pbuP-_mch3lJW-6GboRyQ3eEy-eQrBSiJHNtxcWU";
  //route result
  const [route, setRoute] = useState([]);

  //when submit the form, update the value of begin and end 
  const handleFormSubmit = (values) => {
    //getBeginCoor and end equiv should only be called when there is value
    shouldRender.current = true;
    setBegin(values.begin);
    setEnd(values.end);
  };

  //api call to get begin and end coordinate
  const getBeginCoor = () => {
    if (shouldRender.current == false) {
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
    if (shouldRender.current == false) {
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

  //fetch trip information 
  const fetchTrip = () => {
    Axios.get(`https://developers.onemap.sg/privateapi/routingsvc/route?start=${begCor.lat_beg}%2C${begCor.long_beg}&end=${endCor.lat_end}%2C${endCor.long_end}%2C&routeType=pt&token=${token}&date=2023-03-12&time=15%3A30%3A00&mode=RAIL&maxWalkDistance=1000`)
      .then((res) => {
        var result = [];
        var subway_result = res.data.plan.itineraries[0].legs.filter(x => x.mode == "SUBWAY");
        subway_result.forEach(x => {result.push(x.from.name + " (" + x.from.stopCode + ")");
          result.push(x.intermediateStops.map(y => y.name + " (" + y.stopCode + ")"));
          result.push(x.to.name + " (" + x.to.stopCode + ")");
        }
        );
        console.log(result.flat()); //debug purpose
        setRoute(result.flat());
      });
  }; 

  //begin and end coordinate will be get after the value of begin and end change, ie after form submittion
  useEffect(getBeginCoor, [begin]);
  useEffect(getEndCoor, [end]);

  return (
    <div className="App">
      <Formik 
        initialValues= {initialPlace}
        onSubmit = {handleFormSubmit}> 
        <Form>
          <Field id="begin" name="begin" placeholder="CC22"/>
          <Field id="end" name="end" placeholder="CC25"/>
          <button type="submit"> Update </button>
        </Form>
      </Formik>
      <button onClick={fetchTrip}> Show result </button>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {route.map((value) => (
          <ListItem
            key={value}
            disableGutters>
            <ListItemText primary={`${value}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default GetRoute;