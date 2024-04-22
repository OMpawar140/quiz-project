<template>
    <div class="dashboard">
      <v-container>
        <v-row>
          <v-col  class="video-container" cols="12">
            <video v-if="this.videoSrc" controls :src="this.videoSrc">
              <!-- <source :src="this.videoSrc" /> -->
            </video>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="video-info">
              <h2 class="video-title">{{ videoTitle }}</h2>
              <div class="uploader-info">
                <!-- <img :src="uploaderIcon" alt="Uploader Icon" class="uploader-icon" /> -->
                <span class="uploader-name">{{ uploaderName }}</span>
              </div>
              <h2>Description</h2>
              <p class="video-description">{{ videoDescription }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
import axios from 'axios';
import router from '@/router';

export default {
  name: 'VideoView',
  setup(props) {
    const videoSrc = ref('');
    const videoTitle = ref('');
    const uploaderIcon = ref('');
    const uploaderName = ref('');
    const videoDescription = ref('');

    onMounted(async () => {
      try {
        const videoId = router.currentRoute.value.params.videoId; 
        const response = await axios.get(`http://localhost:3000/video/${videoId}`);
        const videoData = response.data;
        videoSrc.value = videoData.link;
        videoTitle.value = videoData.title;
        uploaderIcon.value = videoData.uploaderIcon;
        uploaderName.value = videoData.uploadedBy;
        videoDescription.value = videoData.description;
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    });

    return { videoSrc, videoTitle, uploaderIcon, uploaderName, videoDescription };
  }

  };
  </script>
  
  <style scoped>
  .dashboard {
    text-align: center;
    padding: 20px;
  }
  
  .video-container {
    display: flex;
    /* justify-content: center; */
    align-items: center;
  }
  
  video {
    /* max-width: 70vw; */
    width: 70vw;
    height: auto;
  }
  
  @media (orientation: landscape) {
    video {
      max-width: 50vw;
    }
  }
  
  .video-info {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .video-title {
    font-size: 3vh;
    margin-bottom: 10px;
  }
  
  .uploader-info {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .uploader-icon {
    width: 48px;
    height: 48px;
    margin-right: 10px;
  }
  
  .uploader-name {
    font-size: 2.5vh;
    color: #666;
  }
  
  .video-description {
    font-size: 2vh;
    color: #666;
    line-height: 1.5;
    text-align: left;
  }
  </style>
  