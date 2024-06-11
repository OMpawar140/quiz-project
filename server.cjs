// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const ExcelJS = require('exceljs');


const app = express();
const PORT = 3000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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
  // eslint-disable-next-line no-undef
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

// Existing code continues...

const quizzesSchema = new mongoose.Schema({
  teacherEmail: String,
  teacherName: String,
  quizName: String,
  subject: String,
  numQuestions: Number,
  marksPerQuestion: Number,
  timeLimit: Number,
  questions: [{
    text: String,
    answers: [String],
    correctAnswerIndex: Number,
    solution:String,
    imageURL:String,
    marks: Number 
  }]
});

const Quiz = mongoose.model('Quiz', quizzesSchema);

// POST endpoint to handle quiz data submission
app.post('/quizzes', async (req, res) => {
  const quizData = req.body;

  try {
    const newQuiz = new Quiz(quizData);
    await newQuiz.save();
    res.status(200).json({ message: 'Quiz data saved to the database' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving quiz data to the database' });
  }
});

// GET endpoint to retrieve all quizzes
app.get('/quizzes', async (req, res) => {
  try { 
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving quizzes from the database' });
  }
});

// GET endpoint to retrieve a quiz by ID
app.get('/quizzes/:quizId', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving quiz from the database' });
  }
});

const quizResponseSchema = new mongoose.Schema({
  userType: String,
  userEmail: String, // Reference to the User model
  userName: String,
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, // Reference to the Quiz model
  responses: [{
    questionIndex: Number,
    selectedAnswerIndex: Number
  }],
  score: Number,
  createdAt: { type: Date, default: Date.now },
  timeAtresponse: { type: String, default: () => new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) },
  
});

const QuizResponse = mongoose.model('QuizResponse', quizResponseSchema);

app.post('/quiz-responses', async (req, res) => {
  try {
    const { userType, userEmail, userName, quizId, responses, score, createdAt, timeAtresponse } = req.body;

    const newQuizResponse = new QuizResponse({
      userType,
      userEmail,
      userName,
      quizId,
      responses,
      score,
      createdAt,
      timeAtresponse,
    });

    await newQuizResponse.save();

    res.status(200).json({ message: 'Quiz response saved to the database' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving quiz response to the database' });
  }
});

// Endpoint to retrieve all quiz responses
app.get('/quiz-responses', async (req, res) => {
  try {
    const quizResponses = await QuizResponse.find();
    res.status(200).json(quizResponses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving quiz responses from the database' });
  }
});



// Endpoint to download quiz responses as an Excel file
app.get('/quiz-responses/:quizId/download', async (req, res) => {
  const quizId = req.params.quizId;

  try {
    const responses = await QuizResponse.find({ quizId}).populate('quizId');

    if (!responses || responses.length === 0) {
      return res.status(404).json({ error: 'No responses found for the specified quiz.' });
    }

    const quizName = responses[0].quizId.quizName; 

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Responses');

    worksheet.columns = [
      { header: 'Student Name', key: 'studentName', width: 30 },
      { header: 'Student Email', key: 'studentEmail', width: 30 },
      // { header: 'Response Type', key: 'responserType', width: 30 },
      { header: 'Response Date', key: 'responseDate', width: 25 },
      { header: 'Response Time', key: 'responseTime', width: 15 },
      { header: 'Student Score', key: 'studentScore', width: 15 },
    ];

    responses.forEach(response => {
      if(response.userType === "student"){
        worksheet.addRow({
        studentEmail: response.userEmail,
        studentName: response.userName,
        // responserType: response.userType,
        studentScore: response.score,
        responseDate: response.createdAt.toLocaleDateString(),
        responseTime: response.timeAtresponse,
      });
      }
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${quizName} quiz-responses.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating Excel file' });
  }
});


// Existing code continues...

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
