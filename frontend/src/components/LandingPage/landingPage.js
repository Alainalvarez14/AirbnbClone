import { getAllSpots } from "../../store/spots";
import './LandingPage.css';
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { deleteSpot } from "../../store/spots";
import { editSpot } from "../../store/spots";
import ProfileButton from '../Navigation/ProfileButton';
import { useHistory } from "react-router-dom";
import { createSpot } from "../../store/spots";
import mockHome from '../../Images/mockHome.jpg'
import { editBookingThunk, getAllBookingsThunk } from "../../store/bookings";
import { deleteBookingThunk } from "../../store/bookings";

const LandingPage = () => {

    const dispatch = useDispatch();
    const spotList = useSelector(state => state.spots);
    // const userId = useSelector(state => state.session.user.id);
    const user = useSelector(state => state.session.user);

    // const [showMenu, setShowMenu] = useState(false);
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
    const history = useHistory();

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
        dispatch(getAllSpots());
    }, [dispatch])

    const handleSubmit = (e) => {
        e.preventDefault();
        let spotObj = { id, address, city, state, country, lat, lng, name, description, price };
        dispatch(editSpot(spotObj));
        setShowEditSpotForm(false);
    };

    return (
        <div>
            < div className="spotListWrapper">
                <div className="notOwnedSpotsList">
                    <h2>Not Owned Spots</h2>
                    {
                        Object.values(spotList)?.filter(spot => spot.ownerId !== user.id).map(spot => {
                            return (
                                <div key={spot.id} className='individualSpot'>
                                    <NavLink to={`/spots/${spot.id}`} className='eachSpotOnLandingPage'>
                                        <img className="mock-image" src={mockHome}></img>
                                        <div>{spot.name} </div>
                                        <div>
                                            <div>{spot.city},{spot.state} </div>
                                            <div>{spot.avgRating} </div>
                                        </div>
                                        <div>{spot.price} </div>
                                    </NavLink>
                                </div>
                            )
                        })
                    }
                </div>

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
                                            <div>{spot.city},{spot.state} </div>
                                            <div>{spot.avgRating} </div>
                                        </div>
                                        <div>{spot.price} </div>

                                    </NavLink>

                                    <button onClick={() => dispatch(deleteSpot(spot))}>Delete</button>
                                    <button onClick={() => openEditSpotForm(spot)}>Edit</button>
                                </div>
                            )
                        })
                    }
                </div>
                {/* {showEditSpotForm && (
                <div>IM IN THE FORMMMM</div>
            )
            } */}
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
            </div >

        </div>
    );
}

export default LandingPage;
