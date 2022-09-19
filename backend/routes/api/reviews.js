const { Router } = require('express');
const express = require('express');
const { Model } = require('sequelize');
const { Spot, Image, User, Review } = require('../../db/models');
const review = require('../../db/models/review');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();


// Add an image to a review based on Reviews Id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const myReview = await Review.findOne({
        where: {
            id: req.params.reviewId
        }
    });

    if (!myReview) {
        const myError = {
            message: "Review couldn't be found",
            statusCode: 404,
        };
        return res.status(404).json(myError);
    }

    const allImagesForSpecificReview = await Image.findAll({
        where: {
            reviewImageId: req.params.reviewId
        }
    });
    console.log(allImagesForSpecificReview);
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
        spotId: myReview.spotId,
        reviewId: req.params.reviewId,
        url: url
    });
    const { id } = myImage;
    res.json({ id, url });

});


// Edit a review
router.put('/:reviewId', requireAuth, async (req, res) => {
    const { review, stars } = req.body;

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

    if (!review.length || stars < 1 || stars > 5) {
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

    const updatedReview = await myReview.update({ review, stars });

    res.json(updatedReview);

});









module.exports = router;
