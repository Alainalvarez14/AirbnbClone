import { getAllSpots } from "../../store/spots";
import './LandingPage.css';
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { editSpot } from "../../store/spots";
import mockHome from '../../Images/mockHome.jpg'

const LandingPage = () => {

    const dispatch = useDispatch();
    const spotList = useSelector(state => state.spots);
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

    // useEffect(() => {
    //     dispatch(getAllSpots());
    // }, [dispatch])

    const handleSubmit = (e) => {
        e.preventDefault();
        let spotObj = { id, address, city, state, country, lat, lng, name, description, price };
        dispatch(editSpot(spotObj));
        setShowEditSpotForm(false);
    };

    return (
        <div>
            {/* <h2 className="allSpotsTitle">All Spots</h2> */}

            <div>
                {/* <div className="notOwnedSpotsList">
                    {
                        Object.values(spotList)?.map(spot => {
                            return (
                                <div key={spot.id} className='indivSpot'>
                                    <NavLink to={`/spots/${spot.id}`} className='eachSpotOnLandingPage'>
                                        <img className="mock-image" src={spot.previewImage ? spot.previewImage : mockHome}></img>
                                        <div>{spot.name} </div>
                                        <div>
                                            <div>{spot.city},{spot.state} </div>
                                        </div>
                                        <div>${spot.price} night </div>
                                    </NavLink>
                                </div>
                            )
                        })
                    }
                </div> */}
                <div className="notOwnedSpotsList" style={{ marginBottom: '7vh' }}>
                    {
                        Object.values(spotList)?.map(spot => {
                            return (
                                <div class="card spot" style={{ width: "18rem", marginTop: '1vh', marginLeft: '1vh', marginRight: '1vh', marginBottom: '1vh' }}>
                                    <NavLink to={`/spots/${spot.id}`} className='eachSpotOnLandingPage'>
                                        <img src={spot.previewImage ? spot.previewImage : mockHome} class="card-img-top" alt="..." style={{ height: '20vh' }} />
                                        <div class="card-body">
                                            <div class="card-text" style={{ fontWeight: 'bold' }}>{spot.name}</div>
                                            <div style={{ fontWeight: 'lighter' }}>
                                                <div>{spot.city}, {spot.state} </div>
                                            </div>
                                            <div style={{ fontWeight: 'bold' }}>${spot.price} night </div>
                                        </div>
                                    </NavLink>
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
            </div >
        </div>
    );
}

export default LandingPage;
