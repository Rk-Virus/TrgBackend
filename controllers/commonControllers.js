const User = require('../models/User')
const Carousel = require('../models/Carousel')
const sendMail = require('../utils/mail')
const { sendToken } = require('../utils/tokenUtils')
const Announcement = require('../models/Announcement')
const StudyMaterial = require('../models/StudyMaterial')
const StudentDoubt = require('../models/StudentDoubt')
const QOD = require('../models/QOD')
const Quiz = require('../models/Quiz')
const Question = require('../models/Question')
const { formatDate, convertToLowerCase, removeEmptyKeys } = require('../utils/formateString')
const MaterialBookmark = require('../models/MaterialBookmark')
const QuizBookmark = require('../models/QuizBookmark')
const PaidMaterial = require('../models/PaidMaterial')
const PaidQuiz = require('../models/PaidQuiz')
const Video = require('../models/Video')
const Note = require('../models/Note')
const PaidNote = require('../models/PaidNote')
const NoteBookmark = require('../models/NoteBookmark')

//security key
const secret_key = process.env.TRG_SECRET

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
        const { email, verifyCode, password } = req.body
        // checking if user exist
        const foundUser = await User.findOne({ email })

        // matching codes
        if (foundUser.verifyCode != verifyCode) return res.status(401).json({ msg: "Invalid verification code!" })

        //if matched
        foundUser.isVerified = true;

        //more logic for forget pass (if any)
        if (password) {
            foundUser.password = password;
        }

        await foundUser.save()

        return res.status(200).json({ msg: "Success!", response: foundUser })

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

// =========== forgot password ========
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // generating a 4-digit code
        const verifyCode = Math.floor(1000 + Math.random() * 9000);

        // sending verification mail
        await sendMail(email, verifyCode)

        // checking if user exist
        const foundUser = await User.findOne({ email })
        if (!foundUser) return res.status(200).json({ msg: "user not found" })

        // setting new otp
        foundUser.verifyCode = verifyCode;
        await foundUser.save()
        return res.status(200).json({ msg: "OTP Sent!" })


    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "something went wrong", error: error })
    }
}

// ============Login User===============
const login = async (req, res, userType) => {
    const { phoneNoOrEmail, password } = req.body;
    
    if (!phoneNoOrEmail || !password) {
        return res.status(422).json({ msg: "One or more fields required" });
    }

    try {
        const query = userType === 'admin' ? { isAdmin: true } : {};
        const foundUser = await User.findOne({
            ...query,
            $or: [{ email: phoneNoOrEmail }, { phoneNo: phoneNoOrEmail }],
        });

        if (!foundUser) {
            return res.status(401).json({ msg: `Incorrect ${userType} credentials` });
        }

        if (!foundUser.isVerified) {
            return res.status(401).json({ msg: `Sorry, ${userType} email isn't verified yet!` });
        }
        
        const isMatching = await foundUser.comparePassword(password);
        if (!isMatching) {
            return res.status(401).json({ msg: `Either ${userType} email/mobile or password is wrong`});
        }

        if (foundUser && isMatching) {
            sendToken(foundUser, res);
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Something went wrong", error: err });
    }
};

// Regular User Login
const loginUser = async (req, res) => {
    await login(req, res, 'user');
};

// Admin Login
const loginAdmin = async (req, res) => {
    await login(req, res, 'admin');
};


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
        if (req.params.key === secret_key) {
            const carouselItem = new Carousel(req.body)
            await carouselItem.save();
            res.status(200).json({ msg: "Carousel item uploaded!" })
        }
        else res.status(400).json({ msg: "Unauthorised Access!" })
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
        if (req.params.key === secret_key) {
            const announcement = new Announcement(req.body);
            await announcement.save();
            res.status(200).json({ msg: "Announcement created!" })
        }
        else res.status(400).json({ msg: "Unauthorised Access!" })
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
        if (req.params.key === secret_key) {
            const material = new StudyMaterial(convertToLowerCase(req.body));
            await material.save();
            res.status(200).json({ msg: "Study Material added!" })
        }
        else res.status(400).json({ msg: "Unauthorised Access!" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

//--------------- fetch materials --------------------------
const fetchMaterials = async (req, res) => {
    try {
        const userId = req.params.id;
        req.body = removeEmptyKeys(req.body)

        // all materials matching filter
        const materials = await StudyMaterial.find(convertToLowerCase(req.body));
        // console.log("all, ", materials)

        // paid materials of the user
        const paidMaterials = (await PaidMaterial.find({ user: userId }).populate('material')).map((paidMaterialsDoc) => paidMaterialsDoc.material)
        // console.log("paid ", paidMaterials)

        // filtered unpaid materials
        const unpaidMaterials = materials.filter(material => !paidMaterials.some(paidMaterial => paidMaterial.id === material.id));
        // console.log("unpaid...",unpaidMaterials)

        res.status(200).json(unpaidMaterials);
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
        const quizExists = await Quiz.exists({ _id: materialId });

        if (!userExists || !(quizExists || materialExists)) {
            return res.status(404).json({ error: 'User or material not found.' });
        }


        if (materialExists) {
            const bookmarkObj = {
                user: userId,
                material: materialId,
            }
            const materialBookmarkId = await MaterialBookmark.exists(bookmarkObj)
            // delete if bookmark exists
            if (materialBookmarkId) {
                await MaterialBookmark.findByIdAndRemove(materialBookmarkId);
                return res.status(200).json({ message: 'Bookmark removed successfully.' });
            }
            // Create a new bookmark instance
            newBookmark = new MaterialBookmark(bookmarkObj);
        }
        if (quizExists) {
            const bookmarkObj = {
                user: userId,
                quiz: materialId,
            }
            const quizBookmarkId = await QuizBookmark.exists(bookmarkObj)
            // delete if bookmark exists
            if (quizBookmarkId) {
                await QuizBookmark.findByIdAndRemove(quizBookmarkId);
                return res.status(200).json({ message: 'Bookmark removed successfully.' });
            }
            // Create a new bookmark instance
            newBookmark = new QuizBookmark(bookmarkObj);
        }

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
        const materialBookmarks = await MaterialBookmark.find({ user: userId }).populate('material');
        const quizBookmarks = await QuizBookmark.find({ user: userId }).populate('quiz');
        const noteBookmarks = await NoteBookmark.find({ user: userId }).populate('note');

        res.status(200).json({ materialBookmarks, quizBookmarks, noteBookmarks });
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
        const quizExists = await Quiz.exists({ _id: materialId });
        const noteExists = await Note.exists({ _id: materialId });

        if (!userExists || !(quizExists || materialExists || noteExists)) {
            return res.status(404).json({ error: 'User or material/quiz/notes not found.' });
        }

        if (materialExists) {
            const bookmarkObj = {
                user: userId,
                material: materialId,
            }
            bookmarkId = await MaterialBookmark.exists(bookmarkObj)
        }

        if (quizExists) {
            const bookmarkObj = {
                user: userId,
                quiz: materialId,
            }
            bookmarkId = await QuizBookmark.exists(bookmarkObj)
        }

        if (noteExists) {
            const bookmarkObj = {
                user: userId,
                note: materialId,
            }
            bookmarkId = await NoteBookmark.exists(bookmarkObj)
        }

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
        if (req.params.key === secret_key) {
            // Extract relevant data from the request body
            const { question, answer, options, category, date } = req.body;

            // Create a new Question of the Day using the QOD model
            const newQOD = await QOD.create({
                question,
                answer,
                options,
                category,
                date,
            });

            res.status(201).json(newQOD);
        }
        else res.status(400).json({ msg: "Unauthorised Access!" })

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
        const qodForToday = await QOD.findOne({ date: formattedToday });

        if (!qodForToday) {
            return res.status(404).json({ message: 'Question of the Day not found for today\'s date' });
        }

        res.status(200).json(qodForToday);

    } catch (error) {
        console.error('Error getting Question of the Day:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



//----------------- create quiz -------------------------
const createQuiz = async (req, res) => {
    try {
        if (req.params.key === secret_key) {

            // Extract quiz data and questions data from the request body
            const { quizData, questionsData } = req.body;

            // Create a blank quiz
            const blankQuiz = await Quiz.create(convertToLowerCase(quizData[0])); // ...[0] to take quize data

            // Map questions data to include the quizId
            const questionsToCreate = questionsData.map(questionData => ({
                ...questionData,
                // converting option string into array
                options: questionData.options.split(',').map(option => option.trim()),
                quizId: blankQuiz._id,
            }));

            // Create and save all questions
            const createdQuestions = await Question.insertMany(questionsToCreate);

            // Extract the IDs of the created questions
            const createdQuestionIds = createdQuestions.map(question => question._id);

            // Update the blank quiz with the IDs of the created questions
            await Quiz.findByIdAndUpdate(
                blankQuiz._id,
                { $set: { questions: createdQuestionIds } },
                { new: true }
            );

            res.status(201).json({ message: 'Quiz and questions created successfully' });
        }
        else res.status(400).json({ msg: "Unauthorised Access!" })

    } catch (error) {
        console.error('Error creating quiz and questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//-------------- fetch quizes based on course, class and subject ---------------
const fetchQuizes = async (req, res) => {
    try {

        req.body = removeEmptyKeys(req.body);
        const userId = req.params.id;

        // Fetch quizzes based on the query
        const quizzes = await Quiz.find(convertToLowerCase(req.body));

        // paid quizzes of the user
        const paidQuizzes = (await PaidQuiz.find({ user: userId }).populate('quiz')).map((paidQuizzesDoc) => paidQuizzesDoc.quiz)

        // filtered unpaid quizzes
        const unpaidQuizzes = quizzes.filter(quiz => !paidQuizzes.some(paidQuiz => paidQuiz.id === quiz.id));

        res.status(200).json(unpaidQuizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//-------------- fetch a specific quiz as per id ----------------
const fetchQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;

        // Validate if quizId is a valid MongoDB ObjectId
        if (!isValidObjectId(quizId)) {
            return res.status(400).json({ error: 'Invalid quiz ID' });
        }

        // Fetch quiz by ID to get the question IDs
        const quiz = await Quiz.findById(quizId);

        // Check if the quiz with the given ID exists
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Populate the 'questions' array with the actual question documents
        const populatedQuestions = await Question.find({ _id: { $in: quiz.questions } });

        // Update the quiz object with the populated 'questions' array
        const quizWithPopulatedQuestions = {
            ...quiz.toObject(),
            questions: populatedQuestions,
        };

        res.status(200).json(quizWithPopulatedQuestions);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//------------- fetch paid materials --------------------
const fetchPaidMaterials = async (req, res) => {
    try {

        const userId = req.params.id;

        // paid materials of the user
        const paidMaterials = (await PaidMaterial.find({ user: userId }).populate('material')).map((paidMaterialsDoc) => paidMaterialsDoc.material);

        res.status(200).json(paidMaterials);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//------------- fetch paid quizzes --------------------
const fetchPaidQuizzes = async (req, res) => {
    try {
        const userId = req.params.id;

        // paid quizes of the user
        const paidQuizzes = (await PaidQuiz.find({ user: userId }).populate('quiz')).map((paidQuizzesDoc) => paidQuizzesDoc.quiz);

        res.status(200).json(paidQuizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// POST endpoint to add promotional video
const addVideo = async (req, res) => {
    try {
        if (req.params.key === secret_key) {

        const { videoId } = req.body;

        // Check if title and videoId are provided
        if (!videoId) {
            return res.status(400).json({ error: 'VideoId are required' });
        }

        const video = await Video.create(req.body)

        // Respond with success message
        res.json({ message: 'Video added successfully' });
    }
    else res.status(400).json({ msg: "Unauthorised Access!" })

    } catch (error) {
        console.error('Error creating Question of the Day:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Arrow function for handling GET request to fetch videos
const fetchVideos = async (req, res) => {
    try {
        // Fetch all videos from the database
        const videos = await Video.find();

        // Respond with the fetched videos
        res.json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// notes apis
//---------------- create note ------------------------
const createNote = async (req, res) => {
    try {
        if (req.params.key === secret_key) {
            const note = new Note(convertToLowerCase(req.body));
            await note.save();
            res.status(200).json({ msg: "Notes added!" })
        }
        else res.status(400).json({ msg: "Unauthorised Access!" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

//--------------- fetch notes --------------------------
const fetchNotes = async (req, res) => {
    try {
        const userId = req.params.id;
        req.body = removeEmptyKeys(req.body)

        // all notes matching filter
        const notes = await Note.find(convertToLowerCase(req.body));
        // console.log("all, ", notes)

        // paid notes of the user
        const paidNotes = (await PaidNote.find({ user: userId }).populate('note')).map((paidNotesDoc) => paidNotesDoc.note)
        // console.log("paid ", paidNotes)

        // filtered unpaid notes
        const unpaidNotes = notes.filter(note => !paidNotes.some(paidNote => paidNote.id === note.id));
        // console.log("unpaid...",unpaidNotes)

        res.status(200).json(unpaidNotes);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "something went wrong", error: err })
    }
}

//------------- fetch paid notes --------------------
const fetchPaidNotes = async (req, res) => {
    try {

        const userId = req.params.id;

        // paid notes of the user
        const paidNotes = (await PaidMaterial.find({ user: userId }).populate('material')).map((paidNotesDoc) => paidNotesDoc.material);

        res.status(200).json(paidNotes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//---------- fetch recent notes -------------------------
const fetchRecentNotes = async (req, res)=>{
    try {
        // Query the database to find the most recent notes, sorted by creation date
        const recentNotes = await Note.find().sort({ createdAt: -1 }).limit(2);
    
        // If there are no recent notes, send a 404 status with a message
        if (recentNotes.length === 0) {
          return res.status(404).json({ message: 'No recent notes found' });
        }
    
        // If there are notes, send them in the response
        res.json(recentNotes);
      } catch (error) {
        // If there's an error, send a 500 status with the error message
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}


// Helper function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id) {
    const mongoose = require('mongoose');
    return mongoose.Types.ObjectId.isValid(id);
}


module.exports = {
    registerUser, loginUser, loginAdmin,
    fetchCarousel, uploadCarousel,
    updateProfile, verifyCode,
    createAnnouncement, fetchAnnouncements,
    createMaterial, fetchMaterials,
    addBookmark, fetchBookmarks, checkIfBookmarked,
    submitDoubt,
    createQod, fetchQod,
    createQuiz, fetchQuizes, fetchQuiz,
    fetchPaidMaterials, fetchPaidQuizzes,
    sendOTP,
    addVideo, fetchVideos,
    createNote, fetchNotes, fetchPaidNotes, fetchRecentNotes
}