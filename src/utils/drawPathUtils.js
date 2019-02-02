import PubSub from 'pubsub-js';

export const getDroneCoords = (flightInstructions, distance) => {
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
  const drawCoords = flightInstructions
    .slice(1, -1)
    .map(instructionObj => instructionObj.drawInstruction)
    .filter(instruction => instruction !== undefined);
  PubSub.publish('draw-path', drawCoords);
};
