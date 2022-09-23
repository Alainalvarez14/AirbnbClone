const express = require('express');
const { Model } = require('sequelize');
const { Spot, Image, User, Review, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { Op } = require('sequelize');


//  - review
//  -image
//get all spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
    const mySpots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
    });

    for (let i = 0; i < mySpots.length; i++) {
        const myReviews = await Review.findAll({
            where: {
                spotId: mySpots[i].id
            }
        });

        let sumOfStars = 0;

        for (let j = 0; j < myReviews.length; j++) {
            sumOfStars += myReviews[j].stars
        }

        sumOfStars = myReviews.length ? (sumOfStars / myReviews.length) : 0;

        mySpots[i]["numReviews"] = myReviews.length;
        mySpots[i]["avgRating"] = Math.round(sumOfStars * 10) / 10;

    }

    return res.json({ Spots: mySpots });
});

// get all spots
router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll();

    for (let i = 0; i < allSpots.length; i++) {
        const allSpotReviews = await Review.findAll({
            where: {
                spotId: allSpots[i].id
            }
        });

        let sumOfStars = 0;

        for (let j = 0; j < allSpotReviews.length; j++) {
            sumOfStars += allSpotReviews[j].stars
        }

        sumOfStars = allSpotReviews.length ? (sumOfStars / allSpotReviews.length) : 0;

        allSpots[i]["numReviews"] = allSpotReviews.length;
        allSpots[i]["avgRating"] = Math.round(sumOfStars * 10) / 10;
    }

    return res.json({ Spots: allSpots });
});

// create a spot
router.post('/', requireAuth, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    try {
        const spot = await Spot.create({
            ownerId: req.user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        return res.status(201).json(spot);
    } catch (e) {
        e.status = 400;
        next(e);
    }
});

// // add an image to a spot based on spot id
// router.post('/:spotId/images', requireAuth, async (req, res) => {
//     const mySpot = await Spot.findOne({
//         where: {
//             id: req.params.spotId
//         }
//     });

//     if (!mySpot) {
//         const myError = {
//             message: "Spot couldn't be found",
//             statusCode: 404,
//         };
//         return res.status(404).json(myError);
//     };

//     const userId = req.user.id;

//     if (userId !== mySpot.ownerId) {
//         const myError = {
//             message: "only owners can add an image to a spot",
//             statusCode: 403,
//         };
//         return res.status(403).json(myError);
//     }

//     const image = await Image.create({ userId, spotId: req.params.spotId, url: req.body.url, preview: req.body.previewImage });

//     if (image.preview) {
//         mySpot.update({
//             previewImage: image.url
//         })
//     }

//     const { id, url, preview } = image;
//     return res.status(201).json({ id, url, preview });

// });


//get details for a spot from an id
router.get('/:spotId', async (req, res) => {

    const mySpot = await Spot.findOne({
        where: {
            id: req.params.spotId,
        },
        include: [{
            model: Image,
            as: 'SpotImages',
            attributes: [
                'id',
                'url',
                'preview'
            ]
        },
        {
            model: User,
            as: 'Owner',
            attributes: [
                "id",
                "firstName",
                "lastName"
            ]
        }]
    });

    if (!mySpot) {
        const myError = {
            message: "Spot couldn't be found",
            statusCode: 404,
        };
        return res.status(404).json(myError);
    }

    const myReviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        }
    });

    let sumOfStars = 0;
    for (let i = 0; i < myReviews.length; i++) {
        sumOfStars += myReviews[i].stars
    }

    sumOfStars = myReviews.length ? (sumOfStars / myReviews.length) : 0;

    mySpot["numReviews"] = myReviews.length;
    mySpot["avgRating"] = Math.round(sumOfStars * 10) / 10;


    return res.json(mySpot);
});


//delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {

    const spot = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });
    const userId = req.user.id;

    if (!spot) {
        const myError = {
            message: "Spot couldn't be found",
            statusCode: 404,
        };
        return res.status(404).json(myError);
    }

    if (userId === spot.ownerId) {

        await spot.destroy({
            where: {
                id: req.params.spotId
            }
        });

        return res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        });

    }

    if (userId !== spot.ownerId) {
        const myError = {
            message: "must be the owner of the spot in order to delete the spot."
        }
        return res.status(403).json(myError);
    }
});


//edit a spot
router.put('/:spotId', requireAuth, async (req, res, next) => {

    const spot = await Spot.findOne({
        where: {
            id: req.params.spotId
        },
        attributes: {
            exclude: ['avgRating', 'previewImage', 'numReviews']
        }
    });
    const userId = req.user.id;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    if (!spot) {
        const myError = {
            message: "Spot couldn't be found",
            statusCode: 404,
        };
        return res.status(404).json(myError);
    }

    if (userId !== spot.ownerId) {
        const myError = {
            message: "must be the owner of the spot in order to edit the spot."
        }
        return res.status(403).json(myError);
    }

    if (userId === spot.ownerId) {

        await spot.update({
            address, city, state, country, lat, lng, name, description, price
        });

        return res.json(spot);
    }

});

// add an image to a spot based on spot id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const mySpot = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });

    if (!mySpot) {
        const myError = {
            message: "Spot couldn't be found",
            statusCode: 404,
        };
        return res.status(404).json(myError);
    };

    const userId = req.user.id;

    if (userId !== mySpot.ownerId) {
        const myError = {
            message: "only owners can add an image to a spot",
            statusCode: 403,
        };
        return res.status(403).json(myError);
    }

    const image = await Image.create({ userId, spotImageId: req.params.spotId, url: req.body.url, preview: req.body.previewImage });

    if (image.preview) {
        await mySpot.update({
            previewImage: image.url
        })
    }

    const { id, url, preview } = image;
    return res.status(201).json({ id, url, preview });

});

//get all reviews by a spot id
router.get('/:spotId/reviews', async (req, res) => {
    const spotId = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });

    if (!spotId) {
        const myError = {
            "message": "Spot couldn't be found",
            "statusCode": 404
        }
        return res.status(404).json(myError);
    }

    const reviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [
            {
                model: User,
                as: 'User',
                attributes: [
                    'id',
                    'firstName',
                    'lastName'
                ]
            },
            {
                model: Image,
                as: 'ReviewImages',
                attributes: [
                    'id',
                    'url'
                ]
            }
        ]
    });

    return res.json({ Reviews: reviews });
});


//create a review for a spot based on spot id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const { review, stars } = req.body;
    const userId = req.user.id;

    const mySpotId = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });

    if (stars < 1 || stars > 5) {
        const myError = {
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "stars": "Stars must be an integer from 1 to 5",
            }
        }
        return res.status(400).json(myError);
    }

    if (!review.length) {
        const myError = {
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "review": "Review text is required",
            }
        }
        return res.status(400).json(myError);
    }

    if (!mySpotId) {
        const myError = {
            "message": "Spot couldn't be found",
            "statusCode": 404
        }
        return res.status(404).json(myError);
    }

    const userAlreadyHasReview = await Review.findOne({
        where: {
            spotId: mySpotId.id,
            userId: req.user.id
        }
    });

    if (userAlreadyHasReview) {
        const myError = {
            "message": "User already has a review for this spot",
            "statusCode": 403
        }
        return res.status(403).json(myError);
    }

    const spotId = mySpotId.id;

    const myReview = await Review.create({ spotId, userId, review, stars });

    return res.json(myReview);
});


// create a booking from a spot based on spot id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {

    let { startDate, endDate } = req.body;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    const userId = req.user.id;

    const allMyReservations = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        }
    });

    const spotId = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });

    if (!spotId) {
        const myError = {
            "message": "Spot couldn't be found",
            "statusCode": 404
        }
        return res.status(404).json(myError);
    }

    if (spotId.ownerId === req.user.id) {
        return res.status(403).json({
            "message": "An owner cannot book his/her own spot!",
            "statusCode": 403
        });
    }

    const myReservation = await Booking.build({ spotId: req.params.spotId, userId, startDate, endDate });

    function isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear()
            && date1.getMonth() === date2.getMonth()
            && date1.getDate() === date2.getDate()
    }

    for (let reservation of allMyReservations) {
        if (isSameDate(myReservation.startDate, reservation.startDate) && isSameDate(myReservation.endDate, reservation.endDate)) {
            const myError = {
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403
            }
            return res.status(403).json(myError);
        }

        if (myReservation.startDate >= reservation.startDate && myReservation.startDate <= reservation.endDate) {
            const myError = {
                "message": "Start date conflicts with an existing booking",
                "statusCode": 403
            }
            return res.status(403).json(myError);
        }

        if (myReservation.endDate <= reservation.endDate && myReservation.endDate >= reservation.startDate) {
            const myError = {
                "message": "End date conflicts with an existing booking",
                "statusCode": 403
            }
            return res.status(403).json(myError);
        }

        if (myReservation.startDate < new Date()) {
            const myError = {
                "message": "Cannot create a booking in the past",
                "statusCode": 403
            }
            return res.status(403).json(myError);
        }
    }

    await myReservation.save();

    return res.json(myReservation);
});


//get all bookings for a spot based on spot id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    const spotId = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });

    if (!spotId) {
        const myError = {
            "message": "Spot couldn't be found",
            "statusCode": 404
        }
        return res.status(404).json(myError);
    }

    if (req.user.id !== spotId.ownerId) {
        const spotBookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            },
            attributes: [
                'spotId',
                'startDate',
                'endDate'
            ]
        });
        return res.json({ Bookings: spotBookings });
    }

    const spotBookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [{
            model: User,
            attributes: [
                'id',
                'firstName',
                'lastName'
            ]
        }]
    });
    return res.json({ Bookings: spotBookings });

});


module.exports = router;
