<template>
    <div v-if="quiz">
      <!-- Display quiz details -->
      <h2>{{ quiz.quizName }}</h2>
      <p>Subject: {{ quiz.subject }}</p>
      <p>Number of questions: {{ quiz.numQuestions }}</p>
      <!-- Add more details as needed -->
  
      <!-- Start button -->
      <button @click="startQuiz">Start Quiz</button>
  
      <!-- Submit button -->
      <button @click="submitQuiz">Submit Quiz</button>
  
      <!-- Display questions -->
      <div v-if="quizStarted">
        <div v-for="(question, index) in quiz.questions" :key="index">
          <h3>{{ question.text }}</h3>
          <!-- Display question options -->
          <ul>
            <li v-for="(answer, optionIndex) in question.answers" :key="optionIndex">
              <input type="radio" :value="optionIndex" v-model="selectedAnswers[index]" :disabled="quizSubmitted">{{ answer }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
  
  export default {
    props: {
      quizId: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const router = useRouter();
      const quiz = ref(null);
      const error = ref(null);
      const selectedAnswers = reactive([]);
  
      // Fetch quiz data from the server
      const fetchQuiz = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/quizzes/${props.quizId}`);
          quiz.value = response.data;
          // Initialize selectedAnswers array with null values for each question
          selectedAnswers.length = quiz.value.questions.length;
          selectedAnswers.fill(null);
        } catch (err) {
          console.error("Error fetching quiz:", err);
          error.value = "Error fetching quiz. Please try again later.";
        }
      };
  
      // Start quiz function
      const startQuiz = () => {
        // Perform any necessary actions to start the quiz
      };
  
      // Submit quiz function
      const submitQuiz = () => {
        // Perform any necessary actions to submit the quiz
      };
  
      // Computed property to check if quiz has been started
      const quizStarted = computed(() => {
        return selectedAnswers.some(answer => answer !== null);
      });
  
      // Computed property to check if quiz has been submitted
      const quizSubmitted = computed(() => {
        // Add logic to determine if quiz has been submitted
        return false;
      });
  
      // Call fetchQuiz function on component mount
      fetchQuiz();
  
      return {
        quiz,
        error,
        selectedAnswers,
        startQuiz,
        submitQuiz,
        quizStarted,
        quizSubmitted
      };
    }
  };
  </script>
  
  <style scoped>
  /* Add your styling here */
  </style>
  