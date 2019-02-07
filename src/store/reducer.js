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
  navTab: 'home',
  startingPosition: startingPositionCoords,
  currentDronePosition: startingPositionCoords,
  currentDroneRotation: Math.PI,
  flightInstructions: [
    {
      droneInstruction: 'takeoff',
      message: 'Takeoff',
      drawInstruction: 'takeoff',
    },
    { droneInstruction: 'land', message: 'Land', drawInstruction: 'land' },
  ],
  droneOrientation: 0,

  droneConnectionStatus: {
    droneName: 'Drone Not Connected',
    isConnected: false,
  },
  postTakeoffPosition: {
    x: startingPositionCoords.x,
    y: startingPositionCoords.y + 1,
    z: startingPositionCoords.z,
  },
  buildDronePosition: {
    x: startingPositionCoords.x,
    y: startingPositionCoords.y + 1,
    z: startingPositionCoords.z,
  },
  sceneObjects: [],
  sceneObjectsVisible: true,
  selectedObjId: null,
  preVisualizeAnimation: false,
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
const UPDATE_CURRENT_DRONE_ROTATION = 'UPDATE_CURRENT_DRONE_ROTATION';

const ROTATE_DRONE = 'ROTATE_DRONE';

const TOGGLE_SCENE_OBJECTS_VISIBILITY = 'TOGGLE_SCENE_OBJECTS_VISIBILITY';

const UPDATE_DRONE_CONNECTION_STATUS = 'UPDATE_DRONE_CONNECTION_STATUS';

const UPDATE_SCENE_OBJECTS = 'UPDATE_SCENE_OBJECTS';
const ADD_SCENE_OBJECT = 'ADD_SCENE_OBJECT';
const UPDATE_SCENE_OBJECT = 'UPDATE_SCENE_OBJECT';
const UPDATE_SELECTED_OBJECT = 'UPDATE_SELECTED_OBJECT';
const DELETE_SELECTED_OBJECT = 'DELETE_SELECTED_OBJECT';
const CLEAR_OBJECTS = 'CLEAR_OBJECTS';

const UPDATE_BUILD_DRONE_POSITION = 'UPDATE_BUILD_DRONE_POSITION';
const TOGGLE_PREVIZUALIZE_ANIMATION = 'TOGGLE_PREVIZUALIZE_ANIMATION';

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

export const updateCDR = newRotation => ({
  type: UPDATE_CURRENT_DRONE_ROTATION,
  newRotation,
});

export const rotateDrone = newOrientation => ({
  type: ROTATE_DRONE,
  newOrientation,
});

export const updateDroneConnectionStatus = droneConnectionStatus => ({
  type: UPDATE_DRONE_CONNECTION_STATUS,
  droneConnectionStatus,
});

export const updateSceneObjs = sceneObjects => ({
  type: UPDATE_SCENE_OBJECTS,
  sceneObjects,
});

export const toggleSceneObjsVisibility = () => ({
  type: TOGGLE_SCENE_OBJECTS_VISIBILITY,
});

export const addSceneObj = newObject => ({
  type: ADD_SCENE_OBJECT,
  newObject,
});

export const updateSingleSceneObj = updatedObj => ({
  type: UPDATE_SCENE_OBJECT,
  updatedObj,
});

export const updateSelectedObj = objId => ({
  type: UPDATE_SELECTED_OBJECT,
  objId,
});

export const deleteSelectedObj = objId => ({
  type: DELETE_SELECTED_OBJECT,
  objId,
});

export const clearObjects = () => ({
  type: CLEAR_OBJECTS,
});

export const updateBuildDronePosition = updatedPosition => ({
  type: UPDATE_BUILD_DRONE_POSITION,
  updatedPosition,
});

export const togglePreVisualizeAnimation = () => ({
  type: TOGGLE_PREVIZUALIZE_ANIMATION,
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
    case UPDATE_CURRENT_DRONE_ROTATION:
      return { ...state, currentDroneRotation: action.newRotation };
    case ROTATE_DRONE:
      return { ...state, droneOrientation: action.newOrientation };

    case UPDATE_DRONE_CONNECTION_STATUS:
      return { ...state, droneConnectionStatus: action.droneConnectionStatus };
    case TOGGLE_SCENE_OBJECTS_VISIBILITY:
      return { ...state, sceneObjectsVisible: !state.sceneObjectsVisible };
    case UPDATE_SCENE_OBJECTS:
      return {
        ...state,
        sceneObjects: action.sceneObjects,
      };
    case ADD_SCENE_OBJECT:
      return {
        ...state,
        sceneObjects: [...state.sceneObjects, action.newObject],
      };
    case UPDATE_SCENE_OBJECT:
      const remainingObjs = state.sceneObjects.filter(
        sceneObj => sceneObj.id !== action.updatedObj.id
      );
      return {
        ...state,
        sceneObjects: [...remainingObjs, action.updatedObj],
      };
    case UPDATE_SELECTED_OBJECT:
      return {
        ...state,
        selectedObjId: action.objId,
      };
    case UPDATE_BUILD_DRONE_POSITION:
      return {
        ...state,
        buildDronePosition: action.updatedPosition,
      };
    case DELETE_SELECTED_OBJECT:
      const objectsToKeep = state.sceneObjects.filter(
        sceneObj => sceneObj.id !== action.objId
      );
      return {
        ...state,
        sceneObjects: [...objectsToKeep],
      };
    case CLEAR_OBJECTS:
      return {
        ...state,
        sceneObjects: [],
      };
    case TOGGLE_PREVIZUALIZE_ANIMATION:
      return {
        ...state,
        preVisualizeAnimation: !state.preVisualizeAnimation,
      };
    default:
      return state;
  }
};

export default reducer;
