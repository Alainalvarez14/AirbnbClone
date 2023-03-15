import { csrfFetch } from "./csrf"
import { getAllSpots } from "./spots";

const createImageAction = image => ({
    type: 'CREATE_IMAGE',
    payload: image
});

export const createImageThunk = (image) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${image.spotImageId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(image)
    });
    console.log(response)

    // if (response.ok) {
    //     const image = await response.json();
    //     dispatch(createImageAction(image));
    // }
    if (response.ok) {
        dispatch(getAllSpots())
    }
}

const defaultState = {};

export const imagesReducer = (state = defaultState, action) => {
    let newState;
    switch (action.type) {
        case 'CREATE_IMAGE': {
            newState = { ...state };
            newState[action.payload.id] = action.payload;
            return newState;
        }
        default: {
            return state;
        }
    }
}

export default imagesReducer;
