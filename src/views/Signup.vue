<template>
  <div class="d-flex align-items-center h-100">
    <div class="container">
      <div class="row flex-column align-items-center mx-2 m-md-0">
        <div class="col-lg-6 p-0">
          <h1 class="mb-4">Signup</h1>
        </div>
        <div class="col-lg-6 register-form  p-md-5 p-3">
          <form @submit.prevent="userRegistration" class="pt-4">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                id="name"
                class="form-control"
                placeholder="Name"
                v-model="user.name"
              />
            </div>
            <div class="form-group">
              <label for="email">E-mail</label>
              <input
                type="email"
                id="email"
                class="form-control"
                placeholder="Email"
                v-model="user.email"
              />
            </div>
            <div class="form-group">
              <label for="passsword">Password</label>
              <input
                type="password"
                id="password"
                class="form-control"
                placeholder="Password"
                v-model="user.password"
              />
            </div>
            <div class="form-group" v-if="error">
              <div class="error">{{ showErrors(error) }}</div>
            </div>

            <button type="submit" class="btn register w-100">Register</button>

            <div class="mt-5">
              <p>
                Already registered?
                <router-link :to="{ name: 'login' }"> Login here </router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default {
  name:"Signup",
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
      },
      error: "",
    };
  },
  methods: {
    userRegistration() {
      const auth = getAuth();

      createUserWithEmailAndPassword(auth, this.user.email, this.user.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // Profile updated!
          updateProfile(auth.currentUser, {
            displayName: this.user.name,
          })
            .then(() => {
              this.$router.push("/");
            })
            .catch((error) => {
              // An error occurred
              const errorCode = error.code;
              const errorMessage = error.message;
              this.error = errorCode;
            });
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