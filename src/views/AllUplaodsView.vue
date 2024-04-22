<template>
  <div>
    <!-- Countdown timer -->

    <!-- Quiz details -->
    <h2>Create Your Quiz</h2>
    <div class="input-group">
      <label for="quiz-name">Quiz Name:</label>
      <input type="text" id="quiz-name" v-model="quizName" placeholder="Enter quiz name" :disabled="countdown > 0">
    </div>
    <!-- Add an input field for uploading Excel file -->
    <div class="input-group">
      <label for="excel-upload">Upload Excel File:</label>
      <input type="file" id="excel-upload" accept=".xlsx,.xls" @change="handleExcelUpload($event)" :disabled="countdown > 0">
    </div>

    <!-- Set quiz time -->
    <div class="input-group">
      <label for="quiz-time">Set Quiz Time (in minutes):</label>
      <input type="number" id="quiz-time" v-model="quizTime" placeholder="Enter quiz time" :disabled="countdown > 0">
    </div>

    <!-- Buttons for quiz management -->
    <div class="button-container" v-if="!previewing && countdown <= 0 && quizName !== '' && questions.length > 0 && quizTime > 0">
      <button @click="previewQuiz">Preview Quiz</button>
    </div>

    <!-- Preview Quiz Section -->
    <div v-if="previewing" class="preview-container">
      <h2>Formed Quiz: {{ quizName }}</h2>
      <div v-if="countdown > 0" class="timer">
      Time Left: {{ countdown }}
    </div>
      <div v-for="(question, index) in questions" :key="index" class="preview-question">
        <h3>{{ question.text ? question.text : 'Question Text Not Available' }}</h3>
        <ul class="preview-answer-list">
          <li v-for="(answer, answerIndex) in question.answers" :key="answerIndex" class="preview-answer-item">
            <input type="radio" :id="'question_' + index + '_answer_' + answerIndex" :name="'question_' + index" :value="answerIndex" v-model="question.selectedAnswer">
            <label :for="'question_' + index + '_answer_' + answerIndex">{{ answer ? answer : 'Answer Not Available' }}</label>
          </li>
        </ul>
        <p v-if="question.selectedAnswer !== null">
          {{ checkAnswer(question) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      countdown: 0,
      quizTime: 0,
      quizName: '',
      questions: [],
      previewing: false
    };
  },
  methods: {
    handleExcelUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        this.questions = rows.map(row => ({
          text: `${row['Question ID']}`,
          answers: [row['option a'], row['option b'], row['option c'], row['option d']],
          correctAnswer: row['correct option'],
        }));
      };

      reader.readAsArrayBuffer(file);
    },
    previewQuiz() {
      this.previewing = true;
      if (this.quizTime > 0) {
        this.countdown = this.quizTime * 60;
        setInterval(() => {
          if (this.countdown > 0) {
            this.countdown--;
          }
        }, 1000);
      }
    },
    checkAnswer(question) {
      if (question.selectedAnswer !== null && question.selectedAnswer !== undefined) {
        if (question.answers[question.selectedAnswer] === question.correctAnswer.trim()) {
          return "Correct!";
        } else {
          return "Incorrect!";
        }
      }
    }
  }
};
</script>

<style>
.timer {
  font-size: 18px;
  margin-bottom: 10px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input[type="text"],
.input-group input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}


.button-container button {
  margin-right: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button-container button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}


.preview-container {
  margin-top: 20px;
}

.preview-question {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 10px;
}

.preview-question h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.preview-answer-list {
  list-style-type: none;
  padding: 0;
}

.preview-answer-item {
  margin-bottom: 5px;
}
</style>
