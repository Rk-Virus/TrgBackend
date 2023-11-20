const User = require('../models/User')
const Carousel = require('../models/Carousel')
const sendMail = require('../utils/mail')
const { sendToken } = require('../utils/tokenUtils')
const Announcement = require('../models/Announcement')
const StudyMaterial = require('../models/StudyMaterial')
const Bookmark = require('../models/Bookmark')
const StudentDoubt = require('../models/StudentDoubt')
const QuestionOfTheDay = require('../models/QuestionOfTheDay')

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
        if (bookmarkId) {
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

//------------------check if bookmarked ------------------------------
const checkIfBookmarked = async (req, res) => {
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
        if (bookmarkId) {
            return res.status(200).json(true);
        }
        res.status(201).json(false);
    } catch (error) {
        console.error('Error checking if bookmarked:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//-------------- submit doubt --------------------------
const submitDoubt = async (req, res) => {
    try {
        // Extract relevant data from the request body
        const { topic, question, userId } = req.body;

        // Check if the user already exists 
        let user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(200).json({ err: "User doesn't exist!" })
        }

        // Create a new student doubt using the StudentDoubt model
        const newDoubt = await StudentDoubt.create({
            topic,
            question,
            student: {
                name: user.name,
                email: user.email,
            }
        });

        res.status(201).json(newDoubt);
    } catch (error) {
        console.error('Error submitting student doubt:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// POST endpoint to create a Question of the Day
const createQod = async (req, res) => {
    try {
        // Extract relevant data from the request body
        const { question, answer, options, category, date } = req.body;

        // Create a new Question of the Day using the QuestionOfTheDay model
        const newQOD = await QuestionOfTheDay.create({
            question,
            answer,
            options,
            category,
            date,
        });

        res.status(201).json(newQOD);
    } catch (error) {
        console.error('Error creating Question of the Day:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// getting today's qod
const fetchQod = async (req, res) => {
    try {
        // Get today's date and format it to yyyy-mm-dd
        const today = new Date();
        const formattedToday = formatDate(today);
        // Fetch the Question of the Day for today's date from the database
        const qodForToday = await QuestionOfTheDay.findOne({ date: formattedToday });

        if (!qodForToday) {
            return res.status(404).json({ message: 'Question of the Day not found for today\'s date' });
        }

        res.status(200).json(qodForToday);

    } catch (error) {
        console.error('Error getting Question of the Day:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Helper function to format date to dd/mm/yyyy
const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

module.exports = {
    registerUser, loginUser,
    fetchCarousel, uploadCarousel,
    updatePassword, updateProfile, verifyCode,
    createAnnouncement, fetchAnnouncements,
    createMaterial, fetchMaterials,
    addBookmark, fetchBookmarks, checkIfBookmarked,
    submitDoubt,
    createQod, fetchQod
}