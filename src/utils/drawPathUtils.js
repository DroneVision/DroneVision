import PubSub from 'pubsub-js';

export const getFlightCoords = (flightInstructions, distance) => {
  return flightInstructions
    .slice(1, -1)
    .filter(instructionObj => {
      const instructionName = instructionObj.droneInstruction.split(' ')[0];
      return instructionName !== 'cw' && instructionName !== 'ccw';
    })
    .map(instructionObj =>
      instructionObj.droneInstruction
        .split(' ')
        .slice(1, 4)
        .map(numStr => Number(numStr) / distance)
    );
};

export const drawPath = (flightInstructions, distance) => {
  const flightCoords = getFlightCoords(flightInstructions, distance);
  PubSub.publish('draw-path', flightCoords);
};
