const Post = require("../models/Post")

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and Content are required"
            });
        }

        const post = await Post.create({ title, content, user: req.user._id });
        res.status(201).json({
            success: true,
            message: "Post Created Successfully",
            post
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Unable to add POST",
            error: err.message
        })
    }
};

const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find();
        // sorting, user info
        res.json({
            success: true,
            message: "All Posts",
            total: posts.length,
            posts
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Unable to Fetch Posts",
            error: err.message
        });
    }
};

const getMyPost = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user._id });
        res.status(201).json({
            success: true,
            message: "Your Posts",
            total: posts.length,
            posts
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Unable to Fetch Your Posts",
            error: err.message
        })
    }
};


const getSinglePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if(!post){
            return res.status(401).json({
                success:false,
                message:"Post Not Found"
            });
        }
        res.status(201).json({
            success: true,
            message: "Post Found",
            post
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Unable to Fetch Your Posts",
            error: err.message
        })
    }
};



module.exports = {createPost, getAllPost, getMyPost, getSinglePost};


// get - all post
// get - my post
// put - update post
// delete - own post