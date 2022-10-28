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

export const getAllBookingsThunk = () => async dispatch => {
    const response = await csrfFetch(`/api/bookings/current`);
    console.log(response);
    if (response.ok) {
        const allBookings = await response.json();
        console.log(allBookings);
        dispatch(getAllBookings(allBookings.Bookings));
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
        case 'CREATE_BOOKING': {
            newState = { ...state };
            newState[action.payload.id] = action.payload;
            return newState;
        }
        default: {
            return state;
        }
    }
};

export default bookingsReducer;
