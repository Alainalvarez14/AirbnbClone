
const load = list => ({
    type: 'LOAD',
    payload: list
});

// const loadSpecificSpot = spot => ({
//     type: 'LOAD_SPECIFIC_SPOT',
//     payload: spot
// });

export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots')

    if (response.ok) {
        const list = await response.json();
        // console.log(list, 'ggggggsssasdgfgfs');
        dispatch(load(list.Spots));
    }
}

// export const getSpotById = (id) => async dispatch => {
//     const response = await fetch(`/api/spots/${id}`);
//     if (response.ok) {
//         const spot = await response.json();
//         dispatch(loadSpecificSpot(spot));
//     }
// }

const defaultState = {};

export const spotsReducer = (state = defaultState, action) => {
    let newState;
    switch (action.type) {
        case 'LOAD': {
            newState = { ...state };
            // normalize data
            action.payload.forEach(spot => newState[spot.id] = spot);
            console.log(newState)
            return newState;
        }
        // case 'LOAD_SPECIFIC_SPOT': {
        //     newState = { ...action.payload };
        //     console.log(newState)
        //     return newState;
        // }
        default: {
            return state;
        }
    }
}

export default spotsReducer;
