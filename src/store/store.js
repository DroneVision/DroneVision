const INITIAL_STATE = {
  distance: 50,
  speed: 50,
  battery: 100,
  scale: 10,
  voxelSize: 10,
  roll: 0,
  pitch: 0,
  yaw: 0,
  debugMode: true,
  navTab: 'build',
  startingPosition: { x: 0, y: 1, z: 0 },
  currentDronePosition: { x: 0, y: 1, z: 0 },
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

const UPDATE_CURRENT_DRONE_POSITION = 'UPDATE_CURRENT_DRONE_POSITION';

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

export const updateCDP = newPosition => ({
  type: UPDATE_CURRENT_DRONE_POSITION,
  newPosition,
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
    case UPDATE_CURRENT_DRONE_POSITION:
      return { ...state, currentDronePosition: action.newPosition };
    default:
      return state;
  }
};

export default reducer;

// export default combineReducers({
//   friends: friendReducer,
// });
