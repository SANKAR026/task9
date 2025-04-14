const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/StudentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    grade: String
});

const Student = mongoose.model('Student', studentSchema);

// Routes
// Create
app.post('/api/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read all
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read one
app.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send('Student not found');
        res.send(student);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update
app.put('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).send('Student not found');
        res.send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete
app.delete('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).send('Student not found');
        res.send(student);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});