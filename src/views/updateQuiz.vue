<template>
  <v-container class="update-quiz-container">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-h5">Update Quiz</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="quiz.quizName"
                label="Quiz Name"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-text-field
                v-model="quiz.subject"
                label="Subject"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-text-field
                v-model="quiz.marksPerQuestion"
                label="Marks Per Question"
                type="number"
                :rules="[rules.required, rules.numeric]"
                required
              ></v-text-field>

              <v-text-field
                v-model="quiz.timeLimit"
                label="Time Limit (minutes)"
                type="number"
                :rules="[rules.required, rules.numeric]"
                required
              ></v-text-field>

              <v-divider></v-divider>

              <v-row v-for="(question, index) in quiz.questions" :key="index">
                <v-col cols="12">
                  <v-text-field
                    v-model="question.text"
                    label="Question"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </v-col>

                <v-col v-for="(answer, i) in question.answers" :key="i" cols="6">
                  <v-text-field
                    v-model="question.answers[i]"
                    :label="'Answer ' + (i + 1)"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="question.correctAnswerIndex"
                    :items="question.answers.map((_, i) => ({ text: `Answer ${i + 1}`, value: i }))"
                    item-text="text"
                    item-value="value"
                    label="Correct Answer"
                    :rules="[rules.required]"
                    required
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="question.solution"
                    label="Solution"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-file-input
                    v-model="question.imageFile"
                    label="Upload Image"
                    accept="image/*"
                    @change="onImageChange($event, index)"
                  ></v-file-input>

                  <v-row v-if="question.imageURL">
                    <v-col cols="12">
                      <v-img :src="question.imageURL" max-width="200" max-height="200"></v-img>
                    </v-col>

                    <v-col cols="12">
                      <v-btn @click="removeImage(index)" color="error">Remove Image</v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-btn @click="addQuestion" class="ma-2" color="primary">
                Add Question
              </v-btn>

              <v-btn
                @click="removeQuestion"
                class="ma-2"
                color="error"
                v-if="quiz.questions.length > 1"
              >
                Remove Last Question
              </v-btn>

              <v-btn @click="submit" class="mt-4" color="success" :disabled="valid">
                Update Quiz
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { storage } from '@/main'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const router = useRouter()
const route = useRoute()
const quizId = route.params.quizId
const valid = ref(false)

const rules = {
  required: (value) => !!value || 'Required.',
  numeric: (value) => !isNaN(Number(value)) || 'Must be a number.'
}

const quiz = reactive({
  quizName: '',
  subject: '',
  marksPerQuestion: 1,
  timeLimit: 60,
  questions: [
    {
      text: '',
      answers: ['', '', '', ''],
      correctAnswerIndex: 0,
      solution: '',
      imageURL: '',
      imageFile: null,
    }
  ]
})

const fetchQuiz = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/quizzes/${quizId}`)
    Object.assign(quiz, response.data)
  } catch (error) {
    console.error('Error fetching quiz:', error)
  }
}

const addQuestion = () => {
  quiz.questions.push({
    text: '',
    answers: ['', '', '', ''],
    correctAnswerIndex: 0,
    solution: '',
    imageURL: '',
    imageFile: null,
  })
}

const removeQuestion = () => {
  if (quiz.questions.length > 1) {
    quiz.questions.pop()
  }
}

const onImageChange = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    quiz.questions[index].imageFile = file
    const reader = new FileReader()
    reader.onload = (e) => {
      quiz.questions[index].imageURL = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = async (index) => {
  const imageUrl = quiz.questions[index].imageURL
  if (imageUrl.startsWith('https://firebasestorage.googleapis.com')) {
    // Remove image from Firebase Storage
    const fileRef = storageRef(storage, imageUrl)
    try {
      await deleteObject(fileRef)
      console.log('File deleted from Firebase Storage')
    } catch (error) {
      console.error('Error deleting file from Firebase Storage:', error)
    }
  }
  // Clear image details from the quiz object
  quiz.questions[index].imageURL = ''
  quiz.questions[index].imageFile = null
}

const submit = async () => {
  try {
    for (const [index, question] of quiz.questions.entries()) {
      if (question.imageFile) {
        const fileRef = storageRef(storage, `quiz_images/${question.imageFile.name}`)
        await uploadBytes(fileRef, question.imageFile)
        const downloadURL = await getDownloadURL(fileRef)
        question.imageURL = downloadURL
      }
    }

    await axios.put(`http://localhost:3000/quizzes/${quizId}`, quiz)
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Error updating quiz:', error)
  }
}

onMounted(() => {
  fetchQuiz()
})
</script>

<style scoped>
.update-quiz-container {
  margin-top: 20px;
}

.text-h5 {
  font-weight: bold;
}

.ma-2 {
  margin: 8px !important;
}

.mt-4 {
  margin-top: 0px !important;
}
</style>
