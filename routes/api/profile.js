const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");


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

// @route    Post api/profile/
// @desc     Create or Update user profile
// @access   Private
router.post("/", [
        auth, 
        [check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is reduired').not().isEmpty()]
    ], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body

    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills){
        profileFields.skills = skills.split(",").map(skill=>skill.trim())
    }
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{
        let profile = await Profile.findOne({ user: req.user.id});
        if(profile){
            profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true});
            return res.json(profile)
        }

        profile = new Profile(profileFields)
        await profile.save();
        res.json(profile);
    }catch(err){
        console.error(err.message)
        res.status(500).json({
            errors:[{
                msg: "Server Error"
            }]
        })
    }
});

// @route    GET api/profile/
// @desc     Get all Profile
// @access   Public
router.get("/", async (req, res)=>{
    try {
        const profiles= await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message)
        res.status(500).json({
            errors: [{
                msg: "Server Error"
            }]
        });
    }
});

// @route    GET api/profile/user/:user_id
// @desc     Get Profile for given user
// @access   Public
router.get("/user/:user_id", async (req, res)=>{
    try {
        const profile= await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if (!profile){
            return res.status(400).json({ 
                errors: [{
                    msg: "Profile not Found"
                }]
            })
        }
        console.log(req.params.user_id)
        res.json(profile);

    } catch (err) {
        console.error(err.message)
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ 
                errors: [{
                    msg: "Profile not Found"
                }]
            })
        }
        res.status(500).json({
            errors: [{
                msg: "Server Error"
            }]
        });
    }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete("/",auth, async (req, res)=>{
    try {
        await Profile.findOneAndRemove({user: req.user.id})
        await User.findOneAndRemove({_id: req.user.id})
        res.json({msg: 'User deleted'})
    } catch (err) {
        console.error(err.message)
        res.status(500).json({
            errors: [{
                msg: "Server Error"
            }]
        });
    }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put("/experience", [auth,[
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]
], async(req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try{
        const profile = await Profile.findOne({user: req.user.id})
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    }catch(err){
        console.error(err.message)
        res.status(500).json({
            errors: [{
                msg: "Server Error"
            }]
        })
    }
})

module.exports = router;