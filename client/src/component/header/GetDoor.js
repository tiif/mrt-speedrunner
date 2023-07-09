/** function that returns the door number
  * data: the whole data from the graphql server
  * station1: the direction code
  * station2: the second leg of the transit station 
  */
module.exports = function GetDoor(data, station1, station2) {
  console.log(data);
  var users = data.getAllUsers.filter((first) => first.name == station1)
    .map((val) => val.next.filter((second) => second.name == station2))
    .map((val) => val[0].door);
 //need error message if no result
  return users;
}
