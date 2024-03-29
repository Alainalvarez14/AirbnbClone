import './LandingPage.css';
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useSelector } from "react-redux";
import { editSpot } from "../../store/spots";
import mockHome from '../../Images/mockHome.jpg'
import banner1 from './banner1.jpg'
import banner5 from './banner5.jpg'
import banner6 from './banner6.jpg'
import { useHistory } from "react-router-dom";

const LandingPage = () => {

    const user = useSelector(state => state.session.user);
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
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        let spotObj = { id, address, city, state, country, lat, lng, name, description, price };
        dispatch(editSpot(spotObj));
        setShowEditSpotForm(false);
    };

    const handleSpotClick = (e, spot) => {
        e.preventDefault();
        if (user) {
            history.push(`/spots/${spot.id}`);
        }
    }

    return (
        <div>
            {/* <div class="card bannerCard">
                <div class="card-body bannerText">
                    Exhilaration awaits. Find your next getaway.
                </div>
            </div> */}

            <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src={banner5} class="d-block w-100" alt="..." />
                        <div class="carousel-caption d-none d-md-block">
                            <h3 style={{ fontFamily: 'fantasy' }}>Exhilaration awaits...Find your next getaway</h3>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img src={banner6} class="d-block w-100" alt="..." />
                        <div class="carousel-caption d-none d-md-block">
                            <h3 style={{ fontFamily: 'fantasy' }}>Book your next adventure</h3>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img src={banner1} class="d-block w-100" alt="..." />
                        <div class="carousel-caption d-none d-md-block">
                            <h3 style={{ fontFamily: 'fantasy' }}>Discover unimaginable places</h3>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>








            <div className="notOwnedSpotsList" style={{ marginBottom: '7vh', marginLeft: '1vw' }}>
                {
                    Object.values(spotList)?.map(spot => {
                        return (
                            <div class="card spot nomadColor" style={{ width: "18rem", marginTop: '1vh', marginLeft: '1vh', marginRight: '1vh', marginBottom: '1vh', cursor: 'pointer' }}>
                                {/* <NavLink to={`/spots/${spot.id}`} className='eachSpotOnLandingPage'> */}
                                <div className='eachSpotOnLandingPage' onClick={(e) => handleSpotClick(e, spot)} data-bs-toggle="modal" data-bs-target={user ? "" : "#alertModal"}>
                                    <img src={spot.previewImage ? spot.previewImage : mockHome} class="card-img-top" alt="..." style={{ height: '20vh' }} />
                                    <div class="card-body" style={{ color: 'white' }}>
                                        <div class="card-text" style={{ fontWeight: 'bold' }}>{spot.name}</div>
                                        <div style={{ fontWeight: 'lighter' }}>
                                            <div>{spot.city}, {spot.state} </div>
                                        </div>
                                        <div style={{ fontWeight: 'bold' }}>${spot.price} night </div>
                                    </div>
                                    {/* </NavLink> */}
                                </div>
                            </div>
                        )
                    }).reverse()
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

            <div class="modal fade" id="alertModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel" style={{ color: 'lightseagreen' }}>Must sign in to view spots!</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <div onClick={() => history.push("/login")} className='loginButton' data-bs-dismiss="modal" style={{ marginTop: '-0.1vh' }}>Log In</div>
                            <div onClick={() => history.push("/signup")} className='signupButton' data-bs-dismiss="modal" style={{ marginTop: '-0.1vh' }}>Sign Up</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
