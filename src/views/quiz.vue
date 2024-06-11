<template>
  <div class="main_bg">
    <div v-if="quiz" class="quiz-container" style="color: black;">
      <!-- Display quiz details -->
      <h2>Quiz Name: {{ quiz.quizName }}</h2>
      <br>
      <hr>
      <br>
      <h2>Subject: {{ quiz.subject }}</h2>
      <br>
      <hr>
      <br>
      <h3>Number of questions: {{ quiz.numQuestions }}</h3>
      <br>
      <hr>
      <br>
      <h3>Time Limit: {{ quiz.timeLimit }}</h3>
      <!-- Add more details as needed -->

      <!-- Start button -->
      <button @click="startQuiz" v-if="!quizStarted && !quizSubmitted" class="start-button">Start Quiz</button>

      <!-- Display questions -->
      <div v-if="quizStarted && !quizSubmitted" class="question-container">
        <h3>Time left: {{ formatTime(timeLeft) }}</h3>
        <div v-for="(question, index) in quiz.questions" :key="index" class="question" v-show="currentIndex === index">
          <h3>Q{{ index + 1 }}. {{ question.text }} (Marks: {{ question.marks }})</h3>
          <!-- Display question options -->
          <img style="height: 250px; width: 250px;" v-if="question.imageURL" :src="question.imageURL" alt="Question Image" class="question-image">
          <ul>
            <li v-for="(answer, optionIndex) in question.answers" :key="optionIndex" class="option">
              <input type="radio" :value="optionIndex" v-model="selectedAnswers[currentIndex]" :disabled="quizSubmitted">{{ answer }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="navigation-buttons" v-if="quizStarted && !quizSubmitted">
        <button @click="prevQuestion" :disabled="currentIndex === 0" class="navigation-button">Previous</button>
        <button @click="nextQuestion" :disabled="currentIndex === quiz.questions.length - 1" class="navigation-button">Next</button>
        <button @click="submitQuiz" v-if="currentIndex === quiz.questions.length - 1" class="submit-button">Submit Quiz</button>
      </div>

      <!-- Display quiz result -->
      <div v-if="quizSubmitted" class="result-container">
        <h3>Quiz Result</h3>
        <p v-if="quizScore === null">Quiz submitted. Waiting for results...</p>
        <p v-else>Score: {{ quizScore }}</p>
      </div>
      <!-- Display quiz responses -->
      <!-- <div v-if="quizResponses.length > 0" class="quiz-responses-container">
        <h3>Quiz Responses</h3>
        <ul>
          <li v-for="(response, index) in quizResponses" :key="index" class="response-item">
            <p>User Email: {{ response.userEmail }}</p>
            <p>Score: {{ response.score }}</p>
            Display more response details as needed -->
          <!-- </li> -->
        <!-- </ul> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const quizId = router.currentRoute.value.params.quizId;

const quiz = ref(null);
const selectedAnswers = ref([]);
const quizStarted = ref(false);
const quizSubmitted = ref(false);
const quizScore = ref(null);
const currentIndex = ref(0);
const timeLimit = ref(null);
const timeLeft = ref(null);
const intervalId = ref(null);

const fetchQuiz = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/quizzes/${quizId}`);
    quiz.value = response.data;
    selectedAnswers.value = Array(quiz.value.questions.length).fill(null);
    timeLimit.value = quiz.value.timeLimit;
  } catch (err) {
    console.error("Error fetching quiz:", err);
  }
};

const startQuiz = () => {
  quizStarted.value = true;
  startTimer();
};

const submitQuiz = async () => {
  try {
    const userType = localStorage.getItem("usr_type");
    const userEmail = localStorage.getItem("usr_email");
    const userName = localStorage.getItem("usr_name");
    const quizId = quiz.value._id;
    const responses = selectedAnswers.value;
    let score = 0;
    const marksPerQuestion = quiz.value.marksPerQuestion;

    // Calculate the score
    quiz.value.questions.forEach((question, index) => {
      if (responses[index] === question.correctAnswerIndex) {
        score += marksPerQuestion;
      }
    });

    const response = await axios.post(`http://localhost:3000/quiz-responses`, {
      userType,
      userEmail,
      userName,
      quizId,
      responses: responses.map((selectedAnswerIndex, questionIndex) => ({
        questionIndex,
        selectedAnswerIndex,
      })),
      score,
    });

    if (response.status === 200) {
      quizScore.value = score;
      quizSubmitted.value = true;
      console.log(response.data);
    }
  } catch (err) {
    console.error("Error submitting quiz:", err);
  }
};

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const nextQuestion = () => {
  if (currentIndex.value < quiz.value.questions.length - 1) {
    currentIndex.value++;
  }
};

const startTimer = () => {
  if (timeLimit.value !== null) {
    timeLeft.value = timeLimit.value * 60;
    intervalId.value = setInterval(() => {
      timeLeft.value--;
      if (timeLeft.value <= 0) {
        quizSubmitted.value = true;
        clearInterval(intervalId.value);
        submitQuiz();
      }
    }, 1000);
  }
};

const formatTime = (timeInSeconds) => {
  if (timeInSeconds === null) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

onMounted(() => {
  fetchQuiz();
});
</script>

<style scoped>
/* .main_bg{
  /* background-color: #edcd1a;
  width: 100%;
  height: 100%; */

/* Quiz container styles */
.quiz-container {
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 600px; /* Adjust max-width as needed */
  text-align: left; /* Align text to left */
  background-color: #78e8ee;
}

/* Start button styles */
.start-button {
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.start-button:hover {
  background-color: #2cce7d;
}

/* Question container styles */
.question-container {
  margin-bottom: 20px;
}

/* Question styles */
.question {
  margin-bottom: 20px;
}

/* Option styles */
.option {
  margin-left: 20px;
}

/* Navigation buttons container styles */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* Navigation button styles */
.navigation-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.navigation-button:hover {
  background-color: #2cce7d;
}

/* Submit button styles */
.submit-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #2cce7d;
}

/* Result container styles */
.result-container {
  margin-top: 20px;
}
</style>
