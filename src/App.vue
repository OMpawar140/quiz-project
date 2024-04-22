
<script setup>
import { RouterView } from 'vue-router'
import '@mdi/font/css/materialdesignicons.css'
import router from './router';

</script>
<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar title="GATE Focused">
      <v-tabs>
        <v-tab to="/">Home</v-tab>
        <template v-if="user_type === 'teacher'">
          <v-tab to="/upload">Manual Quiz</v-tab>
          <v-tab to="/alluploads">Excel Quiz</v-tab>
        </template>
        <v-tab to="/about">About</v-tab>
      </v-tabs>
      <div class="text-center">
        <v-menu v-model="menu" :close-on-content-click="true" location="end">
          <template v-slot:activator="{ props }">
            <div v-bind="props">
              <img :src="user_photo" width="40px" style="border-radius: 55px;" />
            </div>
          </template>

          <v-card min-width="300">
            <v-list>
              <v-list-item>
                <v-container fluid>
                  <v-row align="center" justify="center">
                    <div>
                      <img :src="user_photo" height="150px" style="border-radius: 55px;" />
                    </div>
                  </v-row>
                  <v-col align="center" justify="center">
                    <h1>Hello, {{ user_name }}</h1>
                    <h4>{{ user_email }}</h4>
                    <h4>{{ user_type }}</h4>
                  </v-col>
                  <v-row align="center" justify="center" style='margin-top: 20px;'>
                    <v-btn color="blue-grey" @click="logout">Logout</v-btn>
                  </v-row>
                </v-container>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>

    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>


<script>
import { googleLogout } from "vue3-google-login";

export default {
  data() {
    return {
      user_name: "",
      user_email: "",
      user_photo: "",
      user_type: "",
      menu: false
    }
  },
  created() {
    this.user_name = localStorage.getItem("usr_name") || "";
    this.user_email = localStorage.getItem("usr_email") || "";
    this.user_photo = localStorage.getItem("usr_photo") || "";
    this.user_type = localStorage.getItem("usr_type") || "";
  }
  ,
  methods: {
    logout() {
      this.user_type = "";
      localStorage.clear();
      googleLogout();
      router.push("/login");
      menu = false;

    }
  },

  watch: {
    '$route'(to, from) {
      this.user_photo = localStorage.getItem("usr_photo") || "";
      this.user_name = localStorage.getItem("usr_name") || "";
      this.user_email = localStorage.getItem("usr_email") || "";
      this.user_type = localStorage.getItem("usr_type") || "";
    }
  }
}
</script>


<style scoped></style>