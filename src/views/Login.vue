<template>
  <div class="d-flex align-items-center h-100">
    <div class="container">
      <div class="row align-items-center flex-column mx-2 m-md-0">
        <div class="col-lg-6 p-0">
          <h1 class="mb-4">Login</h1>
        </div>

        <div class="col-lg-6 login-form  p-md-5 p-3">
          <form @submit.prevent="userLogin" class="pt-4">
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
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                class="form-control"
                v-model="user.password"
                placeholder="Password"
              />
            </div>
            <p class="text-right">
              <router-link :to="{ name: 'forgot-password' }">
                Forgot password?
              </router-link>
            </p>
            <div v-if="error" class="error">{{ showErrors(error) }}</div>

            <button type="submit" class="btn login w-100">Login</button>
            <div class="mt-5">
              <p>
                No account?
                <router-link :to="{ name: 'signup' }">
                  Register here
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      error: "",
    };
  },
  methods: {
    userLogin() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.user.email, this.user.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          // check if previous url exists and then redirect back
          this.$router.push(this.$route.query.redirect || "/");
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