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

<script lang="ts">
    import { Options, Vue } from "vue-class-component"
    import { loginOrRequestMail } from "@/helper/requests"
    import LoadingScreen from "@/components/LoadingScreen.vue"

    @Options({
        components: {
            LoadingScreen
        }
    })
    export default class Login extends Vue {
        requestMail: string = ""
        token: string = ""
        errorString = ""
        loading = false
        successString = ""

        // TODO create the login page
        created() {}

        get buttonText() {
            return this.token == "" ? "Request Token" : "Login"
        }

        async login() {
            if (this.loading) return
            if (this.token == "" && this.requestMail == "") {
                this.errorString = "Please enter a username or mail or a token"
                return
            }
            this.errorString = ""
            this.loading = true
            const result = await loginOrRequestMail({
                requestMailData: this.requestMail == "" ? undefined : this.requestMail,
                token: this.token == "" ? undefined : this.token
            })
            this.loading = false
            if (result) {
                if (this.token == "") this.successString = "Token sent to your mail"
                else this.$emit("login", true)
            } else {
                this.errorString = this.token == "" ? "User not found" : "Token invalid"
            }
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
