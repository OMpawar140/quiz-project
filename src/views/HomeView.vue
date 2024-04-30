<template>
  <div>
    <!-- Search bar container -->
    <div class="search-bar-container">
      <input v-model="searchQuery" class="search-bar" placeholder="Search..." />
      <button @click="submitSearch" class="submit-button">
        Search
      </button>
    </div>

    <!-- Display quizzes -->
    <div v-if="quizzes.length > 0">
      <h2>Available Quizzes</h2>
      <ul>
        <li v-for="(quiz, index) in quizzes" :key="index">
          <router-link :to="{ name: 'quiz', params: { quizId: quiz._id } }">{{ quiz.quizName }}, {{ quiz.subject }} , {{ quiz.numQuestions }} , {{ quiz.questions }} </router-link>
        </li>
      </ul>
    </div>

    <!-- Display error message if fetching quizzes failed -->
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const searchQuery = ref("");
const quizzes = ref([]);
const error = ref(null);

const fetchQuizzes = async () => {
  try {
    const response = await axios.get('http://localhost:3000/quizzes');
    quizzes.value = response.data;
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    error.value = "Error fetching quizzes. Please try again later.";
  }
};

const submitSearch = () => {
  // Implement search functionality
};

onMounted(() => {
  fetchQuizzes();
});
</script>

<style scoped>
/* Styles for search bar */
.search-bar-container {
  text-align: center;
  margin-bottom: 20px;
  position: fixed;
  margin-top: 20px;
  top: 50px;
  left: 0;
  right: 0;
  background-color: #f1f1f1;
  padding: 10px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-bar {
  width: 30%;
  height: 40px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 10px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #19d73f;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #158ee5;
}

/* Error message */
.error-message {
  color: red;
  text-align: center;
  margin-top: 20px;
}
</style>
