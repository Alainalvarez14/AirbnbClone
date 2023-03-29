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

export const deleteReview = (review) => {
    return ({
        type: 'DELETE_REVIEW',
        payload: review
    })
};

export const getAllReviewsThunk = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
        const allReviews = await response.json();

        dispatch(getAllReviews(allReviews.Reviews));
    }
};

export const createReviewThunk = (review) => async dispatch => {

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

export const deleteReviewThunk = (review) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${review.id}`, {
        method: "DELETE"
    });
    if (response.ok) {
        dispatch(deleteReview(review));
    }
};

export const editReviewThunk = (review) => async dispatch => {
   

    const response = await csrfFetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(createReview(review));
    }
}

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
        case 'DELETE_REVIEW': {
            newState = { ...state };
            delete newState[action.payload.id];
            return newState;
        }
        default: {
            return state;
        }
    }
};

export default reviewsReducer;
