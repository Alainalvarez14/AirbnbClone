import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import './SpecificSpotDetails.css';
import { useEffect, useState } from "react";
import { createBookingThunk } from "../../store/bookings";
import { useDispatch } from "react-redux";
import { getAllBookingsBySpotIdThunk } from "../../store/bookings";
import mockHome from '../../Images/mockHome.jpg'

const SpecificSpotDetails = () => {

    const { spotId } = useParams();
    const allSpots = useSelector(state => state.spots);
    const allBookings = useSelector(state => state.bookings);
    const selectedSpot = Object.values(allSpots).find(spot => spot.id === parseInt(spotId));
    const userId = useSelector(state => state.session.user.id);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const dispatch = useDispatch();

    const handleClick = (e) => {
        e.preventDefault();
        const bookingObj = { userId, spotId: parseInt(spotId), startDate, endDate };
        dispatch(createBookingThunk(bookingObj));
    };

    useEffect(() => {
        dispatch(getAllBookingsBySpotIdThunk(spotId));
    }, [dispatch]);

    const formatDate = (date) => {
        let myDate = new Date(date);
        let formattedDay = myDate.getUTCDate();
        if (formattedDay < 10) {
            formattedDay = '0' + formattedDay
        }
        let formattedMonth = myDate.getUTCMonth() + 1;
        if (formattedMonth < 10) {
            formattedMonth = '0' + formattedMonth
        }
        let formattedYear = myDate.getUTCFullYear();
        return formattedMonth + "/" + formattedDay + "/" + formattedYear;
    };


    // const hasBookings = selectedSpot.ownerId === userId && Object.values(allBookings).filter(booking => booking.Spot.id === spotId).length ?
    //     <div>
    //         {Object.values(allBookings).filter(booking => booking.Spot.id === spotId).map(
    //             booking =>
    //                 // startDateFormat = formatDate(booking.startDate)
    //                 // endDateFormat = formatDate(booking.endDate)
    //                 <div>
    //                     <p>User: {booking.User?.firstName} {booking.User?.lastName}</p>
    //                     {/* <p>Check-in: {booking.startDate}</p> */}
    //                     <p>Check-in: {formatDate(booking.startDate)}</p>
    //                     <p>Check-out: {formatDate(booking.endDate)}</p>
    //                 </div>
    //         )}
    //     </div> :
    //     <div>no bookings for this property</div>

    const hasBookings = () => {
        return selectedSpot.ownerId === userId && Object.values(allBookings).length ?
            <div>
                {Object.values(allBookings).map(
                    booking =>
                        // startDateFormat = formatDate(booking.startDate)
                        // endDateFormat = formatDate(booking.endDate)
                        <div>
                            <p>User: {booking.User?.firstName} {booking.User?.lastName}</p>
                            {/* <p>Check-in: {booking.startDate}</p> */}
                            <p>Check-in: {formatDate(booking.startDate)}</p>
                            <p>Check-out: {formatDate(booking.endDate)}</p>
                        </div>
                )}
            </div> :
            <div>no bookings for this property</div>
    }

    return (
        <>
            {selectedSpot && (
                <div key={selectedSpot.id}>
                    <img className="mock-image" src={mockHome}></img>
                    <h3 className="spotName">{selectedSpot.name}</h3>
                    <p className="spotAddress">{selectedSpot.city}, {selectedSpot.state}, {selectedSpot.country}</p>
                    <p className="spotPrice">price: ${selectedSpot.price} night</p>
                    {selectedSpot.ownerId === userId ?
                        <div>
                            Confirmed Bookings:
                            {allBookings && hasBookings()}
                        </div> :
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
                                <button onClick={(e) => handleClick(e)}>Book Now!</button>
                                <p>You won't be charged yet</p>
                            </ul>
                        </form>}
                </div>
            )}
        </>
    );
}

export default SpecificSpotDetails;
