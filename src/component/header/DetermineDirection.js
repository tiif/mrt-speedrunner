/**
  * parameter:
  * code1: the previous station of the same line
  * code2: the next station of the same line
  * exp: code1 is CC1, code2 is CC2
  * return: direction code 
  */
module.exports = function determineDirection(code1, code2) {
  const firstNum = parseInt(code1.substr(2));
  const secondNum = parseInt(code2.substr(2));
  const line = code1.substr(0, 2);
  console.log(firstNum);
  console.log(secondNum);

  if (line == "CC") {
    if (firstNum < secondNum) {
      return "CC9";
    } else {
      return "CC810";
    }
  } else if (line == "NS") {
    if (firstNum < secondNum) {
      return "NS5";
    } else {
      return "NS4";
    }
  } else if (line == "DT") {
    if (firstNum < secondNum) {
      return "DT12";
    } else {
      return "DT11";
    }
  } else if (line == "TE") {
    if (firstNum < secondNum) {
      return "TE14";
    } else {
      return "TE13";
    }
  } else if (line == "NE") {
    if (firstNum < secondNum) {
      return "NE7";
    } else {
      return "NE6";
    }
  } else {
    if (firstNum < secondNum) {
      return "EW2";
    } else {
      return "EW13";
    }
    //line == EW
  }
}

