const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz', // Reference to the Quiz model
        required: true,
    },
    question: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [String], // Assuming options are represented as an array of strings
        required: true,
        validate: {
            validator: function (value) {
                // Ensure there are exactly 4 options
                return value.length === 4;
            },
            message: 'There must be exactly 4 options',
        },
    },
    answer: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                // Ensure the answer is one of the options
                return this.options.includes(value);
            },
            message: 'Answer must be one of the provided options',
        },
    },
    // Add more fields as needed
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
