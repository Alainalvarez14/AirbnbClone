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
    const user = useSelector(state => state.session.user);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    let tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    tomorrow = tomorrow.toISOString().split('T')[0];
    const [endDate, setEndDate] = useState(tomorrow);

    const dispatch = useDispatch();
    const history = useHistory();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState('');
    let disabled = false;
    const [reviewToEdit, setReviewToEdit] = useState('');
    const [editedReview, setEditedReview] = useState(reviewToEdit.review);
    const [editedStars, setEditedStars] = useState(reviewToEdit.stars);
    const [errors, setErrors] = useState([]);
    const [showErrors, setShowErrors] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        const errorsArray = [];
        setErrors([]);

        for (let reservation of Object.values(allBookings)) {
            if (isSameDate(new Date(startDate), new Date(reservation.startDate)) && isSameDate(new Date(endDate), new Date(reservation.endDate))) {
                errorsArray.push("This spot is already booked for the specified dates");
            }

            else if (new Date(startDate) >= new Date(reservation.startDate) && new Date(startDate) <= new Date(reservation.endDate)) {
                errorsArray.push("Start date conflicts with an existing booking");
            }

            else if (new Date(endDate) <= new Date(reservation.endDate) && new Date(endDate) >= new Date(reservation.startDate)) {
                errorsArray.push("End date conflicts with an existing booking");
            }
        }
        setErrors(errorsArray);

        if (errorsArray.length) {
            setShowErrors(true);
            console.log("in here")
            console.log(errors)
        }
        else {
            const bookingObj = { userId: user.id, spotId: parseInt(spotId), startDate, endDate };
            dispatch(createBookingThunk(bookingObj));
            setShowErrors(false);
            history.push("/user-profile");
        }
    };

    useEffect(() => {
        if (user) {
            dispatch(getAllBookingsBySpotIdThunk(spotId));
            dispatch(getAllReviewsThunk(spotId));
        }
        else {
            history.push("/");
        }
    }, [dispatch]);

    useEffect(() => {
        if (endDate <= startDate) setErrors([]);
    }, [endDate, startDate]);

    function isSameDate(date1, date2) {
        console.log(date1);
        console.log(date2);
        return date1.getFullYear() === date2.getFullYear()
            && date1.getMonth() === date2.getMonth()
            && date1.getDate() === date2.getDate()
    }

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
        return selectedSpot.ownerId === user.id && Object.values(allBookings).length ?
            <div className="confirmedBookingsList" style={{ overflowY: 'auto' }}>
                <div className="confirmedBookingsTitle" style={{ marginTop: Object.values(allBookings).length > 2 ? '150px' : '0' }}>Confirmed Bookings:</div>
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
            <div className="confirmedBookingsList" style={{ overflowY: 'unset', paddingTop: '13vh' }}>
                <div className="confirmedBookingsTitle" style={{ marginTop: '-11vh' }}>Confirmed Bookings:</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>no bookings for this property</div>
            </div>
    }

    const handleReviewToEdit = (review) => {
        setReviewToEdit(review)
        setEditedStars(review.stars)
        setEditedReview(review.review)
        setReview(review.review);
        setStars(review.stars);
    }

    const hasReviews = () => {
        return Object.values(allReviews).filter(review => review.spotId === Number(spotId)).length
            ? <div>{Object.values(allReviews).filter(review => review.spotId === Number(spotId)).map(review => {
                return <div style={{ marginBottom: '2vh', borderBottom: '1px solid lightgray' }}>
                    <div>{review.review}</div>
                    <div style={{ marginBottom: '1vh' }}>Stars: {review.stars}</div>
                    {review.userId === user.id
                        ? <div>
                            <button type="button" class="btn nomadColor buttons" style={{ marginRight: '1vw', marginBottom: '1vh' }} onClick={(e) => dispatch(deleteReviewThunk(review))}>Delete Review</button>
                            <button type="button" class="btn nomadColor buttons" data-bs-toggle="modal" data-bs-target="#EditReviewModal" onClick={() => handleReviewToEdit(review)} style={{ marginBottom: '1vh' }}>Edit Review</button>
                        </div>
                        : null
                    }
                </div>
            })}</div>
            : <div>No reviews have been left yet!</div>
    }

    const handleSubmitReviewForm = (e) => {
        e.preventDefault();
        const reviewObj = { userId: user.id, spotId: parseInt(spotId), review, stars: Number(stars) };
        console.log(reviewObj);
        console.log(Object.values(allReviews))
        Object.values(allReviews).map(review => {
            if (review.userId === user.id) {
                alert('Cannot leave more than one review!');
                return;
            }
        });
        dispatch(createReviewThunk(reviewObj));
        setReview('');
        setStars('');
    }

    const submitEditReview = (e) => {
        e.preventDefault();
        let editedReviewObj = { id: reviewToEdit.id, userId: user.id, spotId: parseInt(spotId), review: editedReview, stars: Number(editedStars) };
        dispatch(editReviewThunk(editedReviewObj));
    }

    const getNumberOfDays = (startDate, endDate) => {
        const beginningDate = new Date(startDate);
        const endingDate = new Date(endDate);

        const singleDayInMilliseconds = 86400000;

        // TD between two days
        const timeDifference = endingDate.getTime() - beginningDate.getTime();

        // # of days between two specific dates
        return Math.round(timeDifference / singleDayInMilliseconds);
    }

    return (
        <div style={{ background: 'lightseagreen', paddingBottom: '20px', paddingTop: '30px' }}>
            {selectedSpot && user && (
                <div class="card" style={{ maxWidth: '90vw', display: 'flex', marginLeft: 'auto', marginRight: 'auto', marginBottom: '7vh', paddingBottom: '5vh' }}>
                    <img src={selectedSpot.previewImage ? selectedSpot.previewImage : mockHome} class="card-img-top" alt="..." style={{ maxHeight: '70vh' }} />
                    <div class="card-body">
                        <h3 class="card-text">{selectedSpot.name}</h3>
                        <div>
                            <p className="spotAddress">{selectedSpot.city}, {selectedSpot.state}, {selectedSpot.country}</p>
                            <p className="spotPrice">${selectedSpot.price} night</p>
                            {selectedSpot.ownerId === user.id ?
                                <div>
                                    <div>{allBookings && hasBookings()}</div>
                                </div> :
                                <div style={{ maxHeight: '23vh', marginBottom: '8vh' }}>
                                    <button type="button" class="btn nomadColor buttons" data-bs-toggle="modal" data-bs-target="#leaveReviewModal">Leave a review</button>
                                    <div className="createBookingFormWrapper">
                                        <div className="bookYourStayMessage">Book your stay</div>
                                        <form className="createBookingForm">
                                            {showErrors && (
                                                <div className="errors" style={{ marginBottom: '-0.5vh' }}>
                                                    {errors.map(error => (
                                                        <div style={{ color: 'red', textAlign: 'center', fontSize: 'smaller' }}>{error}</div>
                                                    ))}
                                                </div>
                                            )}
                                            <ul className="createBookingFormInputFieldsWrapper">
                                                <div className='createBookingFormInputFields'>
                                                    <label>Check-in:</label>
                                                    <input type="date" name="startDate" min={new Date().toISOString().split('T')[0]} value={startDate} onChange={(e) => setStartDate(e.target.value)} onKeyDown={(e) => e.preventDefault()}></input>
                                                </div>
                                                <div className='createBookingFormInputFields'>
                                                    <label>Check-out:</label>
                                                    <input type="date" name="endDate" min={tomorrow} value={endDate} onChange={(e) => setEndDate(e.target.value)} onKeyDown={(e) => e.preventDefault()}></input>
                                                </div>
                                                {endDate <= startDate
                                                    ? <div style={{ fontSize: 'smaller', textAlign: 'center', color: 'red' }}>Please select check out date</div>
                                                    : <div style={{ fontSize: 'smaller', textAlign: 'center' }}>
                                                        ${selectedSpot.price} x {' '}
                                                        {startDate && endDate !== new Date() && endDate !== '' && (
                                                            getNumberOfDays(startDate, endDate) <= 1 ? 1 + ' night: ' : getNumberOfDays(startDate, endDate) + ' nights: '
                                                        )}
                                                        ${selectedSpot.price * (getNumberOfDays(startDate, endDate) === 0 ? 1 : getNumberOfDays(startDate, endDate))}<br></br>
                                                        Nomad fee: $49 <br></br>
                                                        <div style={{ fontWeight: 'bold' }}>Total price: ${selectedSpot.price * (getNumberOfDays(startDate, endDate) === 0 ? 1 : getNumberOfDays(startDate, endDate)) + 49}</div>
                                                    </div>
                                                }

                                                <button onClick={(e) => handleClick(e)} className={`createBookingFormSubmitButton nomadColor ${endDate <= startDate ? 'disabled' : ''}`}>Book Now!</button>
                                                {/* <div style={{ paddingTop: '0.7vh', textAlign: 'center' }}>You won't be charged yet!</div> */}
                                            </ul>
                                        </form>
                                    </div>
                                </div>}
                        </div>
                        <div class="card" style={{ width: '35vw', maxWidth: '650px', marginTop: '-22vh', height: '172px' }}>
                            <ul class="list-group list-group-flush" style={{ paddingBottom: '0.5vh', overflowY: 'auto' }}>
                                <li class="list-group-item">{selectedSpot.description}</li>
                            </ul>
                        </div>
                        <div style={{ marginTop: '10vh' }}>{hasReviews()}</div>
                    </div>
                </div>
            )}

            <div class="modal fade" id="leaveReviewModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Leave a review!</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setReview(''); setStars(''); }}></button>
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
                                <button type="submit" data-bs-dismiss="modal" class="btn nomadColor submitReviewButton" disabled={!(review && stars && stars > 0 && stars <= 5)}>Submit review</button>
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
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setReview(''); setStars(''); }}></button>
                        </div>
                        <div class="modal-body">
                            <div style={{ color: 'red', paddingBottom: '1vh' }}>Make a change to the review or the stars to submit!</div>
                            <form onSubmit={(e) => submitEditReview(e)}>
                                <div class="form-group" style={{ marginBottom: '0.5vh' }}>
                                    <input class="form-control" placeholder='Review' defaultValue={reviewToEdit.review} onChange={(e) => setEditedReview(e.target.value)}></input>
                                </div>
                                <div class="form-group" style={{ marginBottom: '0.5vh' }}>
                                    <input type="number" min="1" max="5" class="form-control" placeholder='Stars' defaultValue={reviewToEdit.stars} onChange={(e) => setEditedStars(e.target.value)}></input>
                                    <small>Stars must be from 1-5</small>
                                </div>
                                <button type='submit' data-bs-dismiss="modal" class="btn nomadColor submitEditReviewButton"
                                    disabled={!((editedStars > 0 && editedStars <= 5) && editedReview.length) || editedReview === review && editedStars === stars}
                                >Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecificSpotDetails;
