// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// MongoDB connection setup
mongoose.connect('mongodb+srv://ompawar:OMpawar52361@cluster0.dhiolel.mongodb.net/pandm');
const db = mongoose.connection;

app.use(cors());
app.use(bodyParser.json());

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const usersSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: String,
  type: String
});

const User = mongoose.model('User', usersSchema);


const videosSchema = new mongoose.Schema({
  userEmail: String,
  title: String,
  description: String,
  category: String,
  link: String,
  thumbnailLink: String,
  uploadedBy: String
});

const Video = mongoose.model('Video', videosSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/users', async (req, res) => {
  const { email, username, type } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const newUser = new User({
    email,
    username,
    type
  });

  newUser.save()
    .then(result => {
      res.status(200).json({ message: 'User data saved to database' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error saving user data to database' });
    });
});

app.post('/videos', async (req, res) => {
  const {uploadedBy, userEmail, title, description, category, link, thumbnailLink } = req.body;

  try {
    // Save video information to the 'videos' collection
    console.log("Received video data:", req.body);
    const newVideo = new Video({
      userEmail,
      title,
      description,
      category,
      link,
      thumbnailLink,  
      uploadedBy
    });

    await newVideo.save();

    res.status(200).json({ message: 'Video data saved to the database' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving video data to the database' });
  }
});

app.get('/users', async (req, res) => {
  try {
    // Retrieve all users from the 'users' collection
    const users = await User.find();
    res.status(200).json(users);
  }catch(err){
    console.error(err);
  }
});

app.get('/videos', async (req, res) => {
  try {
    // Retrieve all videos from the 'videos' collection
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving videos from the database' });
  }
});

app.get('/videos/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const videos = await Video.find({ userEmail }); // Filter videos by userEmail
    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving videos from the database' });
  }
});

app.get('/video/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.status(200).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving video from the database' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
