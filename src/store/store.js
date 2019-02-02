export const voxelSizeValue = 10;
const startingPositionCoords = { x: 0, y: 0 + voxelSizeValue * -0.5, z: 0 };

const INITIAL_STATE = {
  distance: 0.5,
  speed: 50,
  battery: 100,
  scale: 10,
  voxelSize: voxelSizeValue,
  roll: 0,
  pitch: 0,
  yaw: 0,
  debugMode: true,
  navTab: 'build',
  startingPosition: startingPositionCoords,
  currentDronePosition: startingPositionCoords,
  flightInstructions: [
    { instruction: 'takeoff', message: 'Takeoff' },
    { instruction: 'land', message: 'Land' },
  ],
  droneOrientation: 0,
  obstacles: false,
};

//ACTION CONSTANTS
const INCREASE_DISTANCE = 'INCREASE_DISTANCE';
const DECREASE_DISTANCE = 'DECREASE_DISTANCE';

const INCREASE_SPEED = 'INCREASE_SPEED';
const DECREASE_SPEED = 'DECREASE_SPEED';

const TOGGLE_DEBUGMODE = 'TOGGLE_DEBUGMODE';

const CHANGE_ROLL = 'CHANGE_ROLL';
const CHANGE_PITCH = 'CHANGE_PITCH';
const CHANGE_YAW = 'CHANGE_YAW';

const CHANGE_TAB = 'CHANGE_TAB';

const UPDATE_INSTRUCTIONS = 'UPDATE_INSTRUCTIONS';
const CLEAR_INSTRUCTIONS = 'CLEAR_INSTRUCTIONS';

const UPDATE_CURRENT_DRONE_POSITION = 'UPDATE_CURRENT_DRONE_POSITION';

const ROTATE_DRONE = 'ROTATE_DRONE';

const TOGGLE_OBSTACLES = 'TOGGLE_OBSTACLES';

//ACTION CREATORS
export const increaseDistance = () => ({ type: INCREASE_DISTANCE });
export const decreaseDistance = () => ({ type: DECREASE_DISTANCE });

export const increaseSpeed = () => ({ type: INCREASE_SPEED });
export const decreaseSpeed = () => ({ type: DECREASE_SPEED });

export const toggleDebugMode = () => ({ type: TOGGLE_DEBUGMODE });

export const changeRoll = newRoll => ({ type: CHANGE_ROLL, newRoll });
export const changePitch = newPitch => ({ type: CHANGE_PITCH, newPitch });
export const changeYaw = newYaw => ({ type: CHANGE_YAW, newYaw });

export const changeTab = newTab => ({ type: CHANGE_TAB, newTab });

export const updateInstructions = flightInstructions => ({
  type: UPDATE_INSTRUCTIONS,
  flightInstructions,
});

export const clearInstructions = () => ({
  type: CLEAR_INSTRUCTIONS,
  flightInstructions: INITIAL_STATE.flightInstructions,
});

export const updateCDP = newPosition => ({
  type: UPDATE_CURRENT_DRONE_POSITION,
  newPosition,
});

export const rotateDrone = newOrientation => ({
  type: ROTATE_DRONE,
  newOrientation,
});

export const toggleObstacles = () => ({
  type: TOGGLE_OBSTACLES,
});

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INCREASE_DISTANCE:
      return { ...state, distance: state.distance + 10 };
    case DECREASE_DISTANCE:
      return { ...state, distance: state.distance - 10 };
    case INCREASE_SPEED:
      return { ...state, speed: state.speed + 10 };
    case DECREASE_SPEED:
      return { ...state, speed: state.speed - 10 };
    case TOGGLE_DEBUGMODE:
      return { ...state, debugMode: !state.debugMode };
    case CHANGE_ROLL:
      return { ...state, roll: action.newRoll };
    case CHANGE_PITCH:
      return { ...state, pitch: action.newPitch };
    case CHANGE_YAW:
      return { ...state, yaw: action.newYaw };
    case CHANGE_TAB:
      return { ...state, navTab: action.newTab };
    case UPDATE_INSTRUCTIONS:
      return { ...state, flightInstructions: action.flightInstructions };
    case CLEAR_INSTRUCTIONS:
      return { ...state, flightInstructions: action.flightInstructions };
    case UPDATE_CURRENT_DRONE_POSITION:
      return { ...state, currentDronePosition: action.newPosition };
    case ROTATE_DRONE:
      return { ...state, droneOrientation: action.newOrientation };
    case TOGGLE_OBSTACLES:
      return { ...state, obstacles: !state.obstacles };
    default:
      return state;
  }
};

export default reducer;
