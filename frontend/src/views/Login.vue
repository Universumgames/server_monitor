<template>
    <div class="loginContainer">
        <h1>Login</h1>
        <LoadingScreen v-if="loading" />
        <div>
            <label for="request">Username or Mail</label>
            <input type="text" id="request" placeholder="user@mail.com" v-model="requestMail" />
            <br />

            <h3>or</h3>

            <label for="token">with Token</label>
            <input type="text" id="token" placeholder="token" v-model="token" />
            <br />
            <button @click="login">{{ buttonText }}</button>
        </div>
        <label class="error">{{ errorString }}</label>
        <label class="success">{{ successString }}</label>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loginOrRequestMail } from "../helper/requests"
import LoadingScreen from "../components/LoadingScreen.vue"

const requestMail = ref<string>("")
const token = ref<string>("")
const errorString = ref<string>("")
const loading = ref<boolean>(false)
const successString = ref<string>("")

const route = useRoute()
const router = useRouter()

const buttonText = computed(() => {
    return token.value.length == 0 ? "Request Token" : "Login"
})

onMounted(() => {
    const loginToken = route.query.token
    if (loginToken != undefined) {
        token.value = loginToken as string
        login()
    }
})

const login = async () => {
    if (loading.value) return
    if (token.value === "" && requestMail.value === "") {
        errorString.value = "Please enter a username or mail or a token"
        return
    }
    errorString.value = ""
    loading.value = true
    const result = await loginOrRequestMail({
        requestMailData: requestMail.value === "" ? undefined : requestMail.value,
        token: token.value === "" ? undefined : token.value
    })
    loading.value = false
    if (result) {
        if (token.value === "") successString.value = "Token sent to your mail"
        else router.push({ name: "Home" }) // Assuming you want to redirect to Home after login
    } else {
        errorString.value = token.value === "" ? "User not found" : "Token invalid"
    }
}
</script>

<style>
.loginContainer {
    max-width: 80vw;
    background: var(--secondary-color);
    margin: auto;
    border-radius: 1rem;
    padding: 1rem;
}
</style>

<style scoped>
input {
    background: var(--bg-color);
    width: min(36ch, 80vw);
}
</style>
