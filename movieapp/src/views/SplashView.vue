<script>
import axios from "axios";

export default {
  // Properties returned from data() becomes reactive state
  // and will be exposed on 'this'.
  data() {
    return {
      items: [],
      errors: [],
      loading: false,
      showProfile: false,
    };
  },

  components: {},

  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event listeners in templates.
  methods: {
    //displays user profile images on click of the MovieStream logo
    showProfiles() {
      document.getElementById("msLogoContainer").classList.add("logoCResize");
      document.getElementById("msLogoFigC").style.height = "auto";
      document.getElementById("msLogo").classList.add("logoResize");
      document.getElementById("splash").classList.add("smScroll");
      document.getElementById("profileSection").classList.add("columns");
      document.getElementById("fColumn").style.top = "0%";
      this.showProfile = true;
    },
    //add userid to session storage so the id remains on refresh
    setUserID(id) {
      if (window.localStorage) {
        localStorage.setItem("userID", id);
      }
    },
    //to adjust the layout on different screen sizes
    screenSize() {
      var className = "";
      var width = screen.width;
      var className =
        width > 1400
          ? "xxlScreen"
          : width <= 1400 && width > 1200
          ? "xlScreen"
          : width <= 1200 && width > 992
          ? "lgScreen"
          : width <= 992 && width > 768
          ? "mdScreen"
          : width <= 768 && width > 576
          ? "smScreen"
          : width < 576
          ? "xsScreen"
          : "";

      return className;
    },
  },

  // Lifecycle hooks are called at different stages
  // of a component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {
    //show spinner
    this.loading = true;
    //call rest api to fetch the user profiles
    axios
      .get(this.hostname + this.ordspath + this.customerCollection + "/")
      .then((response) => {
        // JSON responses are automatically parsed.
        this.items = response.data.items;
      })
      .catch((e) => {
        this.errors.push(e);
      })
      .finally(() => (this.loading = false)); //hide spinner
  },
};
</script>

<template>
  <div id="splash" :class="screenSize()">
    <div class="splashScreenBG">
      <div class="splashScreenBGWhip">
        <div id="msLogoContainer" class="msLogoFig">
          <!-- LOGO -->
          <!-- show profiles on click -->
          <div id="msLogoFigC">
            <img
              src="../assets/images/MS-LOGO-Oracle.png"
              id="msLogo"
              @click="showProfiles()"
              class="msLogo"
            />
          </div>

          <!-- LOGO -->
          <!-- USER PROFILES -->

          <div
            class="is-gapless is-vcentered profileColumns"
            id="profileSection"
          >
            <div id="fColumn" class="column is-full fColumn">
              <div class="columns is-rowC">
                <div class="column is-full selectUser titleH">Select User</div>
                <div class="column is-full selectUser">
                  <div class="" v-if="loading">
                    <div class="column is-full selectUser titleH">
                      <div class="loader"></div>
                    </div>
                  </div>
                  <div class="columns profileC" v-else>
                    <!-- loop through profiles -->
                    <div
                      class="column is-one-third profileBlock tooltip"
                      v-for="item of items"
                    >
                      <!-- profile image -->
                      <figure class="image is-100x100">
                        <!-- go to profile details and add user id to local storage -->
                        <router-link
                          :to="{
                            name: 'profileHome',
                            params: {
                              id: item.value.cust_id,
                              name: item.value.first_name,
                            },
                          }"
                          @click="setUserID(item.value.cust_id)"
                        >
                          <img
                            class="is-rounded profileImages"
                            :src="item.value.img_url"
                        /></router-link>
                        <!-- profile name -->
                        <p>
                          {{ item.value.first_name }}
                        </p>
                        <!-- TOOLTIP -->
                        <div class="tooltiptext">
                          <div class="columns">
                            <div class="column is-full is-gapless noPadding">
                              <b class="has-text-weight-bold">{{
                                item.value.first_name +
                                " " +
                                item.value.last_name
                              }}</b>
                            </div>
                          </div>
                          <div class="columns">
                            <div class="column is-full is-gapless noPadding">
                              <b class="has-text-weight-bold"
                                >Customer Loyalty</b
                              ><br />{{ item.value.yrs_customer + " years" }}
                            </div>
                          </div>
                          <div class="columns">
                            <div class="column is-full is-gapless noPadding">
                              <b class="has-text-weight-bold">Home:</b><br />{{
                                item.value.city +
                                ", " +
                                item.value.state_province
                              }}
                              <br />
                            </div>
                          </div>
                        </div>
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- USER PROFILES -->
        </div>
      </div>
    </div>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

/* Hide scrollbar for Chrome, Safari and Opera */
html::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
html {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
body,
html {
  height: 100%;
  margin: 0;
  padding: 0;
  background: #000;
}

#splash {
  height: 100%;
  background: #080c1f;
}

.splashScreenBG {
  background-image: url("@/assets/images/BG.png");
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}

.xsScreen .splashScreenBG {
  overflow: hidden;
}

.smScroll.xsScreen .splashScreenBG,
.smScroll.smScreen .splashScreenBG {
  overflow: scroll;
}

.smScroll.xsScreen .fColumn,
.smScroll.smScreen .fColumn {
  top: 10% !important;
}

.splashScreenBGWhip {
  background: linear-gradient(180deg, rgba(8, 12, 31, 0) 0%, #080c1f 100%);
  height: 100%;
  width: 100%;
  background: rgba(8, 12, 31, 0);
}

@media (max-width: 630px) {
  .splashScreenBGWhip {
    padding-left: 5%;
    padding-right: 5%;
  }
}

.is-vcentered {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
  height: 100%;
  justify-content: center;
  text-align: center;
}
.is-hcentered {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  justify-content: center;
  text-align: center;
}
.msLogoSm {
  max-width: 310px;
}

.msLogoFig {
  height: 100%;
  margin: 0 auto;
  position: absolute;
}

.msLogoFig.msLogo {
  max-width: 630px;
}

.logoC {
  margin-top: 60px;
}

.is-rowC {
  flex-direction: column;
}
.titleH {
  font-size: 32px;
  color: #fff;
}
#msLogoContainer {
  height: 100%;
  position: relative;
  max-width:1600px;
}
#msLogo {
  margin: 0 auto;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 1000;
  left: 0;
  right: 0;
  transition: all 1s linear;
  cursor: pointer;
}

#msLogo.logoResize {
  position: absolute;
  top: 0px;
  transform: scale(0.4);
}

#msLogoFigC {
  height: 100vh;
  text-align: center;
}

.msLogoFigCResize {
  height: auto;
}

@media (max-width: 768px) {
  #msLogo.logoResize {
    position: relative;
  }
}

#profileSection .fColumn {
  top: 100%;
  transition: all 1s linear;
  position: relative;
}

.profileImages {
  max-width: 200px;
  border: 1px solid #fff;
}

.column.profileBlock:hover {
  color: #54a9f5;
}

.profileC img:hover {
  border: 1px solid #54a9f5;
}

.profileC {
  max-width: 60%;
  margin: 0 auto !important;
}

.column.profileBlock {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
  font-size: 21px;
  cursor: pointer;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 245px;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.75) 100%);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 0%;
  text-align: left;
  padding: 12px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.tooltiptext {
  font-size: 14px;
}

.noPadding {
  padding: 8px 10px;
}
</style>
