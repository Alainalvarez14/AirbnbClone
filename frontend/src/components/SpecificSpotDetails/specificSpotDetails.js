import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import './SpecificSpotDetails.css';

const SpecificSpotDetails = () => {

    const { spotId } = useParams();
    const allSpots = useSelector(state => state.spots);
    const selectedSpot = Object.values(allSpots).find(spot => spot.id === parseInt(spotId))
    // const spotList = useSelector(state => state.spots);
    // const oneSpot = Object.values(spotList).spotId;

    // useEffect(() => {
    //     dispatch(getSpotById(spotId));
    // }, [dispatch, spotId]);
    // useEffect(() => {
    //     dispatch(getAllSpots())
    // }, []);
    // console.log(Object.keys(selectedSpot));
    return (
        <>
            <h1 className="spotName">{selectedSpot.name}</h1>
            <p className="spotAddress">{selectedSpot.city}, {selectedSpot.state}, {selectedSpot.country}</p>
            <p className="spotPrice">price: ${selectedSpot.price} night</p>
        </>
    );
}

export default SpecificSpotDetails;
