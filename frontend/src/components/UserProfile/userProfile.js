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
        if (showEditBookingForm) return;
        setUserId(booking.userId);
        setSpotId(booking.spotId);
        setStartDate(booking.startDate);
        setEndDate(booking.endDate);
        setBookingId(booking.id);
        setShowEditBookingForm(true);
    };

    const openEditSpotForm = (spot) => {
        if (showEditSpotForm) return;
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
        let formattedDay = myDate.getDate() + 1;
        if (formattedDay < 10) {
            formattedDay = '0' + formattedDay
        }
        let formattedMonth = myDate.getMonth() + 1;
        if (formattedMonth < 10) {
            formattedMonth = '0' + formattedMonth
        }
        let formattedYear = myDate.getFullYear();
        return formattedMonth + "/" + formattedDay + "/" + formattedYear;
    };

    return (
        <div>
            <div>
                <h2>{user.firstName} {user.lastName}</h2>
                <p>User Name: {user.username}</p>
                <p>Email: {user.email}</p>
            </div>
            <h2>Reservations</h2>
            {bookingsList && (
                <div>
                    {Object.values(bookingsList).filter(booking => booking.userId === user.id)
                        .map(booking => {
                            const specificSpot = Object.values(spotList).find(spot => spot.id === booking.spotId)
                            // let formattedStartDate = formatDate(booking.startDate);
                            // let formattedEndDate = formatDate(booking.endDate);
                            return (
                                <div>
                                    <NavLink key={booking.id} to={`/spots/${specificSpot.id}`}>

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
            <div className="ownedSpotsList">
                <h2>My Spots</h2>
                {
                    Object.values(spotList)?.filter(spot => spot.ownerId === user.id).map(spot => {
                        return (
                            <div key={spot.id} className="individualSpot">

                                <NavLink to={`/spots/${spot.id}`} className='eachSpotOnLandingPage'>
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
            {showEditSpotForm && (
                <form>
                    <ul>
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}></input>
                        </div>
                        <div>
                            <label>Description:</label>
                            <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)}></input>
                        </div>
                        <div>
                            <label>Address:</label>
                            <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)}></input>
                        </div>
                        <div>
                            <label>City:</label>
                            <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)}></input>
                        </div>
                        <div>
                            <label>State:</label>
                            <input type="text" name="state" value={state} onChange={(e) => setTheState(e.target.value)}></input>
                        </div>
                        <div>
                            <label>Country:</label>
                            <input type="text" name="country" value={country} onChange={(e) => setCountry(e.target.value)}></input>
                        </div>
                        <div>
                            <label>Lng:</label>
                            <input type="number" name="lng" value={lng} onChange={(e) => setLng(Number(e.target.value))}></input>
                        </div>
                        <div>
                            <label>Lat:</label>
                            <input type="number" name="lat" value={lat} onChange={(e) => setLat(Number(e.target.value))}></input>
                        </div>
                        <div>
                            <label>Price:</label>
                            <input type="number" name="price" value={price} onChange={(e) => setPrice(Number(e.target.value))}></input>
                        </div>
                    </ul>
                    <button onClick={(e) => handleSubmit(e)}>Submit</button>
                </form>

            )}
        </div>
    )
};

export default UserProfile;
