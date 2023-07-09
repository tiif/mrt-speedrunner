import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { LOAD_USERS } from "../GraphQL/Queries";
const determineDirection = require ("./DetermineDirection.js")
const GetDoor = require("./GetDoor.js")

/**
  * parameter: an array of station which consist of station code exp: [CC1, CC2, NS1, NS2]
  * return: a list of array with station code with nearest door to escalator for each transit station.
  */
const GetUsers = ({stations}) => { 
  const { error, loading, data } = useQuery(LOAD_USERS);
  //the result array
  const [result, setResult] = useState([]);
  useEffect(() => {
    if (data) {
      var result = [];
      var length = stations.length;
      result.push(stations[0]);
      result.push(stations[1]);
      //use for each instead of for loop because of some react constrain
      //if need to decrease the station shown, change here
      stations.forEach((station, i) => {
        //index constrain to prevent index out of bound
        if (i > 1 && i < length - 1) {
          if (stations[i] == "Transit") {
            var dir = determineDirection(stations[i - 2], stations[i - 1]);
            var station2 = stations[i + 1];
            var door = GetDoor(data, dir, station2);
            result.push("Board " + stations[i - 1].substr(0, 2) + " at door " + door);
          } else {
            result.push(stations[i]);
          }
        }
      });
      result.push(stations[length - 1]);
      setResult(result);
    }
  }, [data, stations]); //make sure update when station change
  return (
         <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {result.map((value) => (
          <ListItem
            key={value} 
            disableGutters>
            <ListItemText primary={`${value}`} />
          </ListItem>
        ))}
      </List>);
}

export default GetUsers;

