import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import './SpecificSpotDetails.css';
import { useState } from "react";
import { createBookingThunk } from "../../store/bookings";
import { useDispatch } from "react-redux";

const SpecificSpotDetails = () => {

    const { spotId } = useParams();
    const allSpots = useSelector(state => state.spots);
    const selectedSpot = Object.values(allSpots).find(spot => spot.id === parseInt(spotId));
    // const [userId, setUserId] = useState(0);
    // const [spotId, setSpotId] = useState();
    const userId = useSelector(state => state.session.user.id);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const dispatch = useDispatch();


    const handleClick = (e) => {
        e.preventDefault();
        const bookingObj = { userId, spotId, startDate, endDate };
        dispatch(createBookingThunk(bookingObj));
    };

    return (
        <>
            <h1 className="spotName">{selectedSpot.name}</h1>
            <p className="spotAddress">{selectedSpot.city}, {selectedSpot.state}, {selectedSpot.country}</p>
            <p className="spotPrice">price: ${selectedSpot.price} night</p>
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
                    {/* <p>{selectedSpot.price}</p> */}
                </ul>
            </form>
        </>
    );
}

export default SpecificSpotDetails;
