const express = require('express');
const { Model } = require('sequelize');
const { Spot, Image, User, Review, Booking } = require('../../db/models');
const spot = require('../../db/models/spot');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();


// 20220914212200 //spot mig
// 20220914211318 //booking mig

//delete an image for a spot
router.delete('/:imageId', requireAuth, async (req, res) => {

    const imageId = await Image.findOne({
        where: {
            id: req.params.imageId
        }
    });

    if (!imageId) {
        const myError = {
            "message": "Image couldn't be found",
            "statusCode": 404
        }
        return res.status(404).json(myError);
    }

    if (req.user.id !== imageId.userId) {
        const myError = {
            "message": "Must be owner in order to delete spot",
            "statusCode": 403
        }
        return res.status(403).json(myError);
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
