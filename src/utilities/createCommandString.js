function createCommandString(flightInstruction) {
  if (flightInstruction[2]) {
    const curveString = `${flightInstruction[0]} ${flightInstruction[1]} ${
      flightInstruction[2]
    } ${flightInstruction[3]} ${flightInstruction[4]} ${flightInstruction[5]} ${
      flightInstruction[6]
    }`;

    console.log('curve string', curveString);
    return curveString;
  }
  if (flightInstruction[1]) {
    const directionString = `${flightInstruction[0]} ${flightInstruction[1]}`;

    console.log('direction string', directionString);
    return directionString;
  } else {
    console.log('reg flight string', flightInstruction[0]);
    return flightInstruction[0];
  }
}

export default createCommandString