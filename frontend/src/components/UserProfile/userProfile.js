import { editBookingThunk } from "../../store/bookings";
import { deleteBookingThunk } from "../../store/bookings";
import { createBookingThunk } from "../../store/bookings";
import { getAllBookingsThunk } from "../../store/bookings";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const UserProfile = () => {

    const [showEditBookingForm, setShowEditBookingForm] = useState(false);
    const [showAllBookings, setShowAllBookings] = useState(false);
    const [userId, setUserId] = useState();
    const [spotId, setSpotId] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [bookingId, setBookingId] = useState();
    const bookingsList = useSelector(state => state.bookings);
    const dispatch = useDispatch();

    const openEditBookingForm = (booking) => {
        if (showEditBookingForm) return;
        setUserId(booking.userId);
        setSpotId(booking.spotId);
        setStartDate(booking.startDate);
        setEndDate(booking.endDate);
        setBookingId(booking.id);
        setShowEditBookingForm(true);
    };

    useEffect(() => {
        dispatch(getAllBookingsThunk());
    }, [dispatch])

    const handleSubmitBooking = (e) => {
        e.preventDefault();
        let bookingObj = { id: bookingId, userId, spotId, startDate, endDate };
        dispatch(editBookingThunk(bookingObj));
        setShowEditBookingForm(false);
    };

    return (
        <div>
            <div>
                {Object.values(bookingsList).map(booking => {
                    return (
                        <div key={booking.id}>
                            booking!!!!
                            <div>{booking.Spot.name}</div>
                            <div>{booking.startDate}</div>
                            <div>{booking.endDate}</div>
                            <button onClick={() => dispatch(deleteBookingThunk(booking))}>Delete Booking</button>
                            <button onClick={() => openEditBookingForm(booking)}>Edit Booking</button>
                        </div>
                    );
                })}
            </div>
            {showEditBookingForm && (
                <form>
                    <ul>
                        <div>
                            <label>Check-in:</label>
                            <input type="date" name="startDate" onChange={(e) => setStartDate(e.target.value)}></input>
                        </div>
                        <div>
                            <label>Check-out:</label>
                            <input type="date" name="endDate" onChange={(e) => setEndDate(e.target.value)}></input>
                        </div>
                        <button onClick={(e) => handleSubmitBooking(e)}>Book Now!</button>
                        <p>You won't be charged yet</p>
                    </ul>
                    {/* <button onClick={(e) => handleSubmitBooking(e)}>Book Now!</button> */}
                </form>
            )}
        </div>
    )
};

export default UserProfile;
