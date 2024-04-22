<template>
    <div fluid style=" width: 100%; margin-top: 10%;">
        <section class="hero">
            <v-row class="herocol">
                <v-col fluid style="padding-top: 100px;">
                    <h1 style="font-size: xx-large; font-family: sans-serif;font-weight: bold;">Gate Exam Learning Platform
                    </h1>
                    <h2 style="color: grey;">Get Started Now</h2>
                    <!-- <a href="#" class="button">Register</a> -->
                    <div style="padding: 15%;">
                        <h1>Login As:</h1>
                        <v-row>
                            <span class="v-label">Student</span>
                            <v-switch style="margin-top: 20px; margin-left: 10px;" label="Teacher" v-model="userType" inset></v-switch>
                        </v-row>
                        <GoogleLogin alt="Google Sign in" :callback="callback" />
                    </div>
                </v-col>
                <v-col>
                    <img class="hero-img" width="350px" src="@/assets/logo video.gif" />
                </v-col>
            </v-row>
        </section>
    </div>


    <div style="margin-top: 50px;">
        <section class="features">
            <v-row justify="center" style="margin-bottom: 30px;">
                <h1 style="font-size: xx-large; font-family: sans-serif;font-weight: bold;">What is GATE?</h1>
            </v-row>
            <v-row style="justify-content: center;">
                <p style="text-align: center; width: 60%;font-size: large;">
                    GATE is the Graduate Aptitude Test in Engineering, a prestigious examination in India that evaluates
                    candidates'
                    understanding of undergraduate engineering and science subjects. It's used for admission to postgraduate
                    programs and
                    for recruitment in public sector companies.
                    The GATE examination assesses candidates on their understanding of subjects like engineering
                    mathematics, general aptitude, and specific engineering disciplines such as computer science, electrical
                    engineering, mechanical engineering, civil engineering, etc. It is considered one of the most
                    competitive exams in India for engineering graduates.
                </p>
            </v-row>
        </section>
    </div>



    <div style="margin-top: 50px;">
        <section class="features">
            <v-row justify="center" style="margin-bottom: 30px;">
                <h1 style="font-size: xx-large; font-family: sans-serif;font-weight: bold;">Features</h1>
            </v-row>
            <v-row>
                <v-col cols="3" class="text-center">
                    <v-btn icon @click="redirectTo('video-lectures')">
                        <v-icon color="blue">mdi-video</v-icon>
                    </v-btn>
                    <div class="ftr-title">Video Lectures</div>
                    <p> Access to recorded lectures covering various topics to aid in learning and understanding concepts
                        visually</p>
                </v-col>

                <v-col cols="3" class="text-center">
                    <v-btn icon @click="redirectTo('interactive-quizzes')">
                        <v-icon color="purple">mdi-puzzle</v-icon>
                    </v-btn>
                    <div class="ftr-title">Interactive Quizzes</div>
                    <p>Engage in quizzes that test knowledge and understanding, offering immediate feedback to reinforce
                        learning</p>
                </v-col>


                <v-col cols="3" class="text-center">
                    <v-btn icon @click="redirectTo('practice-tests')">
                        <v-icon color="brown">mdi-file-document-multiple</v-icon>
                    </v-btn>
                    <div class="ftr-title">Practice Tests</div>
                    <p>Take simulated tests resembling the actual exam format to assess readiness and identify areas for
                        improvement</p>
                </v-col>

                <v-col cols="3" class="text-center">
                    <v-btn icon @click="redirectTo('study-material')">
                        <v-icon color="green">mdi-book-open</v-icon>
                    </v-btn>
                    <div class="ftr-title">Study Material</div>
                    <p>Access a wide range of study resources including notes, textbooks, and reference materials to support
                        comprehensive exam preparation</p>
                </v-col>
            </v-row>
        </section>
    </div>




    <div style="margin-top: 50px;margin-bottom: 100px;">
        <section class="features">
            <v-row justify="center" style="margin-bottom: 30px;">
                <h1 style="font-size: xx-large; font-family: sans-serif;font-weight: bold;">About Platform</h1>
            </v-row>
            <v-row style="justify-content: center;">
                <p style="text-align: center; width: 50%;">
                    At GATE Learning Platform, we believe that every engineering aspirant deserves the best resources and
                    guidance to
                    excel in the Graduate Aptitude Test in Engineering (GATE). With a mission to empower students to achieve
                    their academic and professional goals, our comprehensive web application offers a holistic approach to
                    GATE preparation.
                </p>
            </v-row>
        </section>
    </div>

    <div style="margin-top: 50px;">
        <section class="features">
            <v-row justify="center" style="margin-bottom: 30px;">
                <h1 style="font-size: xx-large; font-family: sans-serif;font-weight: bold;">Our Clients</h1>
            </v-row>
            <v-row>
                <v-col cols="3" class="text-center">
                    <img src="https://mitaoe.ac.in/assets/images/MITAOE-logo.webp" width="100%" />
                </v-col>
                <v-col cols="3" class="text-center">
                    <img src="https://mitaoe.ac.in/assets/images/MITAOE-logo.webp" width="100%" />
                </v-col>
                <v-col cols="3" class="text-center">
                    <img src="https://mitaoe.ac.in/assets/images/MITAOE-logo.webp" width="100%" />
                </v-col>
                <v-col cols="3" class="text-center">
                    <img src="https://mitaoe.ac.in/assets/images/MITAOE-logo.webp" width="100%" />
                </v-col>
            </v-row>
        </section>
    </div>

    <div style="margin-top: 50px;margin-bottom: 100px;">
        <section class="features">
            <v-row justify="center" style="margin-bottom: 30px;">
                <h1 style="font-size: xx-large; font-family: sans-serif;font-weight: bold;">About Us</h1>
            </v-row>
            <v-row style="justify-content: center;">
                <p style="text-align: center; width: 50%;">
                    Preskilet stands for presenting your soft skill set ! Preskilet is the world’s first professional video
                    platform , At
                    preskilet you can create your professional video resume containing videos about projects and achivements
                    etc. You can
                    share your video profile with potential recruiters for increasing chances of placements. With preskilet
                    your video
                    profile is live at https://preskilet.com/your email .
                </p>
            </v-row>
        </section>
    </div>
</template>
  


<script >
import router from '@/router';
import { decodeCredential } from 'vue3-google-login';
import { aliases, mdi } from 'vuetify/iconsets/mdi'


export default {

    name: 'LoginView',
    methods: {
        callback(response) {

            console.log(decodeCredential(response.credential))
            let userData = decodeCredential(response.credential);

            localStorage.setItem("usr_name", userData.name);
            localStorage.setItem("usr_email", userData.email);
            localStorage.setItem("usr_photo", userData.picture);
            localStorage.setItem("usr_type", this.userType ? "teacher" : "student");


            router.push({ path: "/" });
            //router.go('/');
            //this.$router.replace('/');
        }

    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
    data() {
        return {
           userType:false
        }
    },
    watch:{
        userType(val){

            if(val){
                localStorage.setItem("usr_type", "teacher");
            }else{
                localStorage.setItem("usr_type", "student");
            }
        }
    }

}
</script>

<style>
@media (min-width: 1024px) {
    .herocol {
        column-gap: 20dvb;
    }
}

@media (max-width:610px) {
    .hero-img {
        width: 250px;
    }
}

.ftr-title {
    font-weight: 500;
}
.hero-img{
    padding-top: 2%;
    border-radius: 50%;
}
</style>