import { csrfFetch } from "./csrf";

export const getAllReviews = (list) => {
    return ({
        type: 'GET_ALL_REVIEWS',
        payload: list
    });
};

export const createReview = (review) => {
    return ({
        type: 'CREATE_REVIEW',
        payload: review
    })
};

export const getAllReviewsThunk = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
        const allReviews = await response.json();
        // console.log('all', allReviews);
        dispatch(getAllReviews(allReviews.Reviews));
    }
};

export const createReviewThunk = (review) => async dispatch => {
    console.log('inside create review thunk');
    console.log(review);
    console.log(review.spotId);
    console.log(typeof review.spotId);
    const response = await csrfFetch(`/api/spots/${review.spotId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(createReview(review));
    }
};

const defaultState = {};
export const reviewsReducer = (state = defaultState, action) => {
    let newState;
    switch (action.type) {
        case 'GET_ALL_REVIEWS': {
            newState = { ...state };
            // normalize data here
            action.payload.forEach(review => newState[review.id] = review);
            return newState;
        }
        case 'CREATE_REVIEW': {
            newState = { ...state };
            newState[action.payload.id] = action.payload;
            return newState;
        }
        default: {
            return state;
        }
    }
};

export default reviewsReducer;
