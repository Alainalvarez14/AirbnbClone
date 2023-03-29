const { Router } = require('express');
const express = require('express');
const { Model } = require('sequelize');
const { Spot, Image, User, Review, Booking } = require('../../db/models');
const review = require('../../db/models/review');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();


//Get all of the current users bookings
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const allMyBookings = await Booking.findAll({
        where: {
            userId: userId
        },
        include: [
            {
                model: Spot,
                attributes: [
                    'id',
                    'ownerId',
                    'address',
                    'city',
                    'state',
                    'country',
                    'lat',
                    'lng',
                    'state',
                    'name',
                    'price',
                    'previewImage'
                ]
            },
        ]
    });

    return res.json({ Bookings: allMyBookings });

});

//delete a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {

    const myBooking = await Booking.findOne({ where: { id: req.params.bookingId } });
    const userId = req.user.id;

    if (!myBooking) {
        const myError = {
            message: "Booking couldn't be found",
            statusCode: 404,
        };
        return res.status(404).json(myError);
    }

    if (myBooking.startDate <= new Date()) {
        const myError = {
            message: "Bookings that have been started can't be deleted",
            statusCode: 400,
        };
        return res.status(400).json(myError);
    }

    if (userId === myBooking.userId) {

        await myBooking.destroy({
            where: {
                id: req.params.bookingId
            }
        });

        return res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        });

    }
    if (userId !== myBooking.userId) {
        const myError = {
            message: "must be the owner of the spot or owner of the booking in order to delete the booking."
        }
        return res.status(403).json(myError);
    }
});


// Edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body;
    const userId = req.user.id;

    const myBooking = await Booking.findOne({
        where: {
            id: req.params.bookingId
        }
    });

    if (!myBooking) {
        const myError = {
            "message": "Booking couldn't be found",
            "statusCode": 404
        }
        return res.status(404).json(myError);
    }

    const allBookingsForSpot = await Booking.findAll({
        where: {
            spotId: myBooking.spotId
        }
    });

    if (userId !== myBooking.userId) {
        const myError = {
            message: "must be the owner of the booking in order to edit the booking."
        }
        return res.status(403).json(myError);
    }

    if (myBooking.endDate <= new Date()) {
        const myError = {
            message: "Past bookings can't be modified",
            statusCode: 403,
        };
        return res.status(403).json(myError);
    }

    await Booking.findOne({
        where: {
            id: req.params.bookingId
        },
        attributes: [
            'id', 'userId', 'spotId', 'startDate', 'endDate', 'createdAt', 'updatedAt'
        ]
    });

    function isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear()
            && date1.getMonth() === date2.getMonth()
            && date1.getDate() === date2.getDate()
    }

    for (let reservation of allBookingsForSpot) {
        if (isSameDate(new Date(startDate), reservation.startDate) && isSameDate(new Date(endDate), reservation.endDate)) {
            const myError = {
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403
            }
            return res.status(403).json(myError);
        }

        if (new Date(startDate) >= reservation.startDate && new Date(startDate) <= reservation.endDate && reservation.id !== myBooking.id) {

            const myError = {
                "message": "Start date conflicts with an existing booking",
                "statusCode": 403
            }
            return res.status(403).json(myError);
        }

        if (new Date(endDate) <= reservation.endDate && new Date(endDate) >= reservation.startDate && reservation.id !== myBooking.id) {
           

            const myError = {
                "message": "End date conflicts with an existing booking",
                "statusCode": 403
            }
            return res.status(403).json(myError);
        }
    }

    const updatedBooking = await myBooking.update({ startDate, endDate });

    return res.json(updatedBooking);

});



module.exports = router;
