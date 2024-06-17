<template>
  <div>
    <!-- Countdown Timer -->
    <div class="time-display" v-if="!previewing">
    </div>
    <br>
    <h2>Create Your Quiz</h2>
    <hr/>
    <br>
    <div class="input-group" v-if="!timeExpired">
      <label for="quiz-name">Quiz Name:</label>
      <input type="text" id="quiz-name" v-model="quizName" placeholder="Enter quiz name">
    </div>
    <div class="input-group" v-if="!timeExpired">
      <label for="subject">Subject:</label>
      <input type="text" id="subject" v-model="subject" placeholder="Enter subject">
    </div>
    <div class="input-group" v-if="!timeExpired">
      <label for="num-questions">Number of Questions:</label>
      <input type="number" id="num-questions" v-model="numQuestions" min="1" max="20">
    </div>
    <div class="input-group" v-if="!timeExpired">
      <label for="marks-per-question">Marks Per Question:</label>
      <input type="number" id="marks-per-question" v-model="marksPerQuestion" min="1" max="10">
    </div>
    <div class="input-group" v-if="!timeExpired">
      <label for="time-limit">Time Limit (minutes):</label>
      <input type="number" id="time-limit" v-model="timeLimit" min="1" max="120">
    </div>

    <!-- Quiz questions -->
    <h3>Quiz Questions</h3>
    <div class="question-container" v-for="(question, index) in questions" :key="index">
      <h4>Question {{ index + 1 }}</h4>
      <input type="text" v-model="question.text" placeholder="Type your question" class="question-input">
      <input type="file" accept="image/*" @change="handleImageUpload($event, index)">
      <img v-if="question.imageUrl" :src="question.imageUrl" alt="Question Image">
      <button v-if="question.imageUrl" @click="removeImage(index)" class="remove-image-btn">Remove Image</button>
      <ol type="A">  
        <li v-for="(answer, answerIndex) in question.answers" :key="answerIndex">
          <input type="text" v-model="question.answers[answerIndex]" placeholder="Type option " class="answer-input">
        </li>
      </ol>
      <!-- Correct answer and solution options -->
      <div class="options-container" v-if="!previewing && !timeExpired">
        <label for="correct-answer">Correct Answer:</label>
        <select v-model="question.correctAnswer" id="correct-answer">
          <option v-for="(answer, index) in question.answers" :key="index" :value="index">{{ String.fromCharCode(65 + index) }}</option>
        </select>
        <label for="solution">Solution:</label>
        <textarea v-model="question.solution" id="solution" placeholder="Type solution"></textarea>
      </div>
    </div>
    
    <!-- Buttons for quiz management -->
    <div class="button-container" v-if="!timeExpired">
      <button @click="addQuestion">Add Question</button>
      <button @click="removeQuestion">Remove Last Question</button>
      <button @click="previewQuiz">Preview Quiz</button>
      <button @click="submitQuiz">Submit Quiz</button> <!-- Added button for submitting quiz -->
    </div>

    <!-- Preview Quiz Section -->
    <div v-if="previewing || timeExpired" class="preview-container">
      <h2>Preview Quiz</h2>
      <div class="quiz-info">
        <p><strong>Quiz Name:</strong> {{ quizName }}</p>
        <p><strong>Subject:</strong> {{ subject }}</p>
        <p><strong>Number of Questions:</strong> {{ numQuestions }}</p>
        <p><strong>Marks Per Question:</strong> {{ marksPerQuestion }}</p>
        <p><strong>Total Marks:</strong> {{ totalMarks }}</p>
        <p v-if="timeExpired">Time's Up!</p>
        <p v-else><strong>Time Left:</strong> {{ formatTime(timeLeft) }}</p>
        <p v-if="timeExpired">Score: {{ score }}</p>
      </div>
      <div v-for="(question, index) in questions" :key="index" class="preview-question">
        <h3>Question {{ index + 1 }}</h3>
        <p class="preview-question-text">{{ question.text }}</p>
        <img v-if="question.imageUrl" :src="question.imageUrl" alt="Question Image">
        <ul class="preview-answer-list">
          <li v-for="(answer, answerIndex) in question.answers" :key="answerIndex" class="preview-answer-item">
            <input type="radio" :id="'question_' + index + '_answer_' + answerIndex" :name="'question_' + index" :value="answerIndex" v-model="question.selectedAnswer">
            <label :for="'question_' + index + '_answer_' + answerIndex">{{ answer }}</label>
          </li>
        </ul>
        <!-- Display correct answer and solution in preview mode -->
        <div v-if="!question.isAnswerChecked && !timeExpired" class="preview-options">
          <button @click="submitAnswer(question, index)">Submit</button>
        </div>
        <div v-else class="preview-options">
          <p v-if="question.isCorrect && !timeExpired">Correct Answer!</p>
          <p v-else-if="!question.isCorrect && !timeExpired">Incorrect Answer!</p>
          <p v-if="!timeExpired">Solution: {{ question.solution }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage } from '@/main';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import axios from 'axios';

export default {
  data() {
    return {
      quizName: '',
      subject: '',
      numQuestions: null,
      marksPerQuestion: null,
      timeLimit: null,
      timeLeft: null,
      timeExpired: false,
      questions: [
        { 
          text: '', 
          answers: ['', '', '', ''], 
          correctAnswer: undefined, 
          solution: '', 
          isAnswerChecked: false, 
          selectedAnswer: null,
          imageUrl: '' 
        }
      ],
      previewing: false,
      intervalId: null,
      score: 0
    };
  },
  computed: {
    totalMarks() {
      return this.numQuestions * this.marksPerQuestion;
    }
  },
  methods: {
    addQuestion() {
      this.questions.push({ text: '', answers: ['', '', '', ''], correctAnswer: undefined, solution: '', isAnswerChecked: false, selectedAnswer: null, imageUrl: '' });
    },
    removeQuestion() {
      if (this.questions.length > 1) {
        this.questions.pop();
      }
    },
    previewQuiz() {
      this.previewing = !this.previewing;
      if (this.previewing) {
        this.startTimer(); 
      }
    },

    async removeImage(index) {
      const imageUrl = this.questions[index].imageUrl;
      if (imageUrl.startsWith('https://firebasestorage.googleapis.com')) {
        // Remove image from Firebase Storage
        const fileRef = ref(storage, imageUrl);
        try {
          await deleteObject(fileRef);
          console.log('File deleted from Firebase Storage');
        } catch (error) {
          console.error('Error deleting file from Firebase Storage:', error);
        }
      }
      // Clear image details from the question object
      this.questions[index].imageUrl = '';
    },

    handleImageUpload(event, index) {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `quiz_images/${file.name}`);
      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          this.questions[index].imageUrl = downloadURL;
        });
      }).catch((error) => {
        console.error("Error uploading image: ", error);
      });
    }
  },
    submitAnswer(question, index) {
      question.isAnswerChecked = true;
      question.isCorrect = (question.selectedAnswer == question.correctAnswer);
    },
    startTimer() {
      if (this.timeLimit !== null) {
        this.timeLeft = this.timeLimit * 60;
        this.intervalId = setInterval(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            this.timeExpired = true;
            clearInterval(this.intervalId);
            this.calculateScore(); 
          }
        }, 1000);
      }
    },
    formatTime(timeInSeconds) {
      if (timeInSeconds === null) return '00:00'; 
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },
    calculateScore() {
      this.score = 0;
      this.questions.forEach((question) => {
        if (question.isCorrect) {
          this.score += this.marksPerQuestion;
        }
      });
    },
    submitQuiz() {
    const teacherEmail = localStorage.getItem("usr_email");
    const teacherName = localStorage.getItem("usr_name");
      const quizData = {
        teacherEmail,
        teacherName,
        quizName: this.quizName,
        subject: this.subject,
        numQuestions: this.numQuestions,
        marksPerQuestion: this.marksPerQuestion,
        timeLimit: this.timeLimit,
        questions: this.questions.map(question => ({
        text: question.text,
        answers: question.answers,
        correctAnswerIndex: question.correctAnswer,
        solution:question.solution,
        imageURL:question.imageUrl,
        marks: this.marksPerQuestion
       }))
      };

      axios.post('http://localhost:3000/quizzes', quizData)
        .then(response => {
          console.log(response.data);
          // Optionally, you can handle successful submission here
        })
        .catch(error => {
          console.error('Error submitting quiz:', error);
          // Optionally, you can handle errors here
        });
    }
  },
  created() {
    this.startTimer();
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  }
};
</script>
  
  <style scoped>

    .remove-image-btn {
      display: block;
      height: 30px;
      background-color: rgb(174, 28, 28);
      border: none;
      border-radius: 5px;
      color: white;
      cursor: pointer;
      margin-top: 5px;
      margin-left: 31.5%;
      margin-bottom: 10px;
      font-size:smaller;
      padding-top: 5px;
    }

    .remove-image-btn:hover {
      background-color: #e90808;
    }
    .input-group {
      margin-bottom: 20px;
    }
    
    .input-group label {
      display: block;
      margin-bottom: 5px;
    }
    
    .input-group input, .options-container select, .options-container textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #b8ac51;
      border-radius: 5px;
      margin-bottom: 10px;
    }
    
    input:hover {
      border-color: aqua;
    }
    .input-group select {
      padding: 7px;
    }
    
    .button-container {
      margin-top: 20px;
    }
    
    button {
      padding: 10px 20px;
      margin-right: 10px;
      border: none;
      border-radius: 5px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #0056b3;
    }
    
    .preview-container {
      margin-top: 40px;
    }
    
    .quiz-info {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    
    .question-container {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    
    .question-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-bottom: 10px;
    }
    
    .answer-input {
      width: calc(100% - 30px); 
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-bottom: 10px;
    }
    
    .options-container {
      background-color: #f9f9f9;
      padding: 10px;
      border-radius: 5px;
      margin-top: 10px;
    }
    
    .preview-question {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
  
    .question-container img {
    width: 200px; 
    height: auto; 
  }
    
    .preview-question-text {
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .preview-answer-list {
      list-style: none;
      padding-left: 0;
    }
    
    .preview-answer-item {
      padding: 5px 0;
    }
    
    .preview-options {
      margin-top: 10px;
    }
    .preview-question img {
    width: 200px; 
    height: auto; 
  }
  </style>
    