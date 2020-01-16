const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile")
const User = require("../../models/User");
// @route    GET api/profile/me
// @desc     Get Current Users Profile
// @access   Private
router.get("/me", auth , async (req, res)=>{
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({
                errors: [{
                    msg: "There is no profile for this user"
                }]
            })
        }
        res.status(200).json(profile)
    }catch(err){
        console.error(err.message);
        res.status(500).json({
            errors: [
                {
                    msg: "Server Error"
                }
            ]
        })
    }
});

module.exports = router;