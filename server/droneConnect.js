const dgram = require('dgram');
const wait = require('waait');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const throttle = require('lodash/throttle');
const commandDelays = require('./commandDelays');

const HOST = '192.168.10.1';

//DRONE COMMAND SEND/RECIEVE
const COMMANDPORT = 8889;
const droneCommand = dgram.createSocket('udp4');
droneCommand.bind(COMMANDPORT);

droneCommand.on('message', message => {
  console.log(`🤖 : ${message}`);
  io.sockets.emit('status', message.toString());
});

//DRONE TELEMETRY STATE
const STATEPORT = 8890;
const droneState = dgram.createSocket('udp4');
droneState.bind(STATEPORT);

droneState.on(
  'message',
  throttle(state => {
    const formattedState = parseState(state.toString());
    // console.log(formattedState);
    io.sockets.emit('dronestate', formattedState);
  }, 100)
);

function parseState(state) {
  return state
    .split(';')
    .map(x => x.split(':'))
    .reduce((data, [key, value]) => {
      data[key] = value;
      return data;
    }, {});
}

//DRONE VIDEO STREAM
const STREAMPORT = 11111;
const droneStream = dgram.createSocket('udp4');
droneStream.bind(STREAMPORT);

droneStream.on('message', message => {
  console.log('message', message);
});

//ERROR HANDLER
function handleError(err) {
  if (err) {
    console.log('ERROR');
    console.log(err);
  }
}

function sendCommand(flightInstructionString) {
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
}
// flightInstruction argument for all of the functions below is an array where the first argument (ind0) is

// // Adds flightInstruction to the existing list of instructions (doesn't run anything)
// const addInstructionToQueue = flightInstruction => {
//   autoPilot.push(flightInstruction);
// };

// Directly runs the given flightInstruction
const runSingleInstruction = async flightInstruction => {
  console.log(flightInstruction);
  sendCommand(flightInstruction);
  const delay = commandDelays[flightInstruction.split(' ')[0]];
  await wait(delay);
};

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
fly(autoPilot);

async function fly(flightManifest) {
  for (let i = 0; i < flightManifest.length; i++) {
    await runSingleInstruction(flightManifest[i]);
  }
  console.log('flown');
}

io.on('connection', socket => {
  socket.on('takeoff', () => {
    console.log('Take-off Sent from Browser:');
    runSingleInstruction('command');
    runSingleInstruction('takeoff');
  });
  socket.on('single-instruction', instruction => {
    console.log('Single instruction Sent from Browser:');
    console.log(instruction);
    runSingleInstruction(instruction);
  });
  socket.on('autopilot', instructions => {
    console.log('Multiple instructions Sent from Browser:');
    console.log(instructions);
    fly(instructions);
  });

  socket.emit('status', 'CONNECTED');
});

http.listen(6767, () => {
  console.log('Socket io server up and running');
});
