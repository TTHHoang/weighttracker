<template>
  <div class="row no-gutters mb-4">
    <div class="mb-4 back col-12">
      <span @click="closeComponent"> &lt; Go back to main dashboard </span>
    </div>

    <div class="message mb-3 col-12 px-3" v-show="message">
      <span>{{ message }}</span>
    </div>

    <div class="col-12 dashboard-component p-4">
      <h2>Goal weight</h2>
      <div class="row position absolute">
        <span @click="closeComponent" class="close-button">
          <b-icon-x> </b-icon-x
        ></span>
      </div>
      <div
        class="row align-items-center"
        v-show="!showUpdateForm && goalWeight"
      >
        <div class="col-md-6">
          <p class="mb-0">Current goal weight is {{ goalWeight }} kg</p>
        </div>
        <div class="col-md-6 d-flex justify-content-between mt-3 mt-sm-0">
          <button
            class="btn gradient mr-3"
            @click="showUpdateForm = !showUpdateForm"
          >
            Change
          </button>
          <span class="delete-item" @click="deleteModal = !deleteModal">
            <b-icon-x> </b-icon-x>
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-12" v-show="!goalWeight">
          <p>No goal weight has been added. Please add one.</p>

          <button
            class="btn gradient"
            @click="showAddForm = !showAddForm"
            v-show="!showAddForm && !showUpdateForm"
          >
            Add goal weight
          </button>
        </div>
        <div class="col-12" v-show="showUpdateForm">
          <div class="row">
            <div class="col-sm-12" v-show="goalWeight">
              <span>Current goal weight is {{ goalWeight }} kg</span>
            </div>

            <div class="col-12 my-4">
              <form @submit.prevent="">
                <div class="form-group">
                  <label for="weight">New goal weight</label>
                  <input
                    type="text"
                    placeholder="weight"
                    id="weight"
                    class="form-control"
                    required
                    @keypress="IsNumber"
                    v-model="currentWeightGoal"
                    maxlength="5"
                  />
                </div>
                <div class="row mt-4">
                  <div class="col-md-6">
                    <button
                      @click="
                        (showUpdateForm = false), (currentWeightGoal = '')
                      "
                      class="btn gradient"
                    >
                      Cancel
                    </button>
                  </div>
                  <div class="col-md-6">
                    <button
                      @click="updateGoalWeight"
                      class="btn gradient"
                      :disabled="!currentWeightGoal"
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
            <div class="col-sm-12" v-show="goalWeight">
              <span>Current goal weight is {{ goalWeight }} kg</span>
            </div>

            <div class="col-12 my-4">
              <form @submit.prevent="">
                <div class="form-group">
                  <label for="weight">New goal weight</label>
                  <input
                    type="text"
                    placeholder="weight"
                    id="weight"
                    class="form-control"
                    required
                    @keypress="IsNumber"
                    v-model="currentWeightGoal"
                    maxlength="5"
                  />
                </div>
                <div class="row mt-4">
                  <div class="col-md-6">
                    <button
                      @click="(showAddForm = false), (currentWeightGoal = '')"
                      class="btn gradient"
                    >
                      Cancel
                    </button>
                  </div>
                  <div class="col-md-6">
                    <button
                      @click="addGoalWeight"
                      class="btn gradient"
                      :disabled="!currentWeightGoal"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="col-12">
          <!-- modal verify delete  -->
          <div v-show="deleteModal" class="delete-modal">
            <h2>Delete item</h2>

            <p>Are you sure you want to delete this item?</p>
            <div class="d-flex flex-md-row flex-column">
              <button
                @click="deleteModal = !deleteModal"
                class="btn gradient mr-2 mb-md-0 mb-2"
              >
                Cancel
              </button>
              <button @click="deleteGoalWeight()" class="btn gradient">
                Delete
              </button>
            </div>
          </div>
          <div class="overlay" v-show="deleteModal"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoalWeight",
  props: ["id", "goalWeight"],
  data() {
    return {
      message: "",
      newWeight: "",
      showUpdateForm: false,
      userId: this.id,
      currentWeightGoal: "",
      showAddForm: false,
      deleteModal: false,
    };
  },
  async mounted() {
    await this.getGoalWeight();
  },
  // watch: {
  //   // Creating function for
  //   // input component
  //   currentWeightGoal: function (val) {
  //     this.currentWeightGoal = val;
  //     console.log(val);
  //     console.log(this.currentWeightGoal);
  //   },
  // },

  methods: {
    IsNumber(event) {
      if (!/\d/.test(event.key) && event.key !== ".")
        return event.preventDefault();
    },
    closeComponent() {
      this.message = "";
      this.$parent.hideGoalWeightComponent();
    },
    async getGoalWeight() {
      this.$emit("getGoalWeight");
    },

    async addGoalWeight() {
      let weightGoal = this.currentWeightGoal;
      let pattern = /^[0-9]+(\.)?[0-9]*$/;
      let result = pattern.test(weightGoal);

      if (result == true) {
        try {
          this.$emit("addGoalWeight", this.currentWeightGoal);

          this.message = "You have added a new item.";
          this.currentWeightGoal = "";
          this.showAddForm = false;
        } catch (e) {
          console.error("Error adding document: ", e);
          this.message = "An error has occured. Please try again.";
        }
      } else {
        this.message = "Please check your field on mistakes.";
      }
    },

    async updateGoalWeight() {
      try {
        this.$emit("updateGoalWeight", this.currentWeightGoal);
        this.message = "Your goal weight has been updated";
        this.currentWeightGoal = "";
        this.showUpdateForm = false;
      } catch (e) {
        console.error("Error adding document: ", e);
        this.message = "An error has occured. Please try again.";
      }
    },
    async deleteGoalWeight() {
      try {
        this.$emit("deleteGoalWeight");
        this.message = "Your item has been successfully deleted.";
        this.deleteModal = false;
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    },
  },
};
</script>