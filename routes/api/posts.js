const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {check, validationResult } = require("express-validator");

const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");


// @route    Post api/posts
// @desc     Create a post
// @access   Private
router.post("/",[auth, 
    check('text', 'Text is required').not().isEmpty()
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const user = User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        const post = await newPost.save()
        res.json(post)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            errors: [{
                msg: "Server Error"
            }]
        })
    }
});

// @route    Get api/posts
// @desc     Get Posts
// @access   Private
router.get("/", auth, async (req, res)=>{
    try {
        const posts = await Post.find().sort({date: -1})
        res.json({posts})
    } catch (err) {
        console.error(err.message)
        res.status(500).json({
            errors: [{
                msg: "Server Error"
            }]
        })
    }
})

// @route    Get api/posts/:post_id
// @desc     Get Posts by post_id
// @access   Private
router.get("/:post_id", auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.post_id)
        if(!post){
            return res.status(404).json({
                errors: [{
                    msg: "Post not found"
                }]
            })
        }
        res.json({post})
    } catch (err) {
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({
                errors: [{
                    msg: "Post not found"
                }]
            })
        }
        res.status(500).json({
            errors: [{
                msg: "Server Error"
            }]
        })
    }
})

// @route    DELETE api/posts/:post_id
// @desc     Delete Posts by post_id
// @access   Private
router.delete("/:post_id", auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.post_id)
        if(!post){
            return res.status(404).json({
                errors: [{
                    msg: "Post not found"
                }]
            })
        }
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({
                errors: [{
                    msg: "User not authorized"
                }]
            })
        }
        await post.remove()
        res.json({msg: "Post Removed"})
    } catch (err) {
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({
                errors: [{
                    msg: "Post not found"
                }]
            })
        }
        res.status(500).json({
            errors: [{
                msg: "Server Error"
            }]
        })
    }
})

module.exports = router;