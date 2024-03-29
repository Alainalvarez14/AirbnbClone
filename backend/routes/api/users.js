// backend/routes/api/users.js
const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// router.post(
//     '/',
//     async (req, res) => {
//         const { email, password, username } = req.body;
//         const user = await User.signup({ email, username, password });

//         await setTokenCookie(res, user);

//         return res.json({
//             user
//         });
//     }
// );


const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];


// Sign up
router.post('/', validateSignup, async (req, res, next) => {
    const { email, firstName, lastName, password, username } = req.body;

    try {
        const user = await User.signup({ email, firstName, lastName, username, password });

        await setTokenCookie(res, user);

        return res.json({
            user,
        });
    } catch (e) {
        e.status = 403;
        next(e);
    }
}
);

// // Sign up
// router.post(
//     "/",
//     singleMulterUpload("image"),
//     validateSignup,
//     asyncHandler(async (req, res) => {
//         const { email, firstName, lastName, password, username } = req.body;
//         const profileImageUrl = await singlePublicFileUpload(req.file);
//         const user = await User.signup({
//             username,
//             email,
//             firstName,
//             lastName,
//             password,
//             profileImageUrl,
//         });

//         setTokenCookie(res, user);

//         return res.json({
//             user,
//         });
//     })
// );



module.exports = router;
