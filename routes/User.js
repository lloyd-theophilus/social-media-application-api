const router = require('express').Router();
const User = require('../models/user');
const CryptoJS = require("crypto-js");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

//Update user
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(
              req.body.password,
              process.env.SECURED_KEY
            ).toString();
        }
        try {
            await User.findByIdAndUpdate(req.params.id, req.body, { new: true }
            )
            res.status(202).json('User has been updated successfully')
        } catch (err) {
            res.json({ message: err })
        }
})
    
//Delete user
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(202).json('User has been deleted successfully')
    } catch (err) {
        res.json({ message: err })
    }
})

// Get a user by id and show error meesage if user not found
router.get('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User account does not exist' })
        }
        res.status(200).json(user)
    } catch (err) {
        res.json({ message: err })
    }
 })

//Follow a user
router.put('/:id/follow', verifyTokenAndAuthorization, async (req, res) => { 
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { following: req.params.id } })
                res.status(202).json('User has been followed successfully')
            } else {
                return res.status(400).json({ message: 'You follow this user already' })
            }
        } catch (error) {
            res.status(400).json({ message: error })
        }
    } else {
        return res.status(400).json({ message: 'You cannot follow yourself' })
    }
})

//Unfollow a user
router.put('/:id/unfollow', verifyTokenAndAuthorization, async (req, res) => { 
    try {
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)
        if (user.followers.includes(req.body.userId)) {
            await user.updateOne({ $pull: { followers: req.body.userId } })
            await currentUser.updateOne({ $pull: { following: req.params.id } })
            res.status(202).json('User has been unfollowed successfully')
        } else {
            return res.status(400).json({ message: 'You do not follow this user' })
        }
    } catch (error) {
        res.status(400).json({ message: error })
    }
})
 




module.exports = router; 