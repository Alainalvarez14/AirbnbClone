import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
import * as sessionActions from '../../store/session';
import { createSpot } from "../../store/spots";
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const [showCreateSpotForm, setShowCreateSpotForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setTheState] = useState('');
    const [country, setCountry] = useState('');
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [price, setPrice] = useState(0);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const openCreateSpotForm = () => {
        if (showCreateSpotForm) return;
        setShowCreateSpotForm(true);
    }

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
        let spotObj = { address, city, state, country, lat, lng, name, description, price };
        dispatch(createSpot(spotObj));
        console.log(spotObj);
        setShowCreateSpotForm(false);
        // Object.keys(spotObj).forEach(key => {
        //     spotObj[key] = '';
        // });
        setName('');
        setDescription('');
        setAddress('');
        setCity('');
        setCountry('');
        setTheState('');
        setLng(0);
        setLat(0);
        setPrice(0);
        history.push("/home");
    };

    const handleOpenProfile = () => {
        history.push('/user-profile');
    };

    return (
        <>
            <button onClick={openMenu} id='profileButton'>
                {user.username}
                <div className="profileIcon">
                    {/* <i class="fa-thin fa-user"></i> */}
                </div>
            </button>
            {showMenu && (
                <ul className="profile-dropdown">
                    <li>{user.username}</li>
                    <li>{user.email}</li>
                    <li>
                        <button onClick={openCreateSpotForm}>Host a Spot</button>
                    </li>
                    <li>
                        <button onClick={logout}>Log Out</button>
                    </li>
                    <li>
                        <button onClick={handleOpenProfile}>Profile</button>
                    </li>
                </ul>
            )}
            {showCreateSpotForm && (
                <div className="createSpotFormWrapper">
                    <form className='createSpotForm'>
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
                            <div className="inputBoxFields">
                                {/* <label>Lng:</label> */}
                                <input type="number" name="lng" value={lng} placeholder='Longitude' onChange={(e) => setLng(Number(e.target.value))}></input>
                            </div>
                            <div className="inputBoxFields">
                                {/* <label>Lat:</label> */}
                                <input type="number" name="lat" value={lat} placeholder='Latitude' onChange={(e) => setLat(Number(e.target.value))}></input>
                            </div>
                            <div className="inputBoxFields">
                                {/* <label>Price:</label> */}
                                <input type="number" name="price" value={price} placeholder='Price' onChange={(e) => setPrice(Number(e.target.value))}></input>
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
