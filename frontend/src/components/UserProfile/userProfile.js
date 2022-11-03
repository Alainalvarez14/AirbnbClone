import { editBookingThunk } from "../../store/bookings";
import { deleteBookingThunk } from "../../store/bookings";
import { getAllBookingsThunk } from "../../store/bookings";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import './UserProfile.css';
import { NavLink } from "react-router-dom";
import mockHome from '../../Images/mockHome.jpg'
import { deleteSpot } from "../../store/spots";
import { editSpot } from "../../store/spots";

const UserProfile = () => {

    const [showEditBookingForm, setShowEditBookingForm] = useState(false);
    const [userId, setUserId] = useState();
    const [spotId, setSpotId] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [bookingId, setBookingId] = useState();
    const bookingsList = useSelector(state => state.bookings);
    const spotList = useSelector(state => state.spots);
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [showEditSpotForm, setShowEditSpotForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setTheState] = useState('');
    const [country, setCountry] = useState('');
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [price, setPrice] = useState(0);
    const [id, setId] = useState(0);

    const openEditBookingForm = (booking) => {
        if (showEditBookingForm || showEditSpotForm) return;
        setUserId(booking.userId);
        setSpotId(booking.spotId);
        setStartDate(booking.startDate);
        setEndDate(booking.endDate);
        setBookingId(booking.id);
        setShowEditBookingForm(true);
    };

    const openEditSpotForm = (spot) => {
        if (showEditBookingForm || showEditSpotForm) return;
        setName(spot.name);
        setDescription(spot.description);
        setAddress(spot.address);
        setCity(spot.city);
        setTheState(spot.state);
        setCountry(spot.country);
        setLng(spot.lng);
        setLat(spot.lat);
        setPrice(spot.price);
        setId(spot.id);
        console.log(spot);
        setShowEditSpotForm(true);
    }

    useEffect(() => {
        dispatch(getAllBookingsThunk());
    }, [dispatch])

    const handleSubmitBooking = (e) => {
        e.preventDefault();
        let bookingObj = { id: bookingId, userId, spotId, startDate, endDate };
        dispatch(editBookingThunk(bookingObj));
        setShowEditBookingForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let spotObj = { id, address, city, state, country, lat, lng, name, description, price };
        dispatch(editSpot(spotObj));
        setShowEditSpotForm(false);
    };

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

    const handleCloseFormEditSpot = (e) => {
        e.preventDefault();
        setShowEditSpotForm(false);
        setName('');
        setDescription('');
        setAddress('');
        setCity('');
        setCountry('');
        setTheState('');
        setLng(0);
        setLat(0);
        setPrice(0);
    }
    const handleCloseFormEditBooking = (e) => {
        e.preventDefault();
        setShowEditBookingForm(false);
        setName('');
        setDescription('');
        setAddress('');
        setCity('');
        setCountry('');
        setTheState('');
        setLng(0);
        setLat(0);
        setPrice(0);
    }

    return (
        <div>
            {showEditSpotForm && (
                <div className="editSpotFormWrapper">
                    <form className="editSpotForm">
                        <ul className="editSpotInputBoxFieldsWrapper">
                            <div className="windowCloseIconButton" onClick={(e) => handleCloseFormEditSpot(e)}>
                                <i className="far fa-window-close"></i>
                            </div>
                            <div className="editYourSpotMessage">Edit your spot</div>
                            <div className="editSpotInputBoxFields">
                                {/* <label>Name:</label> */}
                                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                {/* <label>Description:</label> */}
                                <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                {/* <label>Address:</label> */}
                                <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                {/* <label>City:</label> */}
                                <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                {/* <label>State:</label> */}
                                <input type="text" name="state" value={state} onChange={(e) => setTheState(e.target.value)}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                {/* <label>Country:</label> */}
                                <input type="text" name="country" value={country} onChange={(e) => setCountry(e.target.value)}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                {/* <label>Lng:</label> */}
                                <input type="number" name="lng" value={lng} onChange={(e) => setLng(Number(e.target.value))}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                {/* <label>Lat:</label> */}
                                <input type="number" name="lat" value={lat} onChange={(e) => setLat(Number(e.target.value))}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                {/* <label>Price:</label> */}
                                <input type="number" name="price" value={price} onChange={(e) => setPrice(Number(e.target.value))}></input>
                            </div>
                        </ul>
                        <button onClick={(e) => handleSubmit(e)} className='editSpotFormSubmitButton'>Submit</button>
                    </form>
                </div>
            )}
            {showEditBookingForm && (
                <div className="editBookingFormWrapper">
                    <form className="editBookingForm">
                        <ul className="editBookingFormInputFieldsWrapper">
                            <div className="windowCloseIconButtonEditBookingForm" onClick={(e) => handleCloseFormEditBooking(e)}>
                                <i className="far fa-window-close"></i>
                            </div>
                            <div className="editBookingFormInputFields">
                                <label>Check-in:</label>
                                <input type="date" name="startDate" onChange={(e) => setStartDate(e.target.value)}></input>
                            </div>
                            <div>
                                <label>Check-out:</label>
                                <input type="date" name="endDate" onChange={(e) => setEndDate(e.target.value)}></input>
                            </div>
                            <button onClick={(e) => handleSubmitBooking(e)} className='editBookingFormSubmitButton'>Book Now!</button>
                            {/* <p>You won't be charged yet</p> */}
                        </ul>
                        {/* <button onClick={(e) => handleSubmitBooking(e)}>Book Now!</button> */}
                    </form>
                </div>
            )}
            <div>
                <h2>{user.firstName} {user.lastName}</h2>
                <p>User Name: {user.username}</p>
                <p>Email: {user.email}</p>
            </div>
            <h2>Reservations</h2>
            {bookingsList && (
                <div className="individualSpotsWrapper">
                    {Object.values(bookingsList).filter(booking => booking.userId === user.id)
                        .map(booking => {
                            const specificSpot = Object.values(spotList).find(spot => spot.id === booking.spotId)
                            // let formattedStartDate = formatDate(booking.startDate);
                            // let formattedEndDate = formatDate(booking.endDate);
                            return (
                                <div>
                                    <NavLink key={booking.id} to={`/spots/${specificSpot.id}`} className='eachSpotOnUserProfilePage'>

                                        <img className="mock-image" src={mockHome}></img>
                                        <div>{specificSpot.name}</div>
                                        <div>{specificSpot.city}, {specificSpot.state}</div>
                                        {/* <div>{booking.startDate}</div>
                                    <div>{booking.endDate}</div> */}
                                        <div>Check-in: {formatDate(booking.startDate)}</div>
                                        <div>Check-out: {formatDate(booking.endDate)}</div>
                                    </NavLink>
                                    <button onClick={() => dispatch(deleteBookingThunk(booking))}>Delete Booking</button>
                                    <button onClick={() => openEditBookingForm(booking)}>Edit Booking</button>
                                </div>
                            );
                        })}
                </div>
            )}

            <h2>My Spots</h2>
            <div className="individualSpotsWrapper">
                {
                    Object.values(spotList)?.filter(spot => spot.ownerId === user.id).map(spot => {
                        return (
                            <div key={spot.id}>
                                <NavLink to={`/spots/${spot.id}`} className='eachSpotOnUserProfilePage'>
                                    <img className="mock-image" src={mockHome}></img>
                                    <div>{spot.name} </div>
                                    <div>
                                        <div>{spot.city}, {spot.state} </div>
                                        {/* <div>{spot.avgRating} </div> */}
                                    </div>
                                    <div>${spot.price} </div>
                                </NavLink>

                                <button onClick={() => dispatch(deleteSpot(spot))}>Delete</button>
                                <button onClick={() => openEditSpotForm(spot)}>Edit</button>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
};

export default UserProfile;
