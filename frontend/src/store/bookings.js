import { csrfFetch } from "./csrf";

export const getAllBookings = (list) => {
    return ({
        type: 'GET_ALL_BOOKINGS',
        payload: list
    });
};

export const createBooking = (booking) => {
    return ({
        type: 'CREATE_BOOKING',
        payload: booking
    })
};

export const deleteBooking = (booking) => {
    return ({
        type: 'DELETE_BOOKING',
        payload: booking
    })
};

export const getAllBookingsBySpotId = (list) => {
    return ({
        type: 'GET_ALL_BOOKINGS_BY_SPOT_ID',
        payload: list
    });
};

export const getAllBookingsThunk = () => async dispatch => {
    const response = await csrfFetch(`/api/bookings/current`);
    if (response.ok) {
        const allBookings = await response.json();
        console.log('all', allBookings);
        dispatch(getAllBookings(allBookings.Bookings));
    }
};

export const getAllBookingsBySpotIdThunk = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
    if (response.ok) {
        const allBookings = await response.json();
        console.log('spotId', allBookings);
        dispatch(getAllBookingsBySpotId(allBookings.Bookings));
    }
};

export const createBookingThunk = (booking) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${booking.spotId}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
    });

    if (response.ok) {
        const booking = await response.json();
        dispatch(createBooking(booking));
    }
};

export const deleteBookingThunk = (booking) => async dispatch => {
    const response = await csrfFetch(`/api/bookings/${booking.id}`, {
        method: "DELETE"
    });
    if (response.ok) {
        dispatch(deleteBooking(booking));
    }
};

export const editBookingThunk = (booking) => async dispatch => {
    console.log(booking);

    const response = await csrfFetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
    });

    if (response.ok) {
        const booking = await response.json();
        dispatch(createBooking(booking));
    }
}

const defaultState = {};
export const bookingsReducer = (state = defaultState, action) => {
    let newState;
    switch (action.type) {
        case 'GET_ALL_BOOKINGS': {
            newState = { ...state };
            // normalize data here
            action.payload.forEach(booking => newState[booking.id] = booking);
            return newState;
        }
        case 'GET_ALL_BOOKINGS_BY_SPOT_ID': {
            newState = {};
            action.payload.forEach(booking => newState[booking.id] = booking);
            return newState;
        }
        case 'CREATE_BOOKING': {
            newState = { ...state };
            newState[action.payload.id] = action.payload;
            return newState;
        }
        case 'DELETE_BOOKING': {
            newState = { ...state };
            delete newState[action.payload.id];
            return newState;
        }
        default: {
            return state;
        }
    }
};

export default bookingsReducer;
