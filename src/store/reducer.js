const INITIAL_STATE = {
  distance: 50,
  speed: 50,
  battery: 100,
};

//ACTION CONSTANTS
const INCREASE_DISTANCE = 'INCREASE_DISTANCE';
const DECREASE_DISTANCE = 'DECREASE_DISTANCE';

const INCREASE_SPEED = 'INCREASE_SPEED';
const DECREASE_SPEED = 'DECREASE_SPEED';

//ACTION CREATORS
export const increaseDistance = () => ({ type: INCREASE_DISTANCE });
export const decreaseDistance = () => ({ type: DECREASE_DISTANCE });

export const increaseSpeed = () => ({ type: INCREASE_SPEED });
export const decreaseSpeed = () => ({ type: DECREASE_SPEED });

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
    default:
      return state;
  }
};

export default reducer;

// export default combineReducers({
//   friends: friendReducer,
// });
