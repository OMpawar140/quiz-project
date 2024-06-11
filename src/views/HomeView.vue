<template>
  <div>
    <div class="search-bar-container">
      <input v-model="searchQuery" class="search-bar" placeholder="Search..." />
      <button @click="submitSearch" class="submit-button">Search</button>
    </div>

    <h2 v-if="user_type === 'student'">Available Quizzes</h2>
    <h2 v-if="user_type === 'teacher'">Created Quizzes</h2>
    <br>

    <v-row>
      <v-col v-for="(quiz, index) in quizzes" :key="index" cols="12" sm="6" md="4" lg="3">
        <router-link :to="{ name: 'quiz', params: { quizId: quiz._id } }">
          <v-card v-if="user_email === quiz.teacherEmail || user_type === 'student'" class="quiz-card">
            <div>{{ quiz.quizName }}</div>
          </v-card>
        </router-link>

        <div v-if="user_type === 'teacher' && user_email === quiz.teacherEmail" class="btn-group">
          <li @click="toggleMenu(quiz._id)" class="dropdown-toggle">
            Options
            <span class="caret"></span>
          </li>
          <ul class="dropdown-menu" v-if="showMenu[quiz._id]">
            <li>
              <a href="javascript:void(0)" @click="downloadResponses(quiz._id, quiz.quizName)">
                Download Responses
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" @click="otherOptionHandler(quiz._id)">
                Other Option
              </a>
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error">{{ error }}</v-alert>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { googleLogout } from 'vue3-google-login';
import { getStorage } from 'firebase/storage';
import axios from 'axios';

const router = useRouter();

let user_name = localStorage.getItem('usr_name');
let user_email = localStorage.getItem('usr_email');
let user_photo = localStorage.getItem('usr_photo');
let user_type = localStorage.getItem('usr_type');

const storage = getStorage();

const logout = () => {
  localStorage.clear();
  googleLogout();
  router.push('/login');
};

const checkStat = () => {
  return !user_email || !user_name || !user_photo || !user_type;
};

if (checkStat()) {
  router.push('/login');
}

const openVideoPage = (videoId) => {
  router.push({ name: 'video', params: { videoId } });
};

const fetchData = async () => {
  try {
    user_name = localStorage.getItem('usr_name');
    user_email = localStorage.getItem('usr_email');
    user_photo = localStorage.getItem('usr_photo');
    user_type = localStorage.getItem('usr_type');

    const response = await axios.post('http://localhost:3000/users', {
      email: user_email,
      username: user_name,
      type: user_type,
    });

    console.log('Request Payload:', { email: user_email, username: user_name, type: user_type });

    if (response.status === 200) {
      console.log('User created successfully');
    }

    if (checkStat()) {
      router.push('/login');
    }
  } catch (error) {
    console.error(error);
  }
};

const searchQuery = ref('');
const uploadedVideos = ref([]);
const quizzes = ref([]);
const error = ref(null);

const fetchVideos = async () => {
  try {
    const response = await axios.get('http://localhost:3000/videos');
    uploadedVideos.value = response.data.map((video) => ({
      id: video._id,
      name: video.title,
      thumbnail: video.thumbnailLink,
      uploadedBy: video.uploadedBy,
    }));
  } catch (err) {
    console.error('Error fetching videos:', err);
    error.value = 'Error fetching videos. Please try again later.';
  }
};

const fetchQuizzes = async () => {
  try {
    const response = await axios.get('http://localhost:3000/quizzes');
    quizzes.value = response.data;
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    error.value = 'Error fetching quizzes. Please try again later.';
  }
};

const downloadResponses = async (quizId, quizName) => {
  try {
    const response = await axios.get(`http://localhost:3000/quiz-responses/${quizId}/download`, { responseType: 'blob' });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${quizName}-quiz-responses.xlsx`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error downloading responses:', error);
  }
};

const otherOptionHandler = (quizId) => {
  console.log(`Other option clicked for quiz ${quizId}`);
};

const showMenu = ref({});

const toggleMenu = (quizId) => {
  showMenu.value = { ...showMenu.value, [quizId]: !showMenu.value[quizId] };
};

onMounted(() => {
  fetchVideos();
  fetchQuizzes();
  fetchData();
});
</script>

<style scoped>
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

.quiz-card {
  padding: 20px;
  background-color: rgba(235, 182, 9, 0.829);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(216, 171, 23, 0.1);
  transition: box-shadow 0.3s ease;
}

.quiz-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-group {
  min-width: 160px;
  height: 40px;
  position: relative;
  margin: 10px 1px;
  display: inline-block;
  vertical-align: middle;
}
.btn-group a:hover {
  text-decoration: none;
}

.dropdown-toggle {
  color: #636b6f;
  min-width: 160px;
  padding: 10px 20px 10px 10px;
  text-transform: none;
  font-weight: 300;
  margin-bottom: 7px;
  border: 0;
  background-image: linear-gradient(#009688, #009688), linear-gradient(#D2D2D2, #D2D2D2);
  background-size: 0 2px, 100% 1px;
  background-repeat: no-repeat;
  background-position: center bottom, center calc(100% - 1px);
  background-color: transparent;
  transition: background 0s ease-out;
  float: none;
  box-shadow: none;
  border-radius: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.dropdown-toggle:hover {
  background: #e1e1e1;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  float: left;
  min-width: 160px;
  padding: 5px 0;
  margin: 2px 0 0;
  list-style: none;
  font-size: 14px;
  text-align: left;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  background-clip: padding-box;
}

.dropdown-menu > li > a {
  padding: 10px 30px;
  display: block;
  clear: both;
  font-weight: normal;
  line-height: 1.6;
  color: #333333;
  white-space: nowrap;
  text-decoration: none;
}
.dropdown-menu > li > a:hover {
  background: #efefef;
  color: #409FCB;
}

.dropdown-menu > li {
  overflow: hidden;
  width: 100%;
  position: relative;
  margin: 0;
}

.caret {
  width: 0;
  position: absolute;
  top: 19px;
  height: 0;
  margin-left: -24px;
  vertical-align: middle;
  border-top: 4px dashed;
  border-top: 4px solid \9;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  right: 10px;
}

li {
  list-style: none;
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
