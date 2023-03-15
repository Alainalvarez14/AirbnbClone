import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
import * as sessionActions from '../../store/session';
import { createSpot, getAllSpots } from "../../store/spots";
import { useHistory } from "react-router-dom";
import { createImageThunk } from "../../store/images";
import { useSelector } from "react-redux";

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const [showCreateSpotForm, setShowCreateSpotForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [city, setCity] = useState('');
    const [state, setTheState] = useState('');
    const [country, setCountry] = useState('');
    const [lng, setLng] = useState();
    const [lat, setLat] = useState();
    const [price, setPrice] = useState();
    const [errors, setErrors] = useState([]);
    const [showErrors, setShowErrors] = useState(false);
    const spots = useSelector(state => state.spots);

    //errors = [{name : 'error'}, {},{}]

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const openCreateSpotForm = () => {
        if (showCreateSpotForm) return;
        setShowCreateSpotForm(true);
    }

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
    }, [name, description, address, city, state, country, price])

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const history = useHistory();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        // return <Redirect to='/login' /> // ask zaviar...
        history.push("/login");
    };

    const handleSubmitCreateSpot = (e) => {
        e.preventDefault();
        if (errors.length) {
            setShowErrors(true);
        }
        else {
            let spotObj = { address, city, state, country, lat: Number(lat), lng: Number(lng), name, description, price: Number(price) };

            dispatch(createSpot(spotObj))
            // dispatch(getAllSpots())

            // let spotsArr = Object.values(spots)
            // let spotImageId = spotsArr[spotsArr.length - 1].id
            // let imageObj = { userId: user.id, spotImageId, reviewImageId: null, url: imageUrl, preview: true };
            // dispatch(createImageThunk(imageObj))


            setShowCreateSpotForm(false);
            setShowErrors(false);
            setName('');
            setDescription('');
            setImageUrl('')
            setAddress('');
            setCity('');
            setCountry('');
            setTheState('');
            setLng();
            setLat();
            setPrice();
            setErrors([]);
            history.push("/");
        }
    };

    const handleOpenProfile = () => {
        history.push('/user-profile');
    };

    const handleCloseForm = (e) => {
        e.preventDefault();
        setShowCreateSpotForm(false);
        setShowErrors(false);
        setName('');
        setDescription('');
        setAddress('');
        setImageUrl('')
        setCity('');
        setCountry('');
        setTheState('');
        setLng();
        setLat();
        setPrice();
        setErrors([]);
    }

    return (
        <>
            <button onClick={openMenu} id='profileButton'>
                {/* {user.username} */}
                <div className="profileIcon">
                    <i className="fas fa-user-circle" />
                </div>
                <div className="hamburgerMenuIcon">
                    <i className="fas fa-bars" />
                </div>
            </button>
            {showMenu && (
                <ul className="profile-dropdown">
                    <li>
                        <button onClick={openCreateSpotForm} className='hostASpotButton'>Host a Spot</button>
                    </li>
                    <li>
                        <button onClick={logout} className='logOutButton'>Log Out</button>
                    </li>
                    <li>
                        <button onClick={handleOpenProfile} className='profileButton'>Profile</button>
                    </li>
                </ul>
            )}
            {showCreateSpotForm && (
                <div className="createSpotFormWrapper">
                    <form className='createSpotForm'>
                        {showErrors && (
                            <ul className="errors">
                                {errors}
                            </ul>
                        )}
                        <div className="windowCloseIcon" onClick={(e) => handleCloseForm(e)}>
                            <i class="far fa-window-close"></i>
                        </div>
                        <div className="createYourSpotMessage">Create your Spot</div>
                        <ul className="inputBoxFieldsWrapper">
                            <div className="inputBoxFields">
                                {/* <label>Name:</label> */}
                                <input type="text" name="name" value={name} placeholder='Name' onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div className="inputBoxFields">
                                {/* <label>Description:</label> */}
                                <input type="text" name="description" value={description} placeholder='Description' onChange={(e) => setDescription(e.target.value)}></input>
                            </div>
                            <div className="inputBoxFields">
                                {/* <label>Address:</label> */}
                                <input type="text" name="image" value={imageUrl} placeholder='Image URL must be set on Edit' onChange={(e) => setImageUrl(e.target.value)} disabled></input>
                            </div>
                            <div className="inputBoxFields">
                                {/* <label>Address:</label> */}
                                <input type="text" name="address" value={address} placeholder='Address' onChange={(e) => setAddress(e.target.value)}></input>
                            </div>
                            <div className="inputBoxFields">
                                {/* <label>City:</label> */}
                                <input type="text" name="city" value={city} placeholder='City' onChange={(e) => setCity(e.target.value)}></input>
                            </div>
                            <div className="inputBoxFields">
                                {/* <label>State:</label> */}
                                <input type="text" name="state" value={state} placeholder='State' onChange={(e) => setTheState(e.target.value)}></input>
                            </div>
                            <div className="inputBoxFields">
                                {/* <label>Country:</label> */}
                                <input type="text" name="country" value={country} placeholder='Country' onChange={(e) => setCountry(e.target.value)}></input>
                            </div>
                            {/* <div className="inputBoxFields">
                                <input type="text" name="lng" value={lng} placeholder='Longitude' onChange={(e) => setLng(e.target.value)}></input>
                            </div> */}
                            <div className="inputBoxFields">
                                <input type="number" name="lng" value={lng} placeholder='Longitude' onChange={(e) => setLng(e.target.value)}></input>
                            </div>
                            {/* <div className="inputBoxFields">
                                <input type="text" name="lat" value={lat} placeholder='Latitude' onChange={(e) => setLat(e.target.value)}></input>
                            </div> */}
                            <div className="inputBoxFields">
                                <input type="number" name="lat" value={lat} placeholder='Latitude' onChange={(e) => setLat(e.target.value)}></input>
                            </div>
                            {/* <div className="inputBoxFields">
                                <input type="text" name="price" min="0" value={price} placeholder='Price' onChange={(e) => setPrice(e.target.value)}></input>
                            </div> */}
                            <div className="inputBoxFields">
                                <input type="number" name="price" min="0.00" value={price} placeholder='Price' onChange={(e) => setPrice(e.target.value)}></input>
                            </div>
                        </ul>
                        <button onClick={(e) => handleSubmitCreateSpot(e)} className='hostSpotSubmitButton'>Submit</button>
                    </form>
                </div>
            )}
        </>
    );
}

export default ProfileButton;
