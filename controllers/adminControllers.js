const CareerForm = require("../models/CareerForm");
const InternshipForm = require("../models/InternshipForm");
const FranchiseForm = require("../models/FranchiseForm");
const createError = require("../utils/tokenUtils")

const createCareerForm = async(req, res, next) => {
    const fileName = req.file.filename;
    try{
        const newCareerInput = new CareerForm({ ...req.body , file: fileName });
        await newCareerInput.save();
        res.status(200).json("Career form submitted successfully!");
    }catch(err){
        next(createError(401, "Something went wrong!"));
    }
}

const updateCareerForm = async(req, res, next) => {
    try{
        await CareerForm.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true});
        res.status(200).json("Career form updated successfully!");
    }catch(err){
        next(createError(401, "You are not authenticated!"));
    }
}

const deleteCareerForm = async(req, res, next) => {
    try{
        await CareerForm.findByIdAndDelete(req.params.id);
        res.status(200).json("Career form deleted successfully!");
    }catch(err){
        next(createError(401, "You are not authenticated!"));
    }
}

const getAllCareerForms = async(req, res, next) => {
    try{
        const careerForms = await CareerForm.find();
        res.status(200).json(careerForms);
    }catch(err){
        next(createError(401, "You are not authenticated!"));
    }
}

const createFranchiseForm = async(req, res, next) => {
    try{
        const newFranchiseInput = new FranchiseForm(req.body);
        await newFranchiseInput.save();
        res.status(200).json("Franchise form submitted successfully!");
    }catch(err){
        next(createError(401, "Something went wrong!"));
    }
}

const updateFranchiseForm = async(req, res, next) => {
    try{
        await FranchiseForm.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true});
        res.status(200).json("Franchise form updated successfully!");
    }catch(err){
        next(createError(401, "You are not authenticated!"));
    }
}

const deleteFranchiseForm = async(req, res, next) => {
    try{
        await FranchiseForm.findByIdAndDelete(req.params.id);
        res.status(200).json("Franchise form deleted successfully!");
    }catch(err){
        next(createError(401, "You are not authenticated!"));
    }
}

const getAllFranchiseForms = async(req, res, next) => {
    try{
        const franchiseForms = await FranchiseForm.find();
        res.status(200).json(franchiseForms);
    }catch(err){
        next(createError(401, "You are not authenticated!"));
    }
}

const createInternshipForm = async(req, res, next) => {
    try{
        const newInternshipInput = new InternshipForm(req.body);
        await newInternshipInput.save();
        res.status(200).json("Internship form submitted successfully!");
    }catch(err){
        next(createError(401, "Something went wrong!"));
    }
}

const updateInternshipForm = async(req, res, next) => {
    try{
        await InternshipForm.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true});
        res.status(200).json("Internship form updated successfully!");
    }catch(err){
        next(createError(401, "You are not authenticated!"));
    }
}

const deleteInternshipForm = async(req, res, next) => {
    try{
        await InternshipForm.findByIdAndDelete(req.params.id);
        res.status(200).json("Internship form deleted successfully!");
    }catch(err){
        next(createError(401, "You are not authenticated!"));
    }
}

const getAllInternshipForms = async(req, res, next) => {
    try{
        const internshipForms = await InternshipForm.find();
        res.status(200).json(internshipForms);
    }catch(err){
        next(createError(401, "You are not authenticated!"));
    }
}

module.exports = {
    createCareerForm, updateCareerForm, deleteCareerForm, getAllCareerForms,
    createFranchiseForm, updateFranchiseForm, deleteFranchiseForm, getAllFranchiseForms,
    createInternshipForm, updateInternshipForm, deleteInternshipForm, getAllInternshipForms   
}