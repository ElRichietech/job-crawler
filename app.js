const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;

app.use(express.static('public'));


// MongoDB connection string
const mongoUri = 'mongodb+srv://efemenaisaac1410:dAulMCFCqb9g1eo6@cluster0.8kjyk.mongodb.net/job_crawler?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));


// Define a schema and model for career pages
const careerPageSchema = new mongoose.Schema({
    company: String,
    url: String,
    jobAvailable: Boolean  // Adjust fields based on your actual MongoDB data
});
const CareerPage = mongoose.model('CareerPage', careerPageSchema);

// Route to get career pages from MongoDB
app.get('/api/career-pages', async (req, res) => {
    try {
        const careerPages = await CareerPage.find();  // Fetch all documents from the collection
        res.json(careerPages);  // Send data as JSON response
    } catch (error) {
        console.error('Error fetching career pages:', error);
        res.status(500).json({ message: 'Error fetching career pages' });
    }
});

// Root route for welcome message
app.get('/', (req, res) => {
    res.send('Welcome to the Job Crawler API!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


const axios = require('axios');
const cheerio = require('cheerio');

// Function to check if a URL has job openings
async function checkJobAvailability(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Search for keywords on the page
        const pageText = $('body').text().toLowerCase();
        const keywords = ['job', 'position', 'opening', 'career', 'vacancy'];
        const jobFound = keywords.some(keyword => pageText.includes(keyword));

        return jobFound;
    } catch (error) {
        console.error(`Error checking job availability at ${url}:`, error.message);
        return false; // Assume no jobs if there was an error
    }
}

// Update all URLs in the database with job availability status
async function updateJobAvailability() {
    const careerPages = await CareerPage.find();
    for (let page of careerPages) {
        const jobAvailable = await checkJobAvailability(page.url);
        await CareerPage.findByIdAndUpdate(page._id, { jobAvailable });
    }
    console.log('Job availability updated for all pages.');
}

// Set an interval to check job availability every hour
setInterval(updateJobAvailability, 3600000); // 3600000 ms = 1 hour


// Run this script once in app.js to add 'jobAvailable' field if it's missing
async function addJobAvailableField() {
    try {
        await CareerPage.updateMany(
            { jobAvailable: { $exists: false } },
            { $set: { jobAvailable: false } }
        );
        console.log('Updated all documents to include jobAvailable field.');
    } catch (error) {
        console.error('Error updating documents:', error);
    }
}

// Call this function once when the app starts to update existing documents
addJobAvailableField();


// Route to add sample data for testing
app.get('/', async (req, res) => {
    try {
        const careerPages = await CareerPage.find();
        
        // Build a response HTML with the information
        let responseHtml = "<h1>Job Crawler</h1>";
        
        careerPages.forEach(page => {
            responseHtml += `<p>${page.company}</p>`;
            responseHtml += `<p>URL: <a href="${page.url}">${page.url}</a></p>`;
            responseHtml += `<p>Status: ${page.jobAvailable ? "Jobs Available" : "No Jobs"}</p>`;
            responseHtml += "<br>";
        });
        
        res.send(responseHtml);
    } catch (error) {
        console.error('Error fetching career pages:', error);
        res.status(500).send("Error fetching career pages");
    }
});

