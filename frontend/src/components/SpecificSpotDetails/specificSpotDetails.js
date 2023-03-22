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
    const [review, setReview] = useState('');
    const [stars, setStars] = useState('');
    let disabled = false;
    const [reviewToEdit, setReviewToEdit] = useState('');
    const [editedReview, setEditedReview] = useState(reviewToEdit.review);
    const [editedStars, setEditedStars] = useState(reviewToEdit.stars);

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
            <div className="confirmedBookingsList">
                <div className="confirmedBookingsTitle">Confirmed Bookings:</div>
                <div className="bookingNameAndDatesWrapper">
                    {Object.values(allBookings).map(
                        booking =>
                            <div className="bookingNameAndDates">
                                <p>User: {booking.User?.firstName} {booking.User?.lastName}</p>
                                <p>Check-in: {formatDate(booking.startDate)}</p>
                                <p>Check-out: {formatDate(booking.endDate)}</p>
                            </div>
                    )}
                </div>
            </div> :
            <div className="confirmedBookingsList" style={{ overflowY: 'unset', left: '60%' }}>
                <div className="confirmedBookingsTitle" style={{ marginTop: '-11vh' }}>Confirmed Bookings:</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>no bookings for this property</div>
            </div>
    }

    const handleReviewToEdit = (review) => {
        setReviewToEdit(review)
        setEditedStars(review.stars)
        setEditedReview(review.review)
    }

    const hasReviews = () => {
        return Object.values(allReviews).length
            ? <div>{Object.values(allReviews).map(review => {
                return <div>
                    {/* <div style={{ fontWeight: 'bold' }}>{review.User.firstName}</div> */}
                    <div>{review.review}</div>
                    <div>Stars: {review.stars}</div>
                    <button type="button" class="btn btn nomadColor" style={{ marginRight: '1vw' }} onClick={(e) => dispatch(deleteReviewThunk(review))}>Delete Review</button>
                    <button type="button" class="btn btn nomadColor" data-bs-toggle="modal" data-bs-target="#EditReviewModal" onClick={() => handleReviewToEdit(review)}>Edit Review</button>
                </div>
            })}</div>
            : <div>Be the first to leave a review!!</div>
    }

    const handleSubmitReviewForm = (e) => {
        e.preventDefault();
        const reviewObj = { userId, spotId: parseInt(spotId), review, stars: Number(stars) };
        console.log(reviewObj);
        dispatch(createReviewThunk(reviewObj));
    }

    const submitEditReview = (e) => {
        e.preventDefault();
        let editedReviewObj = { id: reviewToEdit.id, userId, spotId: parseInt(spotId), review: editedReview, stars: Number(editedStars) };
        dispatch(editReviewThunk(editedReviewObj));
    }



    return (
        <div style={{ background: 'lightseagreen', paddingBottom: '20px', paddingTop: '30px' }}>
            {selectedSpot && (
                <div class="card" style={{ maxWidth: '90vw', display: 'flex', marginLeft: 'auto', marginRight: 'auto', marginBottom: '7vh', paddingBottom: '5vh' }}>
                    <img src={mockHome} class="card-img-top" alt="..." />
                    <div class="card-body">
                        <h3 class="card-text">{selectedSpot.name}</h3>
                        <div>
                            <p className="spotAddress">{selectedSpot.city}, {selectedSpot.state}, {selectedSpot.country}</p>
                            <p className="spotPrice">${selectedSpot.price} night</p>
                            {selectedSpot.ownerId === userId ?
                                <div>
                                    <div>{allBookings && hasBookings()}</div>
                                </div> :
                                <div style={{ maxHeight: '23vh', marginBottom: '8vh' }}>
                                    <button type="button" class="btn btn nomadColor" /* onClick={(e) => setLeaveReviewForm(!leaveReviewForm)} */ data-bs-toggle="modal" data-bs-target="#leaveReviewModal">Leave a review</button>
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
                                                <button onClick={(e) => handleClick(e)} className='createBookingFormSubmitButton nomadColor'>Book Now!</button>
                                                <p>You won't be charged yet</p>
                                            </ul>
                                        </form>
                                    </div>
                                </div>}
                        </div>
                        <div class="card" style={{ width: '35vw', maxWidth: '650px', marginTop: '-22vh', height: '172px' }}>
                            <ul class="list-group list-group-flush" style={{ paddingBottom: '0.5vh', overflowY: 'scroll' }}>
                                <li class="list-group-item">{selectedSpot.description}fhsrthsrthtrshtrfhsrthtrshtrfhsrthtrshtrfhsrthtrshtrfhsrthtrshtrfhsrthtrshtrfhsrthtrshtrfhsrthtrshtrfhsrthtrshtrfhsrthtrshtrfhsrthtrshtrfhsrthtrshtrfhsrthtrshtrfhsrthtrshtrfhsrthtrshtrshtrfhsrthtrshtrshtrshrtheeeeeeeeee</li>
                            </ul>
                        </div>

                        {selectedSpot.numReviews >= 1 && (
                            <div style={{ marginTop: '10vh' }}>{hasReviews()}</div>
                        )}

                    </div>
                </div>
            )}

            <div class="modal fade" id="leaveReviewModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Leave a review!</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form onSubmit={(e) => handleSubmitReviewForm(e)}>
                                <div class="form-group" style={{ marginBottom: '0.5vh' }}>
                                    <input class="form-control" placeholder='Review' value={review} onChange={(e) => setReview(e.target.value)}></input>
                                </div>
                                <div class="form-group" style={{ marginBottom: '0.5vh' }}>
                                    <input type="number" min="1" max="5" class="form-control" placeholder='Stars' value={stars} onChange={(e) => setStars(e.target.value)}></input>
                                    <small>Stars must be from 1-5</small>
                                </div>
                                {review && stars && stars > 0 && stars <= 5 && (
                                    disabled = false
                                )}
                                <button type="submit" data-bs-dismiss="modal" class="btn btn nomadColor" disabled={disabled}>Submit review</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="EditReviewModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Edit a review!</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form onSubmit={(e) => submitEditReview(e)}>
                                <div class="form-group" style={{ marginBottom: '0.5vh' }}>
                                    <input class="form-control" placeholder='Review' defaultValue={reviewToEdit.review} onChange={(e) => setEditedReview(e.target.value)}></input>
                                </div>
                                <div class="form-group" style={{ marginBottom: '0.5vh' }}>
                                    <input type="number" min="1" max="5" class="form-control" placeholder='Stars' defaultValue={reviewToEdit.stars} onChange={(e) => setEditedStars(e.target.value)}></input>
                                    <small>Stars must be from 1-5</small>
                                </div>
                                <button type='submit' data-bs-dismiss="modal" class="btn btn nomadColor" disabled={!((editedStars > 0 && editedStars <= 5) && editedReview.length)}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecificSpotDetails;
