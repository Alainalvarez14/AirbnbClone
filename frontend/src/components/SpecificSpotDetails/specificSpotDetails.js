import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import './SpecificSpotDetails.css';
import { useEffect, useState } from "react";
import { createBookingThunk } from "../../store/bookings";
import { useDispatch } from "react-redux";
import { getAllBookingsBySpotIdThunk } from "../../store/bookings";
import mockHome from '../../Images/mockHome.jpg'
import { useHistory } from "react-router-dom";
import { getAllReviewsThunk } from "../../store/reviews";
import { createReviewThunk } from "../../store/reviews";
import { deleteReviewThunk } from "../../store/reviews";
import { editReviewThunk } from "../../store/reviews";

const SpecificSpotDetails = () => {

    const { spotId } = useParams();
    const allSpots = useSelector(state => state.spots);
    const allBookings = useSelector(state => state.bookings);
    const allReviews = useSelector(state => state.reviews);
    const selectedSpot = Object.values(allSpots).find(spot => spot.id === parseInt(spotId));
    const userId = useSelector(state => state.session.user.id);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const dispatch = useDispatch();
    const history = useHistory();
    const [leaveReviewForm, setLeaveReviewForm] = useState(false);
    const [review, setReview] = useState('');
    const [stars, setStars] = useState('');
    const [openEditReviewForm, setOpenEditReviewForm] = useState(false);
    const [reviewId, setReviewId] = useState('');

    const handleClick = (e) => {
        e.preventDefault();
        const bookingObj = { userId, spotId: parseInt(spotId), startDate, endDate };
        dispatch(createBookingThunk(bookingObj));
        history.push("/user-profile");
    };

    useEffect(() => {
        dispatch(getAllBookingsBySpotIdThunk(spotId));
        dispatch(getAllReviewsThunk(spotId));
    }, [dispatch]);

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

    const hasBookings = () => {
        return selectedSpot.ownerId === userId && Object.values(allBookings).length ?
            <div className="bookingNameAndDatesWrapper">
                {Object.values(allBookings).map(
                    booking =>
                        // startDateFormat = formatDate(booking.startDate)
                        // endDateFormat = formatDate(booking.endDate)
                        <div className="bookingNameAndDates">
                            <p>User: {booking.User?.firstName} {booking.User?.lastName}</p>
                            {/* <p>Check-in: {booking.startDate}</p> */}
                            <p>Check-in: {formatDate(booking.startDate)}</p>
                            <p>Check-out: {formatDate(booking.endDate)}</p>
                        </div>
                )}
            </div> :
            <div>no bookings for this property</div>
    }

    const hasReviews = () => {
        return Object.values(allReviews).length
            ? <div>{Object.values(allReviews).map(review => {
                return <div>
                    <div>{review.review}</div>
                    <div>{review.stars}</div>
                    <button onClick={(e) => dispatch(deleteReviewThunk(review))}>Delete Review</button>
                    <button onClick={(e) => handleEditReview(e, review)}>Edit Review</button>
                </div>
            })}</div>
            : <div>Be the first to leave a review!!</div>
    }

    const handleEditReview = (e, review) => {
        e.preventDefault();
        console.log(review);
        setReviewId(review.id);
        setReview(review.review);
        setStars(review.stars);
        setOpenEditReviewForm(true);
    }

    const handleSubmitReviewForm = (e) => {
        e.preventDefault();
        const reviewObj = { userId, spotId: parseInt(spotId), review, stars: Number(stars) };
        console.log(reviewObj);
        dispatch(createReviewThunk(reviewObj));
    }

    const submitEditReview = (e) => {
        e.preventDefault();
        let editedReviewObj = { id: reviewId, userId, spotId: parseInt(spotId), review, stars: Number(stars) };
        dispatch(editReviewThunk(editedReviewObj));
    }

    return (
        <>
            {selectedSpot && (
                <div key={selectedSpot.id}>
                    <img className="mock-image" src={mockHome}></img>
                    <h3 className="spotName">{selectedSpot.name}</h3>
                    <p className="spotAddress">{selectedSpot.city}, {selectedSpot.state}, {selectedSpot.country}</p>
                    <p className="spotPrice">${selectedSpot.price} night</p>
                    {console.log(selectedSpot)}
                    {selectedSpot.ownerId === userId ?
                        <div>
                            <div className="confirmedBookingsTitle">Confirmed Bookings:</div>
                            {allBookings && hasBookings()}
                        </div> :
                        <div>
                            <button onClick={(e) => setLeaveReviewForm(!leaveReviewForm)}>Leave a review</button>
                            <div className="createBookingFormWrapper">
                                <div className="bookYourStayMessage">Book your stay</div>
                                <form className="createBookingForm">
                                    <ul className="createBookingFormInputFieldsWrapper">
                                        <div className='createBookingFormInputFields'>
                                            <label>Check-in:</label>
                                            <input type="date" name="startDate" min={new Date().toISOString().split('T')[0]} onChange={(e) => setStartDate(e.target.value)}></input>
                                        </div>
                                        <div className='createBookingFormInputFields'>
                                            <label>Check-out:</label>
                                            <input type="date" name="endDate" min={new Date().toISOString().split('T')[0]} onChange={(e) => setEndDate(e.target.value)}></input>
                                        </div>
                                        <button onClick={(e) => handleClick(e)} className='createBookingFormSubmitButton'>Book Now!</button>
                                        <p>You won't be charged yet</p>
                                    </ul>
                                </form>
                            </div>
                        </div>}
                    {leaveReviewForm && (
                        <form>
                            <div>
                                <label>Review:</label>
                                <input onChange={(e) => setReview(e.target.value)}></input>
                            </div>
                            <div>
                                <label>Stars:</label>
                                <input onChange={(e) => setStars(e.target.value)}></input>
                            </div>
                            <button onClick={(e) => handleSubmitReviewForm(e)}>Submit</button>
                        </form>
                    )}
                    {selectedSpot.numReviews >= 1 && (
                        <div>{hasReviews()}</div>
                    )}
                    {openEditReviewForm && (
                        <form>
                            <div>
                                <label>Review:</label>
                                <input onChange={(e) => setReview(e.target.value)}></input>
                            </div>
                            <div>
                                <label>Stars:</label>
                                <input onChange={(e) => setStars(e.target.value)}></input>
                            </div>
                            <button onClick={(e) => submitEditReview(e)}>Submit</button>
                            <button onClick={() => setOpenEditReviewForm(false)}>Close Edit Form</button>
                        </form>
                    )}
                </div>
            )}
        </>
    );
}

export default SpecificSpotDetails;
