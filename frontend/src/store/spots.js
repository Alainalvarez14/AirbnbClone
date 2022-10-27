import { csrfFetch } from "./csrf"

const load = list => ({
    type: 'LOAD',
    payload: list
});

const createSpotAction = spot => ({
    type: 'CREATE_SPOT',
    payload: spot
});

const deleteSpotAction = spot => ({
    type: 'DELETE_SPOT',
    payload: spot
});

export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots')

    if (response.ok) {
        const list = await response.json();
        // console.log(list, 'ggggggsssasdgfgfs');
        dispatch(load(list.Spots));
    }
}

export const createSpot = (spot) => async dispatch => {

    const response = await csrfFetch('/api/spots', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    });

    if (response.ok) {
        const spot2 = await response.json();
        dispatch(createSpotAction(spot2));
    }
}

export const deleteSpot = (spot) => async dispatch => {

    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: "DELETE"
    });
    if (response.ok) {
        dispatch(deleteSpotAction(spot));
    }
}

export const editSpot = (spot) => async dispatch => {
    console.log(spot);
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(createSpotAction(spot));
    }
}

const defaultState = {};

export const spotsReducer = (state = defaultState, action) => {
    let newState;
    switch (action.type) {
        case 'LOAD': {
            newState = { ...state };
            // normalize data
            action.payload.forEach(spot => newState[spot.id] = spot);
            return newState;
        }
        case 'CREATE_SPOT': {
            newState = { ...state };
            newState[action.payload.id] = action.payload;
            return newState;
        }
        case 'DELETE_SPOT': {
            newState = { ...state };
            delete newState[action.payload.id];
            console.log(newState);
            // return Object.values(newState).filter(spot => spot.id !== action.payload.id);
            return newState;
        }
        default: {
            return state;
        }
    }
}

export default spotsReducer;
