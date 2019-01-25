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

//ERROR HANDLER
function handleError(err) {
  if (err) {
    console.log('ERROR');
    console.log(err);
  }
}

const COMMAND = 'command';
const BATTERY = 'battery?';
const TAKEOFF = 'takeoff';
const UP = 'up';
const DOWN = 'down';
const LAND = 'land';
const LEFT = 'left';
const RIGHT = 'right';
const FORWARD = 'forward';
const BACK = 'back';
const CURVE = 'curve';
const CW = 'cw';
const CCW = 'ccw';
const GO = 'go';
const EMERGENCY = 'emergency';
const FLIP = 'flip';

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
  sendCommand(flightInstruction);
  const delay = commandDelays[flightInstruction.split(' ')[0]];
  await wait(delay);
};

const autoPilot = [
  'command',
  'battery?',
  'takeoff',
  'curve 100 -100 0 200 0 40 50',
  'ccw -180',
  'curve 100 -100 0 200 0 -40 50',
  'land',
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

// function fly(flightManifest) {
//   flightManifest.forEach(async inst => {
//     const delay = commandDelays[inst[0]];
//     sendCommand(inst);
//     console.log(inst[0], inst[1]);
//     await wait(delay);
//   });
//   console.log('flown');
// }
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
    runSingleInstruction('command');
  });
  socket.on('single-command', command => {
    console.log('Single Command Sent from Browser:');
    console.log(command);
    runSingleInstruction(command);
  });
  socket.on('autopilot', commands => {
    console.log('Multiple Commands Sent from Browser:');
    console.log(commands);
    fly(commands);
  });

  socket.emit('status', 'CONNECTED');
});

droneState.on(
  'message',
  throttle(state => {
    const formattedState = parseState(state.toString());
    io.sockets.emit('dronestate', formattedState);
  }, 100)
);

http.listen(6767, () => {
  console.log('Socket io server up and running');
});
