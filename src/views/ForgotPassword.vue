<template>
  <div class="d-flex align-items-center h-100">
    <div class="container">
      <div class="row d-flex flex-column align-items-center mx-2 m-md-0">
        <div class="col-lg-6 p-0">
          <h1 class="mb-4">Reset password</h1>
        </div>
        <div class="col-lg-6 login-form p-md-5 p-3">
          <form @submit.prevent="resetPassword" class="pt-4">
            <div class="form-group">
              <label for="email">E-mail</label>
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="user.email"
                placeholder="E-mail"
              />
            </div>
            <div v-if="error" class="error">{{ showErrors(error) }}</div>

            <button type="submit" class="btn reset-password w-100">
              Reset password
            </button>
            <div class="mt-5">
              <p class="text-right">
               
                <router-link :to="{ name: 'login' }">
                 Go back to login
                </router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default {
  data() {
    return {
      user: {
        email: "",
      },
      error: "",
    };
  },
  methods: {
    resetPassword() {
      const auth = getAuth();
      sendPasswordResetEmail(auth, this.user.email)
        .then(() => {
          // Password reset email sent!
          alert("A password reset email has been sent.");
          this.$router.push("/login");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.error = errorCode;
        });
    },
  },
};
</script>

<style>
</style>