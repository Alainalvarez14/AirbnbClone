const { Router } = require('express');
const express = require('express');
const { Model } = require('sequelize');
const { Spot, Image, User, Review } = require('../../db/models');
const review = require('../../db/models/review');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();


// Add an image to a review based on Reviews Id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const myReview = await Review.findOne({
        where: {
            id: req.params.reviewId
        }
    });
    const userId = req.user.id;

    if (!myReview) {
        const myError = {
            message: "Review couldn't be found",
            statusCode: 404,
        };
        return res.status(404).json(myError);
    }

    if (myReview.userId !== userId) {
        const myError = {
            message: "must be the owner of the spot in order to edit the spot."
        }
        return res.status(403).json(myError);
    }

    const allImagesForSpecificReview = await Image.findAll({
        where: {
            reviewImageId: req.params.reviewId
        }
    });

    if (allImagesForSpecificReview.length >= 10) {
        const myError = {
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
        };
        return res.status(403).json(myError);
    }

    const { url } = req.body

    const myImage = await Image.create({
        userId: myReview.userId,
        spotImageId: myReview.spotId,
        reviewImageId: myReview.id,
        url: url
    });

    const { id } = myImage;
    return res.json({ id, url });

});


// Edit a review
router.put('/:reviewId', requireAuth, async (req, res, next) => {
    const { review, stars } = req.body;
    const userId = req.user.id;

    const myReview = await Review.findOne({
        where: {
            id: req.params.reviewId
        }
    });

    if (!myReview) {
        const myError = {
            "message": "Review couldn't be found",
            "statusCode": 404
        }
        res.status(404).json(myError);
    }

    if (userId !== myReview.userId) {
        const myError = {
            message: "must be the owner of the review in order to edit the review."
        }
        return res.status(403).json(myError);
    }
    try {
        if (userId === myReview.userId) {
            const updatedReview = await myReview.update({ review, stars });

            return res.status(200).json(updatedReview);
        }
    } catch (e) {
        e.status = 400;
        next(e);
    }
});


//delete a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const myReview = await Review.findOne({
        where: {
            id: req.params.reviewId
        }
    });

    if (!myReview) {
        const myError = {
            "message": "Review couldn't be found",
            "statusCode": 404
        }
        res.status(404).json(myError);
    }

    if (userId !== myReview.userId) {
        return res.status(403).json({
            "message": "Only the owner is allowed to delete this review!",
            "statusCode": 403
        });
    }

    if (userId === myReview.userId) {
        await myReview.destroy({
            where: {
                id: req.params.reviewId
            }
        });

        return res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        });
    }
});


//Get all reviews of the current user
router.get('/current', requireAuth, async (req, res) => {

    const allMyReviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: User,
                attributes: [
                    'id',
                    'firstName',
                    'lastName'
                ]
            },
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
            {
                model: Image,
                as: "ReviewImages",
                attributes: [
                    'id',
                    'url'
                ]
            }

        ]
    });

    return res.json({ Reviews: allMyReviews });

});


module.exports = router;
