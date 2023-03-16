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
import { deleteSpot, getAllSpots } from "../../store/spots";
import { editSpot } from "../../store/spots";
import { createImageThunk } from "../../store/images";

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
    const [lng, setLng] = useState();
    const [lat, setLat] = useState();
    const [price, setPrice] = useState();
    const [imageUrl, setImageUrl] = useState('');
    const [id, setId] = useState(0);
    const [errors, setErrors] = useState([]);
    const [showErrors, setShowErrors] = useState(false);

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
        setImageUrl(spot.previewImage ? spot.previewImage : '')
        setShowEditSpotForm(true);
    }

    useEffect(() => {
        dispatch(getAllBookingsThunk());
    }, [dispatch]);

    useEffect(() => {
        const errorsArray = [];

        if (!name.length || typeof name !== 'string') {
            errorsArray.push("Name field must be alpha characters");
        }

        if (!description) {
            errorsArray.push("Description field must be filled");
        }

        if (!address) {
            errorsArray.push("Must have an address");
        }
        if (!city) {
            errorsArray.push("Must have an city");
        }
        if (!state) {
            errorsArray.push("Must have an state");
        }
        if (!country) {
            errorsArray.push("Must have an country");
        }
        // if (typeof Number(lat) !== 'number' || typeof Number(lat) === NaN) {
        //     errorsArray.push("Latitude must be a number!");
        // }
        // if (typeof Number(lng) !== 'number' || typeof Number(lng) === NaN) {
        //     errorsArray.push("Latitude must be a number!");
        // }
        if (price <= 0) {
            errorsArray.push("Must have a valid price per night!");
        }

        setErrors(errorsArray)
    }, [name, description, address, city, state, country, price]);

    const handleSubmitBooking = (e) => {
        e.preventDefault();
        let bookingObj = { id: bookingId, userId, spotId, startDate, endDate };
        dispatch(editBookingThunk(bookingObj));
        setShowEditBookingForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (errors.length) {
            setShowErrors(true);
        }
        else {
            let spotObj = { id, address, city, state, country, lat: Number(lat), lng: Number(lng), name, description, price: Number(price) };
            dispatch(editSpot(spotObj));
            let imageObj = { userId: user.id, spotImageId: id, reviewImageId: null, url: imageUrl, preview: true };
            dispatch(createImageThunk(imageObj))
            // dispatch(getAllSpots())
            setShowEditSpotForm(false);
            setShowErrors(false);
            setName('');
            setDescription('');
            setAddress('');
            setCity('');
            setCountry('');
            setTheState('');
            setImageUrl('')
            setLng();
            setLat();
            setPrice();
            setErrors([]);
        }
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
        setShowErrors(false);
        setName('');
        setDescription('');
        setAddress('');
        setCity('');
        setCountry('');
        setTheState('');
        setImageUrl('')
        setLng();
        setLat();
        setPrice();
        setErrors([]);
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
        setLng();
        setLat();
        setPrice();
    }

    return (
        <div style={{ marginLeft: '2vw', marginRight: '2vw' }}>
            {showEditSpotForm && (
                <div className="editSpotFormWrapper">
                    <form className="editSpotForm">
                        {showErrors && (
                            <ul className="errors">
                                {errors}
                            </ul>
                        )}
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
                                <input type="text" name="image" value={imageUrl} placeholder='Image URL' onChange={(e) => setImageUrl(e.target.value)} required></input>
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
                            {/* <div className="editSpotInputBoxFields">
                                <input type="text" name="lng" value={lng} placeholder="Longitude" onChange={(e) => setLng(e.target.value)}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                <input type="text" name="lat" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                <input type="text" name="price" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)}></input>
                            </div> */}
                            <div className="editSpotInputBoxFields">
                                <input type="number" name="lng" value={lng} placeholder="Longitude" onChange={(e) => setLng(e.target.value)}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                <input type="number" name="lat" placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                <input type="number" name="price" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)}></input>
                            </div>
                        </ul>
                        <button onClick={(e) => handleSubmit(e)} className='editSpotFormSubmitButton'>Submit</button>
                    </form>
                </div>
            )}
            {showEditBookingForm && (
                <div className="editBookingFormWrapper">
                    <div className="windowCloseIconButtonEditBookingForm" onClick={(e) => handleCloseFormEditBooking(e)}>
                        <i className="far fa-window-close"></i>
                    </div>
                    <div className="editYourReservationMessage">Edit your reservation</div>
                    <form className="editBookingForm">
                        <ul className="editBookingFormInputFieldsWrapper">
                            {/* <div className="windowCloseIconButtonEditBookingForm" onClick={(e) => handleCloseFormEditBooking(e)}>
                                <i className="far fa-window-close"></i>
                            </div> */}
                            <div className="editBookingFormInputFields">
                                <label>Check-in:</label>
                                <input type="date" name="startDate" min={new Date().toISOString().split('T')[0]} onChange={(e) => setStartDate(e.target.value)}></input>
                            </div>
                            <div className="editBookingFormInputFields">
                                <label>Check-out:</label>
                                <input type="date" name="endDate" min={new Date().toISOString().split('T')[0]} onChange={(e) => setEndDate(e.target.value)}></input>
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
                // <div className="individualSpotsWrapper">
                //     {Object.values(bookingsList).filter(booking => booking.userId === user.id).map(booking => {
                //         const specificSpot = Object.values(spotList).find(spot => spot.id === booking.spotId)
                //         return (
                //             <div>
                //                 <NavLink key={booking.id} to={`/spots/${specificSpot.id}`} className='eachSpotOnUserProfilePage'>
                //                     <img className="mock-image" src={specificSpot.previewImage ? specificSpot.previewImage : mockHome}></img>
                //                     <div>{specificSpot.name}</div>
                //                     <div>{specificSpot.city}, {specificSpot.state}</div>
                //                     <div>Check-in: {formatDate(booking.startDate)}</div>
                //                     <div>Check-out: {formatDate(booking.endDate)}</div>
                //                 </NavLink>
                //                 <button className="btn airbnbColor" onClick={() => dispatch(deleteBookingThunk(booking))}>Delete Booking</button>
                //                 <button className="btn airbnbColor" onClick={() => openEditBookingForm(booking)}>Edit Booking</button>
                //             </div>
                //         );
                //     })}
                // </div>
                <div className="individualSpotsWrapper">
                    {Object.values(bookingsList).filter(booking => booking.userId === user.id).map(booking => {
                        const specificSpot = Object.values(spotList).find(spot => spot.id === booking.spotId)
                        return (
                            <div class="card" style={{ width: "18rem", marginRight: '1vw' }}>
                                <NavLink key={booking.id} to={`/spots/${specificSpot.id}`} className='eachSpotOnUserProfilePage'>
                                    <img src={specificSpot.previewImage ? specificSpot.previewImage : mockHome} class="card-img-top" alt="..." />
                                    <div class="card-body">
                                        <div class="card-text">{specificSpot.name}</div>
                                        <div class="card-text">{specificSpot.city}, {specificSpot.state}</div>
                                        <div class="card-text">Check-in: {formatDate(booking.startDate)}</div>
                                        <div class="card-text">Check-out: {formatDate(booking.endDate)}</div>
                                    </div>
                                </NavLink>
                                <button style={{ marginBottom: '0.5vh' }} className="btn airbnbColor" onClick={() => dispatch(deleteBookingThunk(booking))}>Delete Booking</button>
                                <button className="btn airbnbColor" onClick={() => openEditBookingForm(booking)}>Edit Booking</button>
                            </div>
                        );
                    })}
                </div>

            )}

            <h2>My Spots</h2>
            {/* <div className="individualSpotsWrapper">
                {
                    Object.values(spotList)?.filter(spot => spot.ownerId === user.id).map(spot => {
                        return (
                            <div key={spot.id}>
                                <NavLink to={`/spots/${spot.id}`} className='eachSpotOnUserProfilePage'>
                                    <img className="mock-image" src={spot.previewImage ? spot.previewImage : mockHome}></img>
                                    <div>{spot.name} </div>
                                    <div>
                                        <div>{spot.city}, {spot.state} </div>
                                    </div>
                                    <div>${spot.price} </div>
                                </NavLink>

                                <button className="btn airbnbColor" onClick={() => dispatch(deleteSpot(spot))}>Delete</button>
                                <button className="btn airbnbColor" onClick={() => openEditSpotForm(spot)}>Edit</button>
                            </div>
                        )
                    })
                }
            </div> */}

            <div className="individualSpotsWrapper">
                {
                    Object.values(spotList)?.filter(spot => spot.ownerId === user.id).map(spot => {
                        return (
                            // <div key={spot.id}>
                            //     <NavLink to={`/spots/${spot.id}`} className='eachSpotOnUserProfilePage'>
                            //         <img className="mock-image" src={spot.previewImage ? spot.previewImage : mockHome}></img>
                            //         <div>{spot.name} </div>
                            //         <div>
                            //             <div>{spot.city}, {spot.state} </div>
                            //         </div>
                            //         <div>${spot.price} </div>
                            //     </NavLink>

                            //     <button className="btn airbnbColor" onClick={() => dispatch(deleteSpot(spot))}>Delete</button>
                            //     <button className="btn airbnbColor" onClick={() => openEditSpotForm(spot)}>Edit</button>
                            // </div>
                            <div class="card" style={{ width: "18rem", marginRight: '1vw' }}>
                                <NavLink to={`/spots/${spot.id}`} className='eachSpotOnUserProfilePage'>
                                    <img style={{ height: '20vh' }} src={spot.previewImage ? spot.previewImage : mockHome} class="card-img-top" alt="..." />
                                    <div class="card-body">
                                        <div class="card-text">{spot.name}</div>
                                        <div class="card-text">{spot.city}, {spot.state}</div>
                                        <div>${spot.price} </div>
                                    </div>
                                </NavLink>
                                <button style={{ marginBottom: '0.5vh' }} className="btn airbnbColor" onClick={() => dispatch(deleteSpot(spot))}>Delete</button>
                                <button className="btn airbnbColor" onClick={() => openEditSpotForm(spot)}>Edit</button>
                            </div>
                        )
                    })
                }
            </div>

        </div >
    )
};

export default UserProfile;
