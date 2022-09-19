const express = require('express');
const { Model } = require('sequelize');
const { Spot, Image, User, Review, Booking } = require('../../db/models');
const spot = require('../../db/models/spot');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// get all spots
router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll();

    return res.json({ Spots: allSpots });
});

// create a spot
router.post('/', async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

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
});

// add an image to a spot based on spot id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const mySpot = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });

    if (!mySpot) {
        // res.status(404);

        const myError = {
            message: "Spot couldn't be found",
            statusCode: 404,
        };

        // const { message, statusCode } = myError;
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

    const image = await Image.create({ url: req.body.url, preview: req.body.previewImage });
    const { id, url, preview } = image;
    return res.status(201).json({ id, url, preview });
});


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

    return res.json(mySpot);
});


//delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {

    const spot = await Spot.findOne({ where: { id: req.params.spotId } });
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
router.put('/:spotId', requireAuth, async (req, res) => {

    const spot = await Spot.findOne({ where: { id: req.params.spotId } });
    const userId = req.user.id;

    if (!spot) {
        const myError = {
            message: "Spot couldn't be found",
            statusCode: 404,
        };
        return res.status(404).json(myError);
    }

    if (userId === spot.ownerId) {
        const mySpot = await Spot.findOne({
            where: {
                id: req.params.spotId
            },
            attributes: [
                'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price'
            ]
        });
        return res.json(mySpot);
    }

    if (userId !== spot.ownerId) {
        const myError = {
            message: "must be the owner of the spot in order to delete the spot."
        }
        return res.status(403).json(myError);
    }
});

//get all spots owned by the current user
router.get('/current/:userId', requireAuth, async (req, res) => {
    const myUser = req.params.userId;

    const allSpots = await Spot.findAll({
        where: {
            ownerId: req.params.userId
        }
    });

    res.json({ Spots: allSpots });
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
        res.status(404).json(myError);
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

    res.json({ Reviews: reviews });
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

    if (!review.length && stars < 1 || stars > 5) {
        const myError = {
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "review": "Review text is required",
                "stars": "Stars must be an integer from 1 to 5",
            }
        }
        res.status(400).json(myError);
    }

    if (!review.length) {
        const myError = {
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "review": "Review text is required",
            }
        }
        res.status(400).json(myError);
    }

    if (stars < 1 || stars > 5) {
        const myError = {
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "stars": "Stars must be an integer from 1 to 5",
            }
        }
        res.status(400).json(myError);
    }

    if (!mySpotId) {
        const myError = {
            "message": "Spot couldn't be found",
            "statusCode": 404
        }
        res.status(404).json(myError);
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
        res.status(403).json(myError);
    }

    const spotId = mySpotId.id;

    const myReview = await Review.create({ spotId, userId, review, stars });

    res.json(myReview);
});


// create a booking from a spot based on spot id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {

    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    const allBookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        }
    });

    /////GO BACK AND CHECK ALLL MY OTHER ROUTE HANDLERS
    const spotId = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });

    if (startDate >= endDate) {
        const myError = {
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot be on or before startDate"
            }
        }
        res.status(400).json(myError);
    }

    if (!spotId) {
        const myError = {
            "message": "Spot couldn't be found",
            "statusCode": 404
        }
        res.status(404).json(myError);
    }

    if (spotId.ownerId === req.user.id) {
        return res.status(403).json({
            "message": "An owner cannot book his/her own spot!",
            "statusCode": 403
        });
    }

    const myBooking = await Booking.build({ spotId, userId, startDate, endDate });

    await myBooking.save();

    res.json(myBooking);
});


//get all bookings for a spot based on spot id (IF YOU ARE NOT THE OWNER)
router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    // const spotId = req.params.spotId;
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
        res.status(404).json(myError);
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
        res.json({ Bookings: spotBookings });
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
    res.json({ Bookings: spotBookings });

});


//delete an image for a spot
router.delete('/:spotId/images/:imageId', requireAuth, async (req, res) => {
    // const spotId = req.params.spotId
    const spotId = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });

    const myImage = await Image.findOne({
        where: {
            id: req.params.imageId,
            spotId: req.params.spotId
        }
    });

    if (!myImage) {
        const myError = {
            "message": "Image couldn't be found",
            "statusCode": 404
        }
        res.status(404).json(myError);
    }

    if (!spotId) {
        const myError = {
            "message": "Spot couldn't be found",
            "statusCode": 404
        }
        res.status(404).json(myError);
    }

    if (req.user.id !== spotId.ownerId) {
        const myError = {
            "message": "Must be owner in order to delete spot",
            "statusCode": 403
        }
        res.status(403).json(myError);
    }

    await Image.destroy({
        where: {
            id: req.params.imageId
        }
    });

    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    });

});


module.exports = router;
