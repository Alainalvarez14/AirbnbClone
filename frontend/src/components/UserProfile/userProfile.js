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
    const [image, setImage] = useState('');

    const openEditBookingForm = (booking) => {
        if (showEditBookingForm || showEditSpotForm) return;
        // console.log('inside function' + booking.startDate);
        // console.log(booking.startDate.split('T')[0]);
        setUserId(booking.userId);
        setSpotId(booking.spotId);
        setStartDate(booking.startDate.split('T')[0]);
        setEndDate(booking.endDate.split('T')[0]);
        // setStartDate(booking.startDate);
        // setEndDate(booking.endDate);
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
            let spotObj = { id, previewImage: image, address, city, state, country, lat: Number(lat), lng: Number(lng), name, description, price: Number(price) };
            dispatch(editSpot(spotObj));
            // let imageObj = { userId: user.id, spotImageId: id, reviewImageId: null, url: imageUrl, preview: true };
            // dispatch(createImageThunk(imageObj))

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

    const updateFile = (e) => {
        const file = e.target.files[0];
        if (file) setImage(file);
    };

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
                                <i className="far fa-window-close windowCloseButton"></i>
                            </div>
                            <div className="editYourSpotMessage">Edit your spot</div>
                            <div className="editSpotInputBoxFields">
                                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)}></input>
                            </div>
                            {/* <div className="editSpotInputBoxFields">
                                <input type="text" name="image" value={imageUrl} placeholder='Image URL' onChange={(e) => setImageUrl(e.target.value)} required></input>
                            </div> */}
                            <div className="editSpotInputBoxFields">
                                <input type="file" onChange={updateFile} required></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)}></input>
                            </div>
                            <div className="editSpotInputBoxFields">
                                <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)}></input>
                            </div>
                            <select name="state" size="1" value={state} onChange={(e) => setTheState(e.target.value)} className="inputBoxFieldsOption">
                                <option value="">State</option>
                                <option value="AK">AK</option>
                                <option value="AL">AL</option>
                                <option value="AR">AR</option>
                                <option value="AZ">AZ</option>
                                <option value="CA">CA</option>
                                <option value="CO">CO</option>
                                <option value="CT">CT</option>
                                <option value="DC">DC</option>
                                <option value="DE">DE</option>
                                <option value="FL">FL</option>
                                <option value="GA">GA</option>
                                <option value="HI">HI</option>
                                <option value="IA">IA</option>
                                <option value="ID">ID</option>
                                <option value="IL">IL</option>
                                <option value="IN">IN</option>
                                <option value="KS">KS</option>
                                <option value="KY">KY</option>
                                <option value="LA">LA</option>
                                <option value="MA">MA</option>
                                <option value="MD">MD</option>
                                <option value="ME">ME</option>
                                <option value="MI">MI</option>
                                <option value="MN">MN</option>
                                <option value="MO">MO</option>
                                <option value="MS">MS</option>
                                <option value="MT">MT</option>
                                <option value="NC">NC</option>
                                <option value="ND">ND</option>
                                <option value="NE">NE</option>
                                <option value="NH">NH</option>
                                <option value="NJ">NJ</option>
                                <option value="NM">NM</option>
                                <option value="NV">NV</option>
                                <option value="NY">NY</option>
                                <option value="OH">OH</option>
                                <option value="OK">OK</option>
                                <option value="OR">OR</option>
                                <option value="PA">PA</option>
                                <option value="RI">RI</option>
                                <option value="SC">SC</option>
                                <option value="SD">SD</option>
                                <option value="TN">TN</option>
                                <option value="TX">TX</option>
                                <option value="UT">UT</option>
                                <option value="VA">VA</option>
                                <option value="VT">VT</option>
                                <option value="WA">WA</option>
                                <option value="WI">WI</option>
                                <option value="WV">WV</option>
                                <option value="WY">WY</option>
                            </select>
                            <div className="editSpotInputBoxFields">
                                <input type="text" name="country" value={country} onChange={(e) => setCountry(e.target.value)}></input>
                            </div>
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
                        <button onClick={(e) => handleSubmit(e)} className='editSpotFormSubmitButton nomadColor'>Submit</button>
                    </form>
                </div>
            )}
            {showEditBookingForm && (
                <div className="editBookingFormWrapper">
                    <div className="windowCloseIconButtonEditBookingForm" onClick={(e) => handleCloseFormEditBooking(e)}>
                        <i className="far fa-window-close windowCloseButton"></i>
                    </div>
                    <div className="editYourReservationMessage">Edit your reservation</div>
                    <form className="editBookingForm">
                        <ul className="editBookingFormInputFieldsWrapper">
                            <div className="editBookingFormInputFields">
                                <label>Check-in:</label>
                                <input type="date" name="startDate" value={startDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setStartDate(e.target.value)}></input>
                            </div>
                            <div className="editBookingFormInputFields">
                                <label>Check-out:</label>
                                <input type="date" name="endDate" value={endDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setEndDate(e.target.value)}></input>
                            </div>
                            {endDate <= startDate && (
                                <div style={{ fontSize: 'smaller', textAlign: 'center', color: 'red' }}>Please select check out date</div>
                            )}
                            <button onClick={(e) => handleSubmitBooking(e)} className='editBookingFormSubmitButton nomadColor' disabled={endDate <= startDate}>Book Now!</button>
                        </ul>
                    </form>
                </div>
            )}
            <div>
                <h2 style={{ paddingTop: '2vh' }}>{user.firstName} {user.lastName}</h2>
                <p>User Name: {user.username}</p>
                <p>Email: {user.email}</p>
            </div>
            <h2>Reservations</h2>
            {bookingsList && (
                <div className="individualSpotsWrapper">
                    {Object.values(bookingsList).filter(booking => booking.userId === user.id).map(booking => {
                        const specificSpot = Object.values(spotList).find(spot => spot.id === booking.spotId)
                        return (
                            <div class="card spot" style={{ width: "18rem", marginRight: '1vw' }}>
                                <NavLink key={booking.id} to={`/spots/${specificSpot.id}`} className='eachSpotOnUserProfilePage'>
                                    <img src={specificSpot.previewImage ? specificSpot.previewImage : mockHome} class="card-img-top" alt="..." />
                                    <div class="card-body" style={{ color: 'black', fontWeight: 'lighter' }}>
                                        <div class="card-text">{specificSpot.name}</div>
                                        <div class="card-text">{specificSpot.city}, {specificSpot.state}</div>
                                        <div class="card-text">Check-in: {formatDate(booking.startDate)}</div>
                                        <div class="card-text">Check-out: {formatDate(booking.endDate)}</div>
                                    </div>
                                </NavLink>
                                <button style={{ marginBottom: '0.5vh' }} className="btn nomadColor userProfileButtons buttons" onClick={() => dispatch(deleteBookingThunk(booking))}>Delete Booking</button>
                                <button className="btn nomadColor userProfileButtons buttons" onClick={() => openEditBookingForm(booking)}>Edit Booking</button>
                            </div>
                        );
                    })}
                </div>
            )}

            <h2 style={{ paddingTop: '3vh' }}>My Spots</h2>

            <div className="individualSpotsWrapper" style={{ marginBottom: '6vh' }}>
                {
                    Object.values(spotList)?.filter(spot => spot.ownerId === user.id).map(spot => {
                        return (
                            <div class="card spot" style={{ width: "18rem", marginRight: '1vw' }}>
                                <NavLink to={`/spots/${spot.id}`} className='eachSpotOnUserProfilePage'>
                                    <img style={{ height: '20vh' }} src={spot.previewImage ? spot.previewImage : mockHome} class="card-img-top" alt="..." />
                                    <div class="card-body" style={{ color: 'black', fontWeight: 'lighter' }}>
                                        <div class="card-text">{spot.name}</div>
                                        <div class="card-text">{spot.city}, {spot.state}</div>
                                        <div>${spot.price} </div>
                                    </div>
                                </NavLink>
                                <button style={{ marginBottom: '0.5vh' }} className="btn nomadColor userProfileButtons buttons" onClick={() => dispatch(deleteSpot(spot))}>Delete</button>
                                <button className="btn nomadColor userProfileButtons buttons" onClick={() => openEditSpotForm(spot)}>Edit</button>
                            </div>
                        )
                    })
                }
            </div>

        </div >
    )
};

export default UserProfile;
