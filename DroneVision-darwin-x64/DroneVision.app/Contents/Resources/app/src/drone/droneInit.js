const dgram = require('dgram');
const wait = require('waait');
const throttle = require('lodash/throttle');
const commandDelays = require('./commandDelays');

const HOST = '192.168.10.1';
const COMMANDPORT = 8889;
const STATEPORT = 8890;
const STREAMPORT = 11111;


const { ipcMain } = require('electron');

const autoPilot = [
  'command',
  'battery?',
  'streamon',
  // 'takeoff',
  // 'curve 100 -100 0 200 0 40 50',
  // 'ccw -180',
  // 'curve 100 -100 0 200 0 -40 50',
  // 'land',
  // [FORWARD, 50],
  // [BACK, 50],
  // [LEFT, 50],
  // [RIGHT, 50],
  // [RIGHT, 50],
  // [CW, 90],
  // [CCW, 90],
  // [CURVE, 50, 50, 0, 100, 0, 0, 10],
  // [GO, -200, 0, 0, 10],
];

// testing purposes -> comment out when using frontend
// runInstructionList(autoPilot);

// io.on('connection', socket => {
//   socket.on('takeoff', () => {
//     console.log('Take-off Sent from Browser:');
//     runSingleInstruction('command');
//     runSingleInstruction('takeoff');
//   });
//   socket.on('single-instruction', instruction => {
//     console.log('Single instruction Sent from Browser:');
//     console.log(instruction);
//     runSingleInstruction(instruction);
//   });
//   socket.on('autopilot', instructions => {
//     console.log('Multiple instructions Sent from Browser:');
//     console.log(instructions);
//     runInstructionList(instructions);
//   });

//   socket.emit('status', 'CONNECTED');
// });


module.exports = function() {
  //DRONE COMMANDS
  const droneCommand = dgram.createSocket('udp4');
  droneCommand.bind(COMMANDPORT);

  droneCommand.on('message', message => {
    console.log(`🤖 : ${message}`);
    // io.sockets.emit('status', message.toString());
  });

  //DRONE STATE
  const droneState = dgram.createSocket('udp4');
  droneState.bind(STATEPORT);
  let formattedState

  

  
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
  const getDroneState = () => formattedState ;

  //DRONE VIDEO STREAM
  const droneStream = dgram.createSocket('udp4');
  droneStream.bind(STREAMPORT);

  droneStream.on('message', message => {
    console.log('message', message);
  });

  //ERROR HANDLER
  const handleError = err => {
    if (err) {
      console.log('ERROR');
      console.log(err);
    }
  };

  const sendCommand = flightInstructionString => {
    // const flightInstructionString = flightInstruction.join(' ');
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

  const runInstructionList = async instructionList => {
    for (let i = 0; i < instructionList.length; i++) {
      await runSingleInstruction(instructionList[i]);
    }
    console.log('flown');
  };
  return {
    runSingleInstruction,
    runInstructionList,
    getDroneState
  };
};
