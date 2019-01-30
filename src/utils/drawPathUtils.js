import PubSub from 'pubsub-js';

export const getFlightCoords = (flightInstructions, distance) => {
  return flightInstructions.slice(1, -1).map(instructionObj =>
    instructionObj.instruction
      .split(' ')
      .slice(1, 4)
      .map(numStr => Number(numStr) / distance)
  );
};

export const drawPath = (flightInstructions, distance) => {
  const flightCoords = getFlightCoords(flightInstructions, distance);
  PubSub.publish('draw-path', flightCoords);
};
