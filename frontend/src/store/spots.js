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

        dispatch(load(list.Spots));
    }
}

export const createSpot = (spot) => async dispatch => {

    const { previewImage, name, description, address, city, state, country, lat, lng, price } = spot;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("lat", lat);
    formData.append("lng", lng);
    formData.append("price", price);

    if (previewImage) formData.append("previewImage", previewImage);

    // const response = await csrfFetch('/api/spots', {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(spot)
    // });

    // if (response.ok) {
    //     const spot2 = await response.json();
    //     dispatch(createSpotAction(spot2));
    // }
    const response = await csrfFetch('/api/spots', {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
        },
        body: formData,
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

    const { previewImage, name, description, address, city, state, country, lat, lng, price } = spot;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("lat", lat);
    formData.append("lng", lng);
    formData.append("price", price);

    if (previewImage) formData.append("previewImage", previewImage);

    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "multipart/form-data",
        },
        body: formData,
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(createSpotAction(spot));
        dispatch(getAllSpots());
    }

    // const response = await csrfFetch(`/api/spots/${spot.id}`, {
    //     method: "PUT",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(spot)
    // });

    // if (response.ok) {
    //     const spot = await response.json();
    //     dispatch(createSpotAction(spot));
    // }
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

            // return Object.values(newState).filter(spot => spot.id !== action.payload.id);
            return newState;
        }
        default: {
            return state;
        }
    }
}

export default spotsReducer;
