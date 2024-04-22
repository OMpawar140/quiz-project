<template>
    <div>
      <!-- Countdown Timer -->
      <div class="time-display" v-if="!previewing">
      </div>
      <h2>Create Your Quiz</h2>
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
          <p><strong>Time Limit (minutes):</strong> {{ timeLimit }}</p>
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
      handleImageUpload(event, index) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            this.questions[index].imageUrl = reader.result;
          };
          reader.readAsDataURL(file);
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
    