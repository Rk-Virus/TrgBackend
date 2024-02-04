const CareerForm = require("../models/CareerForm");
const InternshipForm = require("../models/InternshipForm");
const FranchiseForm = require("../models/FranchiseForm");
const path = require('path');
const fs = require('fs').promises;

const createCareerForm = async(req, res) => {
    try{
        const newCareerInput = new CareerForm({ ...req.body, fullname: req.body.fname + " " + req.body.lname, file: req.file.filename });
        await newCareerInput.save();
        res.status(200).json("Career form submitted successfully!");
    }catch(err){
        res.status(500).json({ error: 'Something went wrong!' });
    }
}

const updateCareerForm = async(req, res) => {
    try{
        await CareerForm.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true});
        res.status(200).json("Career form updated successfully!");
    }catch(err){
        res.status(401).json({ error: 'You are not authenticated!' });
    }
}

const deleteCareerForm = async(req, res) => {
    try{
       // Find the CareerForm and retrieve the file location
        const careerForm = await CareerForm.findById(req.params.id);
        if (!careerForm) {
            return res.status(404).json({ error: 'Career form not found!' });
        }

        const fileLocation = path.join(__dirname, '../files/', careerForm.file);

        // Delete the CareerForm
        await CareerForm.findByIdAndDelete(req.params.id);
        // Delete the associated file
        if (fileLocation) {
            await fs.unlink(fileLocation);
            console.log(`File ${fileLocation} deleted successfully`);
        }
        res.status(200).json("Career form deleted successfully!");
    }catch(err){
        res.status(401).json({ error: 'You are not authenticated!' });
    }
}

const getAllCareerForms = async(req, res) => {
    try{
        const careerForms = await CareerForm.find();
        res.status(200).json(careerForms);
    }catch(err){
        res.status(401).json({ error: 'You are not authenticated!' });
    }
}

const getCareerForm = async(req,res)=>{
    try{
        const career = await CareerForm.findById(req.params.id)
        res.status(200).json(career)
    }catch(err){
        res.status(401).json({ error: 'You are not authenticated!' });
    }
}


const createFranchiseForm = async(req, res) => {
    try{
        const newFranchiseInput = new FranchiseForm(req.body);
        await newFranchiseInput.save();
        res.status(200).json("Franchise form submitted successfully!");
    }catch(err){
        res.status(500).json({ error: 'Something went wrong!' });
    }
}

const updateFranchiseForm = async(req, res) => {
    try{
        await FranchiseForm.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true});
        res.status(200).json("Franchise form updated successfully!");
    }catch(err){
        res.status(401).json({ error: 'You are not authenticated!' });
    }
}

const deleteFranchiseForm = async(req, res) => {
    try{
        await FranchiseForm.findByIdAndDelete(req.params.id);
        res.status(200).json("Franchise form deleted successfully!");
    }catch(err){
        res.status(401).json({ error: 'You are not authenticated!' });
    }
}

const getAllFranchiseForms = async(req, res) => {
    try{
        const franchiseForms = await FranchiseForm.find();
        res.status(200).json(franchiseForms);
    }catch(err){
        res.status(401).json({ error: 'You are not authenticated!' });
    }
}

const getFranchiseForm = async(req,res)=>{
    try{
        const franchise = await FranchiseForm.findById(req.params.id)
        res.status(200).json(franchise)
    }catch(err){
        res.status(401).json({ error: 'You are not authenticated!' });
    }
}

const createInternshipForm = async(req, res) => {
    try{
        const newInternshipInput = new InternshipForm(req.body);
        await newInternshipInput.save();
        res.status(200).json("Internship form submitted successfully!");
    }catch(err){
        res.status(500).json({ error: 'Something went wrong!' });
    }
}

const updateInternshipForm = async(req, res) => {
    try{
        await InternshipForm.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true});
        res.status(200).json("Internship form updated successfully!");
    }catch(err){
        res.status(401).json({ error: 'You are not authenticated!' });
    }
}

const deleteInternshipForm = async(req, res) => {
    try{
        await InternshipForm.findByIdAndDelete(req.params.id);
        res.status(200).json("Internship form deleted successfully!");
    }catch(err){
        res.status(401).json({ error: 'You are not authenticated!' });
    }
}

const getAllInternshipForms = async(req, res) => {
    try{
        const internshipForms = await InternshipForm.find();
        res.status(200).json(internshipForms);
    }catch(err){
        res.status(401).json({ error: 'You are not authenticated!' });
    }
}

const getInternshipForm = async(req,res)=>{
    try{
        const internship = await InternshipForm.findById(req.params.id)
        res.status(200).json(internship)
    }catch(err){
        res.status(401).json({ error: 'You are not authenticated!' });
    }
}

module.exports = {
    createCareerForm, updateCareerForm, deleteCareerForm, getAllCareerForms, getCareerForm,
    createFranchiseForm, updateFranchiseForm, deleteFranchiseForm, getAllFranchiseForms, getFranchiseForm,
    createInternshipForm, updateInternshipForm, deleteInternshipForm, getAllInternshipForms, getInternshipForm
}