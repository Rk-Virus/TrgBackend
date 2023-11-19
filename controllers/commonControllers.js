const User = require('../models/User')
const Carousel = require('../models/Carousel')
const sendMail = require('../utils/mail')
const { sendToken } = require('../utils/tokenUtils')
const Announcement = require('../models/Announcement')
const StudyMaterial = require('../models/StudyMaterial')
const Bookmark = require('../models/Bookmark')

// ======= registering user ============
const registerUser = async (req, res) => {
    // destructuring from request body
    const { name, email, phoneNo, gender, password } = req.body
    if (!name || !email || !phoneNo || !password || !gender) {
        return res.status(422).json({ msg: "one or more field required" })
    }
    try {
        const query = { $or: [{ email }, { phoneNo }] }
        // checking if user exist
        const foundUser = await User.findOne(query)

        if (foundUser && foundUser.isVerified) {
            return res.status(409).json({ msg: "User already exist" })
        } else {
            await User.deleteOne(query)
            console.log("Non verified existing user deleted")
        }

        // generating a 4-digit code
        const verifyCode = Math.floor(1000 + Math.random() * 9000);

        // sending verification mail
        await sendMail(email, verifyCode)

        const user = new User({ ...req.body, verifyCode })
        user.save().then(savedUser => {
            if (savedUser) sendToken(savedUser, res)
        }).catch(err => {
            console.log(err)
        })

    } catch (err) {
        console.log(err)
        await User.deleteOne({ email })
        res.status(500).json({ msg: "something went wrong", error: err.message })
    }
}

//=== checking verification code =====
const verifyCode = async (req, res) => {
    try {
        const { email, verifyCode } = req.body
        // checking if user exist
        const foundUser = await User.findOne({ email })

        // matching codes
        if (foundUser.verifyCode != verifyCode) return res.status(401).json({ msg: "Invalid verification code!" })

        //if matched
        foundUser.isVerified = true;
        await foundUser.save()
        return res.status(200).json({ msg: "Email verified successfully!", response: foundUser })

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}


// ============Login User===============
const loginUser = async (req, res) => {
    const { phoneNoOrEmail, password } = req.body;
    if (!phoneNoOrEmail || !password) return res.status(422).json({ msg: "one or more fields required" })
    try {
        const foundUser = await User.findOne({
            $or: [{ email: phoneNoOrEmail }, { phoneNo: phoneNoOrEmail }],
        });
        if (!foundUser) return res.status(401).json({ msg: "Incorrect phoneNo/email or password" })
        if (!foundUser.isVerified) return res.status(401).json({ msg: "Sorry, Email isn't verified yet!" })

        console.log(foundUser)

        const isMatching = await foundUser.comparePassword(password);
        if (!isMatching) return res.status(401).json({ msg: "Either phoneNo/password is wrong" })

        if (foundUser && isMatching) {
            sendToken(foundUser, res)
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

// ---------------- update Password ------------------------
const updatePassword = async (req, res) => {
    try {
        const { phoneNo, password } = req.body
        const foundUser = await User.findOne({ phoneNo })
        if (!foundUser) {
            return res.status(404).json({ msg: "User doesn't exist with provided phone number" })
        }

        foundUser.password = password
        await foundUser.save()
        res.status(200).json({ msg: 'success' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "something went wrong", error: error })
    }

}

// ============= update profile ====================
const updateProfile = async (req, res) => {
    try {
        let update = {
            ...req.body
        }
        const updatedProfile = await User.findOneAndUpdate({ _id: req.body._id }, update, { new: true })
        if (!updatedProfile) return res.status(404).json({ msg: 'user not found' })
        res.status(200).json({ msg: 'success', response: updatedProfile })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

//--------------- upload carousel --------------------------
const uploadCarousel = async (req, res) => {
    try {
        const carouselItem = new Carousel(req.body)
        await carouselItem.save();
        res.status(200).json({ msg: "Carousel item uploaded!" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

//--------------- fetch carousel --------------------------
const fetchCarousel = async (req, res) => {
    try {
        const carouselItems = await Carousel.find();
        res.status(200).json(carouselItems);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

//---------- create announcement ----------
const createAnnouncement = async (req, res) => {
    try {
        const announcement = new Announcement(req.body);
        await announcement.save();
        res.status(200).json({ msg: "Announcement created!" })
    } catch (error) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

//--------------- fetch announcements --------------------------
const fetchAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find();
        res.status(200).json(announcements);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}


//---------------- create material ------------------------
const createMaterial = async (req, res) => {
    try {
        const material = new StudyMaterial(req.body);
        await material.save();
        res.status(200).json({ msg: "Study Material added!" })
    } catch (error) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

//--------------- fetch materials --------------------------
const fetchMaterials = async (req, res) => {
    try {
        const materials = await StudyMaterial.find();
        res.status(200).json(materials);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}


//--------------- add bookmark ------------------------
const addBookmark = async (req, res) => {
    const { userId, materialId } = req.body;
    try {
        // Check if the user and material exist before creating a bookmark
        const userExists = await User.exists({ _id: userId });
        const materialExists = await StudyMaterial.exists({ _id: materialId });

        if (!userExists || !materialExists) {
            return res.status(404).json({ error: 'User or material not found.' });
        }

        const bookmarkObj = {
            user: userId,
            material: materialId,
        }

        const bookmarkId = await Bookmark.exists(bookmarkObj)
        // delete if bookmark exists
        if (bookmarkId){
            await Bookmark.findByIdAndRemove(bookmarkId);
            return res.status(200).json({ message: 'Bookmark removed successfully.' });
        }

        // Create a new bookmark instance
        const newBookmark = new Bookmark(bookmarkObj);

        // Save the bookmark to the database
        const savedBookmark = await newBookmark.save();

        res.status(201).json(savedBookmark);
    } catch (error) {
        console.error('Error saving bookmark:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//-------------- fetch bookmarks for a user -------------
// app.get('/get-bookmarks/:userId',
const fetchBookmarks = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find bookmarks for the given userId and populate the 'material' field
        const bookmarks = await Bookmark.find({ user: userId }).populate('material');

        res.status(200).json(bookmarks);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    registerUser, loginUser,
    fetchCarousel, uploadCarousel,
    updatePassword, updateProfile, verifyCode,
    createAnnouncement, fetchAnnouncements,
    createMaterial, fetchMaterials,
    addBookmark, fetchBookmarks
}