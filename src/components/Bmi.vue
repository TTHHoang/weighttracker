<template>
  <div class="row no-gutters mb-4">
    <div class="mb-4 back col-12">
      <span @click="closeComponent"> &lt; Go back to main dashboard </span>
    </div>
    <div class="message mb-3 col-12 px-3" v-show="message">
      <span>{{ message }}</span>
    </div>

    <div class="dashboard-component p-4 col-12">
      <h2 v-show="currentBmi">Current BMI {{ currentBmi }}</h2>
      <h2 v-show="!currentBmi">Current BMI</h2>
      <div class="row position absolute">
        <span @click="closeComponent" class="close-button">
          <b-icon-x> </b-icon-x
        ></span>
      </div>
      <div class="row">
        <div class="col-12" v-show="!height">
          <p>
            To calculate your bmi, you must add a height and weight. The weight
            can be added in the weight component in the main page. Click the
            button below to add a height.
          </p>

          <button
            class="btn gradient"
            @click="showAddForm = !showAddForm"
            v-show="!showAddForm && !showUpdateForm"
          >
            Add height
          </button>
        </div>
        <div class="col-12" v-show="showUpdateForm">
          <div class="row">
            <div class="col-12 my-4">
              <form @submit.prevent="">
                <div class="form-group">
                  <label for="height">New height</label>
                  <input
                    type="text"
                    placeholder="height"
                    id="height"
                    class="form-control"
                    required
                    @keypress="IsNumber"
                    v-model="currentHeight"
                    maxlength="5"
                  />
                </div>
                <div class="row mt-4">
                  <div class="col-md-6">
                    <button
                      @click="(showUpdateForm = false), (currentHeight = '')"
                      class="btn gradient"
                    >
                      Cancel
                    </button>
                  </div>
                  <div class="col-md-6">
                    <button
                      @click="updateHeight"
                      class="btn gradient"
                      :disabled="!height"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="col-12" v-show="showAddForm">
          <div class="row">
            <div class="col-sm-12" v-show="height">
              <span>Current height: {{ height }} </span>
            </div>

            <div class="col-12 my-4">
              <form @submit.prevent="">
                <div class="form-group">
                  <label for="height">New height</label>
                  <input
                    type="text"
                    placeholder="height"
                    id="height"
                    class="form-control"
                    required
                    @keypress="IsNumber"
                    v-model="currentHeight"
                    maxlength="5"
                  />
                </div>
                <div class="row mt-4">
                  <div class="col-md-6">
                    <button
                      @click="(showAddForm = false), (height = '')"
                      class="btn gradient"
                    >
                      Cancel
                    </button>
                  </div>
                  <div class="col-md-6">
                    <button
                      @click="addHeight"
                      class="btn gradient"
                      :disabled="!currentHeight"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        class="row align-items-center list-item"
        v-show="!showUpdateForm && height"
      >
        <div class="col-12 mb-4">
          <p>
            To calculate your bmi, you must add a height and weight. The weight
            can be added in the weight component in the main page.
            </p>
        </div>
        <div class="col-md-6">
          <p class="mb-0">Current height is {{ height }} cm</p>
        </div>
        <div class="col-md-6 d-flex justify-content-between mt-3 mt-sm-0">
          <button
            class="btn gradient"
            @click="showUpdateForm = !showUpdateForm"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Bmi",
  props: ["height", "currentBmi"],
  data() {
    return {
      message: "",
      showAddForm: false,
      currentHeight: "",
      showUpdateForm: false,
      bmi: "",
      weightList: this.list,
    };
  },
  async mounted() {
    await this.getHeight();
  },
  methods: {
    IsNumber(event) {
      if (!/\d/.test(event.key)) return event.preventDefault();
    },
    closeComponent() {
      this.message = "";
      this.$parent.hideBmiComponent();
    },
    async addHeight() {
      try {
        this.$emit("addHeight", this.currentHeight);

        this.message = "You have added a new item.";
        this.currentHeight = "";
        this.showAddForm = false;
      } catch (e) {
        console.error("Error adding document: ", e);
        this.message = "An error has occured. Please try again.";
      }
    },
    async updateHeight() {
      try {
        this.$emit("updateHeight", this.currentHeight);
        this.message = "Your height has been updated";
        this.currentHeight = "";
        this.showUpdateForm = false;
      } catch (e) {
        console.error("Error adding document: ", e);
        this.message = "An error has occured. Please try again.";
      }
    },
    async getHeight() {
      try {
        this.$emit("getHeight");
      } catch (error) {
        console.log("no height found");
      }
    },
    async getBmi() {
      this.$emit("getBmi");
    },
  },
};
</script>