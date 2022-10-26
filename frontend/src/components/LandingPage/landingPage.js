import { getAllSpots } from "../../store/spots";
import './LandingPage.css';
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';

const LandingPage = () => {

    const dispatch = useDispatch();
    const spotList = useSelector(state => state.spots);

    useEffect(() => {
        dispatch(getAllSpots())
    }, [])

    return (
        < div >
            {
                Object.values(spotList)?.map(spot => {
                    return (
                        <NavLink to={`/spots/${spot.id}`} key={spot.id} className='eachSpotOnLandingPage'>

                            <div>{spot.name} </div>
                            <div>
                                <div>{spot.city},{spot.state} </div>
                                <div>{spot.avgRating} </div>
                            </div>
                            <div>{spot.price} </div>

                        </NavLink>
                    )
                })
            }
        </div >
    );
}

export default LandingPage;
