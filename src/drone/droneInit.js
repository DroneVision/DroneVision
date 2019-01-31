const dgram = require('dgram');
const wait = require('waait');
const throttle = require('lodash/throttle');
const commandDelays = require('./commandDelays');
const PubSub = require('pubsub-js');
const { ipcMain } = require('electron');
const 


const HOST = '192.168.10.1';
const COMMANDPORT = 8889;
const STATEPORT = 8890;
const STREAMPORT = 11111;

module.exports = function() {
  //DRONE COMMANDS
  const droneCommand = dgram.createSocket('udp4');
  droneCommand.bind(COMMANDPORT);

  droneCommand.on('message', message => {
    console.log(`🤖 : ${message}`);
  });

  //DRONE STATE
  const droneState = dgram.createSocket('udp4');
  droneState.bind(STATEPORT);
  let formattedState;

  const parseState = state => {
    return state
      .split(';')
      .map(x => x.split(':'))
      .reduce((data, [key, value]) => {
        data[key] = value;
        return data;
      }, {});
  };

  droneState.on(
    'message',
    throttle(state => {
      formattedState = parseState(state.toString());
    }, 100)
  );

  // Get the drone state
  const getDroneState = () => formattedState;

  //DRONE VIDEO STREAM
  // const droneStream = dgram.createSocket('udp4');
  // droneStream.bind(STREAMPORT);

  // droneStream.on('message', message => {
  //   console.log('message', message);
  // });

  //ERROR HANDLER
  const handleError = err => {
    if (err) {
      console.log('ERROR');
      console.log(err);
    }
  };

  const sendCommand = flightInstructionString => {
    console.log('Flight Instruction String:', flightInstructionString);
    droneCommand.send(
      flightInstructionString,
      0,
      flightInstructionString.length,
      COMMANDPORT,
      HOST,
      handleError
    );
  };

  // Directly runs the given flightInstruction
  const runSingleInstruction = async flightInstruction => {
    console.log(flightInstruction);
    sendCommand(flightInstruction);
    const delay = commandDelays[flightInstruction.split(' ')[0]];
    await wait(delay);
  };

  let currentDronePosition = { x: 0, y: 1, z: 0 };

  const runInstructionList = async instructionList => {
    for (let i = 0; i < instructionList.length; i++) {
      //Tell Drone to Animate Next Position

      await runSingleInstruction(instructionList[i]);
    }
    console.log('flown');
  };
  return {
    runSingleInstruction,
    runInstructionList,
    getDroneState,
  };
};
