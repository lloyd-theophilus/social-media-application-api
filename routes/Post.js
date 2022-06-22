const router = require('express').Router()
const Post = require('../models/post')


// Create a post
router.post('/', async (req, res) => {
    try {
        const post = await Post.create(req.body)
        res.status(201).json(post)
    } catch (err) {
        res.json({ message: err })
    }
})
 
// Compare the userId with the post's userId if they match then they can update the post else they can't
router.put('/:id', async (req, res) => { 
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await Post.findByIdAndUpdate(req.params.id, req.body)
            res.status(200).json({ message: 'Post updated successfully' })
        } else {
            res.status(401).json({ message: 'You can not update the post, contact the owner to give you access.' })
        }
    } catch (err) {
        res.json({
            message: err
        }
        )   
    }
})

// Compare the userId with the post's userId if they match then they can delete the post else they can't
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await Post.findByIdAndDelete(req.params.id)
            res.status(200).json({ message: 'The post has been deleted successfully' })
        } else { 
            res.status(401).json({ message: 'You can not delete this post.' })
        }
    } catch (error) {
        res.json({ message: err })
        
    }
})

// Like and unlike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            return res.status(200).json({ message: 'You liked this post' })
        } else { 
            await post.updateOne({ $pull: { likes: req.body.userId } })
            return res.status(200).json({ message: 'You unliked this post' })
        }
    } catch (err) {
        res.json({ message: err })
    }
})

// Comment and delete a comment on a post
router.put("/:id/comment", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.comments.includes(req.body.userId)) {
            await post.updateOne({ $push: { comments: req.body.userId } })
            return res.status(200).json({ message: 'You commented on this post' })
        } else { 
            await post.updateOne({ $pull: { comments: req.body.userId } })
            return res.status(200).json({ message: 'You deleted your comment' })
        }
    } catch (err) {
        res.json({ message: err })
    }
})
 

// Get a post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.json({ message: "Post not found" })
    }
})
 

 
// Get timeline posts
router.get('/timeline', async (req, res) => { 
    try { 
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await Post.find({ userId: currentUser._id })
        const userFriends = await Promise.all(
            currentUser.following.map((friendId) => { 
             return   Post.find({ userId: friendId })
            }))
        res.json(userPosts.concat(...userFriends))
        
    } catch (err) {
        res.json({ message: "There are no current posts, check again later" })
    }
})


module.exports = router