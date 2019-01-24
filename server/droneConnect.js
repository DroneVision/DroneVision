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

const EMERGENCY = 'emergency';

function sendCommand(flightInstruction) {
  if (flightInstruction[2]) {
    const curveString = `${flightInstruction[0]} ${flightInstruction[1]} ${
      flightInstruction[2]
    } ${flightInstruction[3]} ${flightInstruction[4]} ${flightInstruction[5]} ${
      flightInstruction[6]
    }`;

    console.log('curve string', curveString);
    droneCommand.send(
      flightString,
      0,
      flightString.length,
      COMMANDPORT,
      HOST,
      handleError
    );
  }
  if (flightInstruction[1]) {
    const flightString = `${flightInstruction[0]} ${flightInstruction[1]}`;

    console.log('flight string with second arg', flightString);

    droneCommand.send(
      flightString,
      0,
      flightString.length,
      COMMANDPORT,
      HOST,
      handleError
    );
  } else {
    console.log('reg flight string', flightInstruction[0]);
    droneCommand.send(
      flightInstruction[0],
      0,
      flightInstruction[0].length,
      COMMANDPORT,
      HOST,
      handleError
    );
  }
}

// sendCommand(COMMAND);
// sendCommand(BATTERY);
// sendCommand(TAKEOFF);
// sendCommand(UP, 100);
// sendCommand(DOWN, 50);
// // hold(5000);
// sendCommand(EMERGENCY);

// droneCommand.send(COMMAND, 0, COMMAND.length, COMMANDPORT, HOST, handleError);
// droneCommand.send(BATTERY, 0, BATTERY.length, COMMANDPORT, HOST, handleError);
// droneCommand.send(TAKEOFF, 0, TAKEOFF.length, COMMANDPORT, HOST, handleError);
// droneCommand.send(TAKEOFF, 0, TAKEOFF.length, COMMANDPORT, HOST, handleError);
// droneCommand.send(LAND, 0, LAND.length, COMMANDPORT, HOST, handleError);

const autoPilot = [
  [COMMAND],
  [BATTERY],
  [TAKEOFF],
  // [FORWARD, 50],
  // [BACK, 50],
  // [LEFT, 50],
  // [RIGHT, 50],
  // [RIGHT, 50],
  // [CW, 90],
  // [CCW, 90],
  // [CURVE, 25, 25, 0, 0, 50, 0],
  [LAND],
];

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
    const inst = flightManifest[i];
    const delay = commandDelays[inst[0]];

    sendCommand(inst);
    // console.log('command', inst[0], inst[1]);

    await wait(delay);
    // console.log('delay', delay);
  }

  // console.log('flown');
}

fly(autoPilot);

// setTimeout(() => {
//   sendCommand(EMERGENCY);
// }, 10000);

io.on('connection', socket => {
  socket.on('command', command => {
    console.log('command Sent from browser');
    console.log(command);
    droneCommand.send(
      command,
      0,
      command.length,
      COMMANDPORT,
      HOST,
      handleError
    );
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
