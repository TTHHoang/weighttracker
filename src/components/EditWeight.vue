<template>
  <div class="row no-gutters mb-4">
    <div class="mb-4 back col-12">
      <span @click="closeEditComponent"> &lt; Go back to main dashboard</span>
    </div>
    <div class="message mb-3 col-12 px-3" v-show="message">
      <span>{{ message }}</span>
    </div>

    <div class="col-md-3 mb-3 mr-md-3" v-if="sortFilter == 'asc'">
      <button @click="sortDate('desc')" class="btn gradient">
        Recent dates first
      </button>
    </div>
    <div class="col-md-3 mb-3" v-else>
      <button @click="sortDate('asc')" class="btn gradient">
        Oldest dates first
      </button>
    </div>
    <div class="dashboard-component p-4 col-12">
      <div class="row position absolute">
        <span @click="closeEditComponent" class="close-button">
          <b-icon-x> </b-icon-x
        ></span>
      </div>
      <div class="row mt-2">
        <div class="col-md-12 mb-2">
          <h2>List of weights</h2>
        </div>
        <div class="col-sm-3"><span class="font-weight-bold">Date</span></div>
        <div class="col-sm-3">
          <span class="font-weight-bold">Weight</span>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12" v-show="list == ''">
          <p>The list is empty. Try adding data.</p>
        </div>
        <div
          class="col-12 mb-3 list-item"
          v-for="listItem in reverseStartList"
          :key="listItem.id"
          v-show="!showUpdateForm"
        >
          <div class="row align-items-center">
            <div class="col-sm-3">
              <span>{{ correctDate(listItem.date) }}</span>
            </div>
            <div class="col-sm-3">
              <span> {{ listItem.weight }} kg</span>
            </div>
            <div class="col-sm-6 d-flex justify-content-between mt-3 mt-sm-0">
              <button
                @click="
                  (showUpdateForm = !showUpdateForm),
                    (currentListId = listItem.id),
                    (currentWeight = listItem.weight),
                    (currentDate = listItem.date),
                    (message = '')
                "
                v-show="!showUpdateForm"
                class="btn gradient mr-3"
              >
                Update value
              </button>
              <span
                class="delete-item"
                @click="
                  (deleteModal = !deleteModal), (currentListId = listItem.id)
                "
              >
                <b-icon-x> </b-icon-x>
              </span>
            </div>
          </div>
        </div>
        <div class="col-12" v-show="showUpdateForm">
          <div class="row">
            <div class="col-sm-3">
              <span>{{ correctDate(currentDate) }} </span>
            </div>
            <div class="col-sm-3">
              <span> {{ currentWeight }} kg</span>
            </div>

            <div class="col-12 my-4">
              <form @submit.prevent="">
                <div class="form-group">
                  <label for="weight">New weight</label>
                  <input
                    type="text"
                    placeholder="weight"
                    id="weight"
                    class="form-control"
                    required
                    @keypress="IsNumber"
                    v-model="newWeight"
                    maxlength="5"
                  />
                </div>
                <div class="row mt-4">
                  <div class="col-md-6">
                    <button
                      @click="(showUpdateForm = false), (newWeight = '')"
                      class="btn gradient"
                    >
                      Cancel
                    </button>
                  </div>
                  <div class="col-md-6">
                    <button
                      @click="
                        (showUpdateForm = false), updateWeight(currentListId)
                      "
                      class="btn gradient"
                      :disabled="!newWeight"
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
              <button @click="deleteWeight(currentListId)" class="btn gradient">
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
  props: ["id", "list", "listItem"],
  name: "EditWeight",
  data() {
    return {
      currentWeight: "",
      currentDate: "",
      currentListId: "",
      newWeight: "",
      userId: this.id,
      showUpdateForm: false,
      message: "",
      deleteModal: false,
      // always starts at desc
      sortFilter: "desc",
    };
  },

  computed: {
    reverseStartList() {
      return [...this.list].reverse();
    },
  },
  methods: {
    sortDate(currentState) {
      this.sortFilter = currentState;
      this.list.reverse();
    },
    correctDate(date) {
      return new Date(date).toLocaleString("nl-NL", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    },
    closeEditComponent() {
      this.message = "";
      this.$parent.hideEditWeightComponent();
    },
    IsNumber(event) {
      if (!/\d/.test(event.key) && event.key !== ".")
        return event.preventDefault();
    },
    // async getWeightData(filter) {
    //   this.$emit("getWeightData", filter);
    // },
    formValidation(field) {
      let pattern = /^[0-9]+(\.)?[0-9]*$/;
      let result = pattern.test(field);

      return result;
    },

    async updateWeight(docId) {
      
      if (this.formValidation(this.newWeight) == true) {
        try {
          this.$emit("updateWeight", docId, this.newWeight);
          this.message = "Weight has been changed.";
          this.newWeight = "";
        } catch (error) {
          this.message = "Something went wrong please try again.";
        }
      } else {
        this.message = "Please check your field on errors."
      }
    },

    async deleteWeight(currentListId) {
      try {
        this.$emit("deleteWeight", currentListId);
        this.message = "Your item has been successfully deleted.";
        this.deleteModal = false;
        this.currentFilter = "desc";
        this.sortDate("desc");
      } catch (error) {
        this.message = "Something went wrong please try again.";
      }
    },
  },
};
</script>