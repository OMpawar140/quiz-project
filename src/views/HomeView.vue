<template>
  <!-- <main> -->
  <!-- Search bar container -->
  <div class="search-bar-container">
    <input v-model="searchQuery" class="search-bar" placeholder="Search..." />
    <button @click="submitSearch" class="submit-button">
      Search
    </button>
  </div>

  <!-- <v-container> -->
  <v-row>
    <v-col v-for="(video, index) in uploadedVideos" :key="index" cols="12" sm="6" md="4" lg="3">
      <v-card @click="openVideoPage(video.id)">
        <v-img :src="video.thumbnail" alt="Video Thumbnail" width="300"></v-img>
        <v-card-subtitle style="font-size: medium;">{{ video.uploadedBy }}</v-card-subtitle>
        <v-card-title style="font-size: medium;">{{ video.name }}</v-card-title>
      </v-card>
    </v-col>
  </v-row>
  <v-alert v-if="error" type="error">{{ error }}</v-alert>
  <!-- </v-container> -->
  <!-- </main> -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { googleLogout } from "vue3-google-login";
import { getStorage } from "firebase/storage";
import axios from "axios";

const router = useRouter();

var user_name = localStorage.getItem("usr_name");
var user_email = localStorage.getItem("usr_email");
var user_photo = localStorage.getItem("usr_photo");
var user_type = localStorage.getItem("usr_type");

const storage = getStorage();

const logout = () => {
  localStorage.clear();
  googleLogout();
  router.push("/login");
};

const checkStat = () => {
  return user_email === null || user_name === null || user_photo === null || user_type === null;
};

if (checkStat()) {
  router.push("/login");
}

const openVideoPage = (videoId) => {
  router.push({ name: 'video', params: { videoId } });
};

const fetchData = async () => {
  try {
    user_name = localStorage.getItem("usr_name");
    user_email = localStorage.getItem("usr_email");
    user_photo = localStorage.getItem("usr_photo");
    user_type = localStorage.getItem("usr_type");

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
    console.log(error);
    if (error.response && error.response.data.error) {
      // console.error(error.response.data.error);
    } else {
      // console.error('An error occurred');
    }
  }
};

const searchQuery = ref("");
const uploadedVideos = ref([]);
const error = ref(null);

const fetchVideos = async () => {
  try {
    const response = await axios.get('http://localhost:3000/videos');
    uploadedVideos.value = response.data.map((video) => ({
      id: video._id,
      name: video.title,
      thumbnail: video.thumbnailLink,
      uploadedBy: video.uploadedBy
    }));
    console.log(uploadedVideos.value);
  } catch (err) {
    console.error("Error fetching videos:", err);
    error.value = "Error fetching videos. Please try again later.";
  }
};
const removeExtension = (filename) => {
  return filename.split('.').slice(0, -1).join('.');
};

onMounted(() => {
  fetchVideos();
  fetchData();
});



const submitSearch = () => {
  // Implement search functionality
};
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

main {
  padding-top: 10%;
  /* Adjust as needed */
}
</style>
