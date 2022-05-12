<script>
import axios from "axios";
import Toggle from "@vueform/toggle";
import "@splidejs/splide/dist/css/splide.min.css";
//close notifications and profiles if clicked outside
window.addEventListener("click", function (e) {
  if (document.getElementById("showNotifications").contains(e.target)) {
  } else {
    document.getElementById("showNotifications").classList.remove("is-active");
  }
  if (document.getElementById("showProfiles").contains(e.target)) {
  } else {
    document.getElementById("showProfiles").classList.remove("is-active");
  }
});
export default {
  // Properties returned from data() becomes reactive state
  // and will be exposed on `this`.
  data() {
    return {
      items: [],
      errors: [],
      enabled: false,
      userid: localStorage.getItem("userID"),
      showSearch: false,
      open: false,
      notifications: [],
      loading: false,
      profiles: [],
      notificationsloading: false,
      profilesloading: false,
      movieDetails: [],
      userProfile: {},
      highlightMovie: "",
      movieloading: false,
      director: [],
      detailLoaded: false,
      movieDetailloading: false,
      learnMore: [],
      learnMoreloading: false,
    };
  },

  components: { Toggle },

  props: {
    id: Number,
    name: String,
  },

  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event listeners in templates.
  methods: {
    //scroll genre links to genre region
    scrollToContent(item) {
      window.scrollTo(
        0,
        document.getElementById(item).getBoundingClientRect().y +
          window.scrollY -
          120
      );
    },
    //show hide search input
    toggleSearch() {
      if (this.showSearch == true) {
        this.showSearch = false;
      } else {
        this.showSearch = true;
      }
    },
    //hide leam more slider
    toggle() {
      this.open = !this.open;
      if (!this.open) {
        this.enabled = false;
        document.getElementById("navigationMenu").style.minWidth = "auto";
        document.getElementById("navbarBasicExample").style.flexGrow = "1";
        document
          .getElementById("navbarBasicExample")
          .classList.remove("resizeNav");
      } else {
        this.enabled = true;

        document.getElementById("navbarBasicExample").style.flexGrow = "0";
        document
          .getElementById("navbarBasicExample")
          .classList.add("resizeNav");
      }
    },
    //get user profiles
    getUserProfile() {
      axios
        .get(
          this.hostname +
            this.ordspath +
            this.customerCollection +
            "/" +
            localStorage.getItem("userID")
        )
        .then((response) => {
          // JSON responses are automatically parsed.
          this.userProfile = response.data;
        })
        .catch((e) => {
          this.errors.push(e);
        })
        .finally();
    },
    //show notifications
    showNotifications() {
      this.getNotifications();
      document
        .getElementById("showNotifications")
        .classList.toggle("is-active");
    },
    //hide notifications
    closeNotifications() {
      document
        .getElementById("showNotifications")
        .classList.toggle("is-active");
    },
    //hide profile
    closeProfiles() {
      document.getElementById("showProfiles").classList.toggle("is-active");
    },
    //show profiles
    showProfiles() {
      this.getCustomerCollection();
      document.getElementById("showProfiles").classList.toggle("is-active");
    },
    //change profile. update local storage user id
    changeProfile(id) {
      this.userid = "";
      if (window.localStorage) {
        localStorage.setItem("userID", id);
      }
      this.userid = id;
      this.populateData();
      this.getUserProfile();
      this.closeProfiles();
    },
    //get customer collection from REST api
    getCustomerCollection() {
      this.profiles = [];
      this.profilesloading = true;
      axios
        .get(this.hostname + this.ordspath + this.customerCollection + "/")
        .then((response) => {
          // JSON responses are automatically parsed.
          this.profiles = response.data.items;
        })
        .catch((e) => {
          this.errors.push(e);
        })
        .finally(() => (this.profilesloading = false));
    },
    //get learn more links
    getWorkshopLinks() {
      this.learnMore = [];
      this.learnMoreloading = true;
      this.open = !this.open;
      axios
        .get(this.hostname + this.ordspath + this.learnMoreCollection)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.learnMore = response.data.items;
        })
        .catch((e) => {
          this.errors.push(e);
        })
        .finally(() => {
          this.learnMoreloading = false;
          if (!this.open) {
            this.enabled = false;
            document.getElementById("navigationMenu").style.minWidth = "auto";
            document.getElementById("navbarBasicExample").style.flexGrow = "1";
            document
              .getElementById("navbarBasicExample")
              .classList.remove("resizeNav");
          } else {
            this.enabled = true;

            document.getElementById("navbarBasicExample").style.flexGrow = "0";
            document
              .getElementById("navbarBasicExample")
              .classList.add("resizeNav");
          }
        });
    },
    //get notifications
    getNotifications() {
      this.notifications = [];
      this.notificationsloading = true;
      axios
        .get(
          this.hostname +
            this.ordspath +
            this.notificationCollection +
            "/" +
            localStorage.getItem("userID")
        )
        .then((response) => {
          // JSON responses are automatically parsed.
          this.notifications = response.data;
        })
        .catch((e) => {
          this.errors.push(e);
        })
        .finally(() => (this.notificationsloading = false));
    },
    //populate shelves
    populateData() {
      this.items = [];
      this.loading = true;
      this.movieloading = true;
      var movieid;
      axios
        .all([
          axios.get(
            this.hostname +
              this.ordspath +
              this.landingPage +
              "/" +
              localStorage.getItem("userID")
          ),
        ])
        .then(
          axios.spread((response1) => {
            this.items = response1.data;
            for (var i = 0; i < response1.data.shelves.length; i++) {
              if (
                response1.data.shelves[i]["name"] == response1.data.genres[0]
              ) {
                movieid = response1.data.shelves[i]["movies"][0]["movie_id"];
              }
            }

            return movieid;
          })
        )
        .then((id) => {
          axios
            .get(
              this.hostname +
                this.ordspath +
                this.movieDetailsCollection +
                "/" +
                id
            )
            .then((response) => {
              // JSON responses are automatically parsed.
              console.log("**assigning data" + JSON.stringify(response.data));
              this.highlightMovie = response.data;
              for (var i = 0; i < response.data.crew.length; i++) {
                if (response.data.crew[i]["job"] == "director") {
                  this.director = response.data.crew[i]["names"];
                }
              }
            })
            .catch((e) => {
              this.errors.push(e);
            });
        })
        .catch((e) => {
          this.errors.push(e);
        })
        .finally(() => {
          this.loading = false;
          this.movieloading = false;
        });
    },
    //show subnav for mobile
    showSubnav() {
      document
        .getElementById("navbarBasicExample")
        .classList.toggle("is-active");
      document.getElementById("navBurger").classList.toggle("is-active");
    },
    //open movie details modal
    openMovieModal(id) {
      if (
        document.getElementById("movieDetails").classList.contains("is-active")
      ) {
        document.getElementById("movieDetails").classList.remove("is-active");
      }
      document.getElementById("movieDetails").classList.add("is-active");
    },
    //open movie
    openMovie(id) {
      this.movieDetailloading = true;
      this.movieDetails = [];
      this.detailLoaded = false;
      axios
        .get(
          this.hostname + this.ordspath + this.movieDetailsCollection + "/" + id
        )
        .then((response) => {
          // JSON responses are automatically parsed.
          this.movieDetails = response.data;
          return this.movieDetails;
        })
        .catch((e) => {
          this.errors.push(e);
        })
        .finally(() => {
          this.detailLoaded = true;
          this.movieDetailloading = false;
          this.openMovieModal(id);
        });
    },
    //hide movie
    hideMovie() {
      document.getElementById("movieDetails").classList.toggle("is-active");
      this.movieDetails = [];
    },
    //format run time
    getRunTime(n) {
      var num = n;
      var hours = num / 60;
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      return rhours + "hr " + rminutes + "min";
    },
    sortedArray(array) {
      return array.sort(function (a, b) {
        return a.value.id - b.value.id;
      });
    },
  },

  // Lifecycle hooks are called at different stages
  // of a component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {
    this.getUserProfile();
    this.populateData();
  },
};
</script>

<template>
  <!-- LEARN MORE SLIDER -->
  <div class="slidein" :class="open ? 'open' : ''">
    <div class="slideinHeaderBar"></div>
    <div class="columns is-gapless">
      <!-- CLOSE BUTTON -->
      <a @click="toggle()" class="closeIcon"
        ><i class="fa-solid fa-xmark"></i
      ></a>
      <!-- LEARN MORE SLIDER -->
      <div class="column">
        <div class="columns is-gapless slideinHeader is-mobile">
          <div class="column is-narrow">
            <img class="o-logo" src="../assets/images/icon-oracle-square.png" />
          </div>
          <!-- LOGO -->
          <div class="column OCIText">
            <span class="OCIText1">ORACLE CLOUD</span><br /><span
              class="OCIText2"
              >Infrastructure</span
            >
          </div>
          <!-- LOGO -->
          <!-- LEARN MORE LINK -->
          <div class="column learnMoreC">
            <a href="#" class="learnMore">Learn More</a>
          </div>
          <!-- LEARN MORE LINK -->
        </div>
      </div>
    </div>
    <div class="slideininner">
      <div class="loader" v-if="learnMoreloading"></div>
      <!-- LOOP THROUGH LEARN MORE ITEMS -->
      <div
        class="columns is-gapless sliderSections"
        v-for="learnMoreItem of sortedArray(learnMore)"
      >
        <div class="column slideininnerC">
          <div class="mainTitle">{{ learnMoreItem.value.title }}</div>
          <p>
            {{ learnMoreItem.value.description }}
          </p>
          <div class="ociButton gradientB">
            <img src="../assets/images/cloud-link.png" />
            {{ learnMoreItem.value.linkDescription }}<br /><br /><a
              :href="learnMoreItem.value.link"
              target="_blank"
              >{{ learnMoreItem.value.linkTitle }}
              <i class="fa-solid fa-right-long longArrow"></i
            ></a>
          </div>
        </div>
      </div>
      <!-- LOOP THROUGH LEARN MORE ITEMS -->
    </div>
  </div>
  <!-- LEARN MORE SLIDER ENDS -->
  <!-- MULTIPLE BG LAYERS TO SET THE BACKGROUND COLORS -->
  <div class="bgLayer1">
    <div class="bgLayer2">
      <div class="bgLayer3">
        <!-- HEADER -->
        <div class="header">
          <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
              <!-- O LOGO -->
              <router-link
                class="navbar-item"
                :to="{
                  name: 'home',
                }"
              >
                <img class="o-logo" src="../assets/images/icon-oracle.png" />
              </router-link>
              <!-- O LOGO -->
              <!-- MOVIESTREAM LOGO -->
              <router-link
                class="navbar-item"
                :to="{
                  name: 'home',
                }"
                v-if="!enabled"
                ><img class="mslogo" src="../assets/images/MS-LOGO.png" />
              </router-link>
              <!-- MOVIESTREAM LOGO -->
              <!-- MOVIESTREAM LOGO SMALL WHEN LEARN MORE SLIDER IS OPEN -->
              <router-link
                class="navbar-item"
                :to="{
                  name: 'home',
                }"
                v-if="enabled"
                ><img class="mslogo" src="../assets/images/MS-LOGO-small.png" />
              </router-link>
              <!-- MOVIESTREAM LOGO SMALL -->
              <!-- HAMBURGER MENU FOR MOBILE -->
              <a
                role="button"
                class="navbar-burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                @click="showSubnav($event)"
                id="navBurger"
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </a>
              <!-- HAMBURGER MENU FOR MOBILE -->
            </div>

            <div id="navbarBasicExample" class="navbar-menu">
              <!-- MAIN NAV -->
              <div id="navigationMenu" class="navbar-start navigationMenu">
                <a class="navbar-item"> TV Shows</a>

                <a class="navbar-item"> Movies </a>

                <a class="navbar-item">Recently Added</a>
              </div>
              <!-- MAIN NAV -->

              <div class="navbar-end">
                <!-- SEARCH ICON -->
                <div
                  class="navbar-item"
                  v-if="!showSearch"
                  @click="toggleSearch()"
                >
                  <span class="icon searchIcon">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </span>
                </div>
                <!-- SEARCH ICON -->
                <!-- SEARCH BOX ON TOGGLE -->
                <div class="navbar-item" v-else>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      type="text"
                      placeholder="Rounded input"
                      class="input is-rounded searchbox"
                    />
                    <span class="icon is-small is-left">
                      <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                  </div>
                  <span
                    class="icon is-small is-right closeIcon"
                    @click="toggleSearch()"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </span>
                </div>
                <!-- SEARCH BOX ON TOGGLE -->
                <!-- NOTIFICATIONS -->
                <div class="navbar-item">
                  <div id="showNotifications" class="dropdown">
                    <div class="dropdown-trigger">
                      <!-- BELL ICON WITH COUNT-->
                      <a @click="showNotifications()">
                        <span class="icon">
                          <i class="fa-solid fa-bell"></i>
                        </span>
                        <span
                          class="notificationCount"
                          v-if="this.items.notification_count"
                          >{{ this.items.notification_count }}</span
                        ></a
                      >
                      <!-- BELL ICON WITH COUNT -->
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                      <!-- IF NO NOTIFICATIONS -->
                      <div
                        class="dropdown-content"
                        v-if="!this.items.notification_count"
                        tabindex="0"
                        @focusout="closeNotifications"
                      >
                        <div class="notificationsHeader">Notifications</div>
                        <hr class="navbar-divider" />
                        <div class="columns notificationDetails is-gapless">
                          <div class="column notificationDesc nonotify">
                            No new notifications
                          </div>
                        </div>
                      </div>
                      <!-- IF NO NOTIFICATIONS -->
                      <!-- IF NOTIFICATIONS -->
                      <div class="dropdown-content" v-else>
                        <div class="notificationsHeader">Notifications</div>
                        <hr class="navbar-divider" />
                        <div class="loader" v-if="notificationsloading"></div>
                        <!-- <div v-for="notification of notifications"> -->
                        <div class="columns notificationDetails is-gapless">
                          <div class="column is-narrow no-padding notifImg">
                            <img class="" :src="notifications.img_url" />
                          </div>
                          <div class="column notificationDesc">
                            <div class="row1">{{ notifications.subject }}</div>
                            <div class="row2">
                              {{ notifications.message }}
                            </div>
                            <div class="row3">
                              <i class="fa-solid fa-location-dot"></i>
                              Directions
                            </div>
                          </div>
                        </div>
                        <div class="columns is-gapless">
                          <div class="column notificationButton">
                            <button class="button redeem">REDEEM</button>
                          </div>
                        </div>
                        <!-- </div> -->
                      </div>
                      <!-- IF NOTIFICATIONS -->
                    </div>
                  </div>
                </div>
                <!-- NOTIFICATIONS END -->
                <!-- PROFILES -->
                <div class="navbar-item">
                  <div id="showProfiles" class="dropdown">
                    <!-- SHOW MORE PROFILES -->
                    <div class="dropdown-trigger" v-if="userProfile.img_url">
                      <a @click="showProfiles">
                        <figure class="image">
                          <img
                            class="is-rounded profileImagesSml"
                            :src="userProfile.img_url"
                          />
                        </figure>
                      </a>
                    </div>
                    <!-- SHOW MORE PROFILES -->
                    <div
                      class="dropdown-menu"
                      id="dropdown-menu"
                      role="menu"
                      @focusout="closeProfiles"
                    >
                      <div class="dropdown-content">
                        <div class="loader" v-if="profilesloading"></div>
                        <div
                          class="columns is-gapless profileRows"
                          v-for="profile of profiles"
                          :key="profile.value.cust_id"
                        >
                          <div
                            class="column"
                            v-if="profile.value.cust_id != this.userid"
                          >
                            <div
                              class="columns is-gapless profileRow"
                              @click="changeProfile(profile.value.cust_id)"
                            >
                              <div class="column is-narrow">
                                <figure class="image">
                                  <img
                                    class="is-rounded profileImagesSml"
                                    :src="profile.value.img_url"
                                  />
                                </figure>
                              </div>
                              <div class="column profileName">
                                {{ profile.value.first_name }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr class="navbar-divider" />

                        <div class="columns signOut is-gapless">
                          <div class="column"><a>Sign out</a></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- PROFILES END-->
                <!-- LEARN MORE TOGGLE -->
                <div class="navbar-item workshop">
                  Workshop
                  <Toggle
                    v-model="enabled"
                    class="toggle-grey"
                    @change="getWorkshopLinks"
                  />
                </div>
                <!-- LEARN MORE TOGGLE -->
              </div>
            </div>
          </nav>
        </div>

        <!-- HEADER -->
        <!-- START BODY CONTENT -->
        <div class="contentSection" v-if="movieloading">
          <!-- SHOW SPINNER UNTIL CONTENT IS READY -->
          <div class="contentBanner">
            <div class="loader"></div>
          </div>
        </div>
        <!-- SHOW SPINNER UNTIL CONTENT IS READY -->
        <div class="contentSection" v-else>
          <div class="contentBanner">
            <!-- HIGHLIGHTED MOVIE -->
            <div class="columns">
              <div class="column is-narrow">
                <div class="columns bannerThumbnail">
                  <!-- HIGHLIGHTED MOVIE IMAGE-->
                  <div class="column no-padding">
                    <img class="" :src="highlightMovie.image_url" />
                  </div>
                  <!-- HIGHLIGHTED MOVIE IMAGE-->
                </div>
              </div>

              <div class="column is-7 is-8-tablet bannerRHS">
                <div class="columns">
                  <!-- HIGHLIGHTED MOVIE TITLE-->
                  <div class="column bannerTitle">
                    {{ highlightMovie.title }}
                  </div>
                  <!-- HIGHLIGHTED MOVIE TITLE-->
                </div>
                <!-- HIGHLIGHTED MOVIE RATING -->
                <div class="columns bannerDRow1">
                  <div
                    class="column is-3-desktop is-2-widescreen is-6-tablet rating"
                    :title="highlightMovie.rating"
                    v-if="highlightMovie.rating"
                  >
                    <span v-if="highlightMovie.rating >= 1"
                      ><i class="fa-solid fa-star"></i
                    ></span>
                    <span v-if="highlightMovie.rating >= 2"
                      ><i class="fa-solid fa-star"></i
                    ></span>
                    <span v-if="highlightMovie.rating >= 3"
                      ><i class="fa-solid fa-star"></i
                    ></span>
                    <span v-if="highlightMovie.rating >= 4"
                      ><i class="fa-solid fa-star"></i
                    ></span>
                    <span v-if="highlightMovie.rating >= 5"
                      ><i class="fa-solid fa-star"></i
                    ></span>
                  </div>
                  <!-- HIGHLIGHTED MOVIE RATING -->
                  <!-- HIGHLIGHTED MOVIE YEAR -->
                  <div class="column is-2-desktop is-6-tablet">
                    {{ highlightMovie.year }}
                  </div>
                  <!-- HIGHLIGHTED MOVIE YEAR -->
                  <!-- HIGHLIGHTED MOVIE GENRE -->
                  <div class="column is-4-desktop is-12-tablet">
                    <span
                      v-for="genre of highlightMovie.genres"
                      class="genresList"
                      >{{ genre }}</span
                    >
                  </div>
                  <!-- HIGHLIGHTED MOVIE GENRE -->
                  <!-- HIGHLIGHTED MOVIE RUNTIME -->
                  <div
                    class="column is-2-desktop is-6-tablet"
                    v-if="highlightMovie.runtime"
                  >
                    {{ getRunTime(highlightMovie.runtime) }}
                  </div>
                  <!-- HIGHLIGHTED MOVIE RUNTIME -->
                </div>
                <div class="columns">
                  <!-- HIGHLIGHTED MOVIE SUMMARY -->
                  <div class="column bannerDesc">
                    {{ highlightMovie.summary }}
                  </div>
                  <!-- HIGHLIGHTED MOVIE SUMMARY -->
                </div>
                <div class="columns bannerDRow2">
                  <div
                    class="column is-gapless is-3-desktop is-6-tablet"
                    v-if="highlightMovie.title"
                  >
                    <b>Director</b><br />
                    <!-- HIGHLIGHTED MOVIE CREW -->
                    <div class="castDetails">
                      <span v-for="crew of this.director" class="castName">{{
                        crew
                      }}</span>
                    </div>
                    <!-- HIGHLIGHTED MOVIE CREW -->
                  </div>
                  <div class="column is-gapless" v-if="highlightMovie.cast">
                    <b>Cast</b><br />
                    <!-- HIGHLIGHTED MOVIE CAST -->
                    <div class="castDetails">
                      <span
                        v-for="cast of highlightMovie.cast"
                        class="castName"
                        >{{ cast }}</span
                      >
                    </div>
                    <!-- HIGHLIGHTED MOVIE CAST -->
                  </div>
                </div>
                <div class="columns is-mobile" v-if="highlightMovie.title">
                  <!-- HIGHLIGHTED MOVIE PLAY BUTTON  -->
                  <div class="column is-gapless is-narrow">
                    <button class="button play">
                      <i class="fa-solid fa-play"></i>&nbsp;Play
                    </button>
                  </div>
                  <!-- HIGHLIGHTED MOVIE PLAY BUTTON  -->
                  <!-- HIGHLIGHTED MOVIE LIST BUTTON  -->
                  <div
                    class="column is-gapless no-padding-left is-narrow padding-left-sm"
                  >
                    <button class="button mylist">
                      <i class="fa-solid fa-plus"></i>&nbsp;My List
                    </button>
                  </div>
                  <!-- HIGHLIGHTED MOVIE LIST BUTTON  -->
                </div>
              </div>
            </div>
            <!-- HIGHLIGHTED MOVIE -->
          </div>
        </div>
        <div class="loader" v-if="loading"></div>
        <div class="columns shelves is-gapless">
          <div class="column">
            <div class="columns shelvesRow">
              <!-- GENRE -->
              <div class="column">
                <!-- CREATE A SLIDER FOR GENRE -->
                <Splide
                  :options="{
                    type: loop,
                    rewind: true,
                    pagination: false,
                    arrows: false,
                    breakpoints: {
                      820: {
                        perPage: 2,
                      },
                      414: {
                        perPage: 2,
                      },
                    },
                  }"
                >
                  <SplideSlide class="gBlock" v-for="item of items.genres">
                    <div class="columns is-gapless is-mobile is-narrow">
                      <div class="column">
                        <div class="cwTitle">
                          <!-- GENRE BUTTON LINKS. CAN BE USED FOR STREAMING  -->
                          <a @click="scrollToContent(item)">{{ item }}</a>
                          <!-- GENRE BUTTON LINKS. CAN BE USED FOR STREAMING  -->
                        </div>
                      </div>
                    </div>
                  </SplideSlide>
                </Splide>
                <!-- SLIDER FOR GENRE END-->
              </div>
              <!-- GENRE-->
            </div>
            <div class="columns shelvesRow" v-for="item of items.shelves">
              <!-- Continue Watching -->
              <div class="column" v-if="item.name === 'Continue Watching'">
                <div class="columns is-gapless">
                  <div class="sTitle">{{ item.name }}</div>
                </div>
                <!-- CREATE A SLIDER FOR CONTINUE WATCHING  -->
                <Splide
                  :options="{
                    type: loop,
                    rewind: true,
                    pagination: false,
                    arrows: false,
                    breakpoints: {
                      820: {
                        perPage: 2,
                      },
                      620: {
                        perPage: 1,
                      },
                    },
                  }"
                >
                  <SplideSlide v-for="movie of item.movies" class="cwBlock">
                    <div class="columns is-gapless is-mobile">
                      <div class="column is-5 preview">
                        <!-- LINK TO CONTINUE WATCHING OPEN MOVIE. CAN BE USED FOR STREAMING -->
                        <figure
                          class="image is-142X142 posterImage"
                          @click="openMovie(movie.movie_id)"
                        >
                          <img :src="movie.image_url" />
                        </figure>
                        <!-- LINK TO OPEN CONTINUE WATCHING MOVIE END -->
                      </div>
                      <div class="column cwDesc">
                        <div class="columns is-gapless">
                          <div class="column">
                            <div class="cwPlay">
                              <!-- LINK TO CONTINUE WATCHING OPEN MOVIE. CAN BE USED FOR STREAMING -->
                              <img
                                class=""
                                src="../assets/images/play-icon.png"
                                @click="openMovie(movie.movie_id)"
                              />
                              <!-- LINK TO CONTINUE WATCHING OPEN MOVIE. CAN BE USED FOR STREAMING -->
                            </div>
                            <div class="cwTitle">
                              {{ movie.title
                              }}<progress
                                class="progress is-link"
                                value="30"
                                max="100"
                              >
                                30%
                              </progress>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SplideSlide>
                </Splide>
                <!-- SLIDER FOR CONTINUE WATCHING ENDS-->
              </div>
              <!-- Continue Watching -->
              <!-- Others -->
              <div v-else class="column">
                <div class="columns is-gapless">
                  <div class="sTitle" :id="item.name">{{ item.name }}</div>
                </div>
                <!-- SLIDER FOR OTHER GENRES -->
                <Splide
                  :options="{
                    type: loop,
                    rewind: false,
                    pagination: false,
                    arrows: false,
                    breakpoints: {
                      820: {
                        perPage: 2,
                      },
                      620: {
                        perPage: 1,
                      },
                    },
                  }"
                >
                  <SplideSlide v-for="movie of item.movies" class="oBlock">
                    <div class="columns is-gapless no-margin-bottom">
                      <div class="column">
                        <!-- LINK TO OTHER GENRE OPEN MOVIE. CAN BE USED FOR STREAMING -->
                        <figure
                          class="image posterImage"
                          @click="openMovie(movie.movie_id)"
                        >
                          <img :src="movie.image_url" />
                        </figure>
                        <!-- LINK TO  OTHER GENRE  END -->
                      </div>
                    </div>
                    <div class="columns is-gapless oBlockTitle is-mobile">
                      <div class="column is-2">
                        <!-- LINK TO OTHER GENRE OPEN MOVIE. CAN BE USED FOR STREAMING -->
                        <button
                          class="button playRound"
                          @click="openMovie(movie.movie_id)"
                        >
                          <i class="fa-solid fa-play"></i>
                        </button>
                        <!-- LINK TO  OTHER GENRE  END -->
                      </div>
                      <div class="column oDesc">
                        <div class="columns is-gapless no-margin-bottom">
                          <div class="column oTitle">{{ movie.title }}</div>
                        </div>
                        <div class="columns is-gapless no-margin-bottom">
                          <div class="column oGenre">
                            <span
                              v-for="genre of movie.genres"
                              class="genresList"
                              >{{ genre }}</span
                            >
                          </div>
                        </div>
                      </div>
                      <div
                        class="column is-3 redRatingBlock"
                        v-if="movie.rating"
                      >
                        <span class="redRating"
                          ><i class="fa-solid fa-star sStar"></i
                          >{{ movie.rating }}</span
                        >
                      </div>
                    </div>
                  </SplideSlide>
                </Splide>
                <!-- SLIDER FOR OTHER GENRES END -->
              </div>
              <!-- Others -->
            </div>
          </div>
        </div>

        <!-- END BODY CONTENT -->
        <!-- START FOOTER -->
        <div class="msFooter columns is-gapless">
          <!--  FOOTER  LOGO -->
          <div class="column is-2">
            <img class="" src="../assets/images/ms_logo_white_small.png" />
          </div>
          <!--  FOOTER  LOGO -->
          <!--  FOOTER  SOCIAL ICONS  -->
          <div class="column is-2">
            <div class="columns is-gapless social is-mobile">
              <div class="column">
                <img class="" src="../assets/images/facebook.png" />
              </div>
              <div class="column">
                <img class="" src="../assets/images/twitter.png" />
              </div>
              <div class="column">
                <img class="" src="../assets/images/instagram.png" />
              </div>
            </div>
          </div>
          <!--  FOOTER  SOCIAL ICONS END -->
          <!--  FOOTER NAV -->
          <div class="column is-6 footerNav">
            <div class="columns is-mobile">
              <div class="column">
                <ul>
                  <li>Home</li>
                  <li>TV shows</li>
                  <li>Movies</li>
                </ul>
              </div>
              <div class="column">
                <ul>
                  <li>Recently Added</li>
                  <li>My List</li>
                  <li>Rewards</li>
                </ul>
              </div>
              <div class="column">
                <ul>
                  <li>Account</li>
                  <li>Search</li>
                  <li>Workshop</li>
                </ul>
              </div>
            </div>
          </div>
          <!--  FOOTER NAV END -->
        </div>
        <!-- END FOOTER -->
      </div>
    </div>
  </div>
  <!-- MOVIE MODAL START -->
  <div id="movieDetails" class="modal">
    <div class="modal-background">
      <div class="loader" v-if="movieDetailloading"></div>
    </div>
    <div class="modal-card">
      <section class="modal-card-body">
        <!-- CLOSE MODAL BUTTON -->
        <button class="delete" aria-label="close" @click="hideMovie"></button>
        <!-- CLOSE MODAL BUTTON -->
        <!--  MODAL MOVIE DETAILS -->
        <div v-if="detailLoaded" class="modal-content">
          <div class="moviemodal" v-if="detailLoaded && movieDetails.title">
            <div
              class="image-container"
              :style="{ backgroundImage: `url(${movieDetails.image_url})` }"
            >
              <div class="gradientDiv"></div>

              <div class="columns is-gapless">
                <div class="column modalbannerRHS">
                  <div class="columns">
                    <div class="column bannerTitle">
                      {{ movieDetails.title }}
                    </div>
                  </div>
                  <div class="columns bannerDRow1">
                    <div
                      class="column is-3-desktop is-3-widescreen is-6-tablet rating"
                      :title="highlightMovie.rating"
                      v-if="movieDetails.rating"
                    >
                      <span v-if="movieDetails.rating >= 1"
                        ><i class="fa-solid fa-star"></i
                      ></span>
                      <span v-if="movieDetails.rating >= 2"
                        ><i class="fa-solid fa-star"></i
                      ></span>
                      <span v-if="movieDetails.rating >= 3"
                        ><i class="fa-solid fa-star"></i
                      ></span>
                      <span v-if="movieDetails.rating >= 4"
                        ><i class="fa-solid fa-star"></i
                      ></span>
                      <span v-if="movieDetails.rating >= 5"
                        ><i class="fa-solid fa-star"></i
                      ></span>
                    </div>
                    <div class="column is-2-desktop is-6-tablet">
                      {{ movieDetails.year }}
                    </div>

                    <div
                      class="column is-3-desktop is-6-tablet"
                      v-if="movieDetails.runtime"
                    >
                      {{ getRunTime(movieDetails.runtime) }}
                    </div>
                  </div>
                  <div class="columns">
                    <div class="column bannerDesc">
                      {{ movieDetails.summary }}
                    </div>
                  </div>
                  <div class="columns">
                    <div class="column is-gapless" v-if="movieDetails.cast">
                      <b class="w700">Cast:</b><br />
                      <div class="castDetails">
                        <span
                          v-for="cast of movieDetails.cast"
                          class="castName"
                          >{{ cast }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="columns">
                    <div class="column" v-if="movieDetails.genres">
                      <b class="w700">Genres:</b><br />
                      <span
                        v-for="genre of movieDetails.genres"
                        class="genresList"
                        >{{ genre }}</span
                      >
                    </div>
                  </div>
                  <div class="columns is-mobile" v-if="movieDetails.title">
                    <div class="column is-gapless is-narrow">
                      <button class="button play">
                        <i class="fa-solid fa-play"></i>&nbsp;Play
                      </button>
                    </div>
                    <div
                      class="column is-gapless no-padding-left is-narrow padding-left-sm"
                    >
                      <button class="button list">
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    </div>
                    <div
                      class="column is-gapless no-padding-left is-narrow padding-left-sm"
                    >
                      <button class="button like">
                        <i class="fa-solid fa-heart"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns related-movies">
              <div class="column">
                <div class="columns">
                  <h1 class="sub-title" v-if="movieDetails.title">
                    You May Also Like...
                  </h1>
                </div>
                <div class="columns shelvesRow relatedCard is-multiline">
                  <div
                    class="column is-narrow relatedCardCol"
                    v-for="movie of movieDetails.similar"
                  >
                    <div class="columns ymalBlock is-gapless">
                      <div class="column">
                        <div class="columns is-gapless no-margin-bottom">
                          <div class="column">
                            <figure
                              class="related_image posterImage"
                              @click="openMovie(movie.movie_id)"
                            >
                              <img :src="movie.image_url" />
                            </figure>
                          </div>
                        </div>
                        <div class="columns is-gapless oBlockTitle is-mobile">
                          <div class="column is-2">
                            <button
                              class="button playRound"
                              @click="openMovie(movie.movie_id)"
                            >
                              <i class="fa-solid fa-play"></i>
                            </button>
                          </div>
                          <div class="column oDesc is-10">
                            <div class="columns is-gapless no-margin-bottom">
                              <div class="column oTitle">{{ movie.title }}</div>
                            </div>
                            <div class="columns is-gapless no-margin-bottom">
                              <div class="column oGenre"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--  IF NO MOVIE FOUND -->
          <div v-else class="moviemodal modalNotfound">
            Movie details not found
          </div>
          <!--  IF NO MOVIE FOUND -->
        </div>
        <!--  MODAL MOVIE DETAILS END-->
      </section>
    </div>
  </div>
  <!-- MOVIE MODAL END -->
</template>

<style>
body {
  background: #000;
}
.bgLayer1 {
  background: #10131f;
}

.bgLayer2 {
}

.header {
  background-image: url("@/assets/images/home-oracle-bg.png");
  min-height: 103px;
  padding: 25px;
  box-sizing: border-box;
  color: #fff;
  background-repeat: no-repeat;
  background-size: cover;
}

.image .o-logo {
  max-width: 42px;
  height: auto;
}

.mslogo {
  max-width: 226px;
  height: auto;
}

.navbar {
  background: transparent;
}

.navbar-start .navbar-item,
.navbar-start .navbar-link {
  color: #fff;
  font-family: Roboto;
  font-style: normal;
  font-weight: 300;
  font-size: 15px;
  line-height: 18px;
  /* identical to box height */
  padding: 0.5rem 1.4rem;
  letter-spacing: 0.02em;
}

a.navbar-item:hover {
  color: #fff;
  background: transparent;
  opacity: 0.7;
}

.navbar-end .navbar-item,
.navbar-end .navbar-link {
  color: #fff;
  font-family: Roboto;
  font-style: normal;
  font-weight: 300;
  padding: 0.5rem 2rem;
  letter-spacing: 0.02em;
}

.contentBanner {
  margin: 0 auto;
  color: #fff;
  padding: 60px 112px;
}

.bannerRHS {
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  padding-left: 60px;
}

.columns.is-gapless > .column.modalbannerRHS {
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  padding-left: 250px !important;
  padding-top: 48px !important;
  padding-right: 20px !important;
}

.bannerThumbnail img {
  min-width: 260px;
}

.header .profileImagesSml {
  width: 36px;
  height: 36px;
  border: 1px solid #fff;
}

.navbar-item img {
  max-height: -moz-fit-content;
  max-height: fit-content;
}

.bannerDRow1 {
  font-family: "Roboto";
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;
  /* identical to box height, or 100% */

  display: flex;
  align-items: center;

  color: #ffffff;
}

.bannerDRow2 {
  opacity: 0.69;
}

.no-padding {
  padding: 0px;
}

.no-padding-left {
  padding-left: 0px;
}

.starability-basic > label {
  width: 18px;
  height: 18px;
  font-size: 15px t;
}

.bannerLogo {
  text-align: center;
}

.rating {
  color: #ffc600;
}

.navbar-end {
  font-size: 22px;
}

.navbar-menu {
  padding-top: 8px;
}

.bannerDesc {
  font-weight: 300;
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
  opacity: 0.69;
  font-family: "Roboto";
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  padding-bottom: 0px;
}

.moviemodal .bannerDesc {
  opacity: 1;
}

.castDetails {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  padding-bottom: 0px;
}

.castName:after {
  content: " •  ";
}

.castName:last-child:after {
  content: "";
}

.genresList:after {
  content: ", ";
}

.genresList:last-child:after {
  content: "";
}

.play {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 36px;
  max-width: 229px;
  height: 48px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 20px;
  /* identical to box height, or 111% */
  border: none;
  letter-spacing: 0.06em;
  color: #ffffff;
  background: linear-gradient(92.52deg, #54a9f5 0%, #b76df4 100%);
  border-radius: 6px;
  width: 229px;
}

.modal-content .play {
  max-width: 400px;
  width: 100%;
  color: #ffffff;
}

.play:hover {
  color: #ffffff;
  opacity: 0.7;
}

.redeem {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 36px;
  width: 100%;
  height: 33px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  /* identical to box height, or 111% */
  border: none;
  letter-spacing: 0.06em;
  color: #ffffff;
  background: linear-gradient(92.52deg, #54a9f5 0%, #b76df4 100%);
  border-radius: 6px;
  text-transform: capitalize;
}

.playRound {
  color: #fff;
  width: 25px;
  height: 25px;
  background: linear-gradient(92.52deg, #54a9f5 0%, #b76df4 100%);
  border-radius: 50%;
  border: none;
  font-size: 12px;
}

.oBlockTitle {
  padding: 18px 12px;
}

.mylist {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 36px;
  width: 229px;
  max-width: 229px;
  height: 48px;
  background: linear-gradient(
    92.52deg,
    rgba(206, 210, 225, 0.3) 0%,
    rgba(206, 210, 225, 0.03) 100%
  );
  border-radius: 6px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 20px;
  /* identical to box height, or 111% */
  border: none;
  letter-spacing: 0.06em;
  color: #ffffff;
}

.mylist:hover {
  color: #ffffff;
  opacity: 0.7;
}

.cwBlock {
  background: linear-gradient(
    96.23deg,
    rgba(206, 210, 225, 0.3) 32.79%,
    rgba(206, 210, 225, 0.06) 100%
  );
  box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.69);
  border-radius: 12px;
  max-width: 389px;
  height: 142px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  text-transform: capitalize;
  margin-right: 20px;
  color: #ffffff;
  overflow: hidden;
}

.shelves {
  padding-left: 85px;
}

.sTitle {
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 20px;
  color: #fff;
}

.columns.is-gapless > .column.cwDesc {
  padding: 15px 15px 25px 12px !important;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  text-transform: capitalize;
  color: #ffffff;
}

.columns.is-gapless > .column.oDesc {
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  text-transform: capitalize;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.columns.is-gapless > .column.oTitle {
  margin-bottom: 9px;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 177px;
}

.columns.is-gapless > .column.oGenre {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 177px;
}

.shelvesRow {
  padding-bottom: 70px;
  margin: 0px !important;
}

.oBlock {
  max-width: 220px;
  height: 400;
  background: linear-gradient(
    96.23deg,
    rgba(206, 210, 225, 0.3) 32.79%,
    rgba(206, 210, 225, 0.06) 100%
  );
  box-shadow: 0px 3px 18px rgba(0, 0, 0, 0.69);
  border-radius: 12px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  text-transform: capitalize;
  margin-right: 20px;
  color: #ffffff;
  overflow: hidden;
}

.oBlock figure {
  background: #000;
  min-height: 290px;
}

.oBlock img {
  max-height: 290px;
}

.searchbox {
  background: transparent;
  border: 1px solid #ffffff;
  box-sizing: border-box;
  width: 230px;
  height: 30px;
  color: #fff;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
}

.control.has-icons-left .icon,
.control.has-icons-right .icon {
  height: 2em;
}

.closeIcon {
  position: absolute;
  right: 40px;
  cursor: pointer;
  font-size: 14px;
}

.searchIcon {
  cursor: pointer;
}

.navbar-item .input:focus {
  box-shadow: none;
  border-color: #fff;
}
.navbar-item .control.has-icons-left .input:focus ~ .icon {
  color: #fff;
}

.workshop {
  flex-direction: column;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 12px;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.1em;
}

.workshop .vue-switcher {
  margin-top: 7px;
}

.columns.is-gapless:not(:last-child).no-margin-bottom {
  margin-bottom: 0px;
}

.redRatingBlock {
  justify-content: flex-end;
  align-items: flex-end;
  display: flex;
  flex-direction: column;
}

.redRating {
  height: 22px;
  padding: 3px 6px;
  background: #ed5f5b;
  border-radius: 100px;
  font-size: 11px;
  line-height: 16px;
  font-style: normal;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

.redRating .sStar {
  margin-right: 3px;
}

.oGenre {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
}

.msFooter {
  min-height: 232px;
  background: #000000;
  padding: 42px 112px;
}

.cwBlock .preview {
  width: 142px;
}

.cwPlay {
  position: absolute;
  right: 0px;
  cursor: pointer;
}

.cwTitle {
  padding-top: 10px;
}

.cwTitle a {
  color: #fff;
}

.cwTitle a:hover {
  opacity: 0.7;
}
.progress {
  height: 8px;
  border-radius: 6px;
  background-color: #eeeeee;
  border-radius: 100px;
  margin-top: 65px;
  -webkit-appearance: none;
}

progress {
  background: linear-gradient(
    to bottom,
    #1e5799 0%,
    #207cca 0%,
    #2989d8 23%,
    #7db9e8 23%
  ) !important;
}

.gBlock {
  background: linear-gradient(
    92.52deg,
    rgba(206, 210, 225, 0.3) 0%,
    rgba(206, 210, 225, 0.03) 100%
  );
  border-radius: 24px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  height: 79px;
  color: #ffffff;
  display: flex;
  margin-right: 12px;
  align-items: center;
  justify-content: center;
  max-width: -moz-fit-content;
  max-width: fit-content;
  min-width: 229px;
}
.social {
  padding-top: 7px;
}

.social img {
  height: 25px;
}

.footerNav ul {
  display: flex;
  flex-direction: column;
}

.footerNav li {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  /* identical to box height, or 143% */
  color: #fff;
  text-transform: capitalize;
  margin-bottom: 12px;
}

.bannerTitle {
  font-style: normal;
  font-weight: bold;
  font-size: 42px;
  line-height: 54px;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-bottom: 0px;
}

/* Make slide in box hidden off screen with fixed positioning 100% to the right */
.slidein {
  max-width: 460px;
  position: fixed;
  z-index: 100;
  top: 0;
  right: -100%;
  background-image: url("@/assets/images/slide-in-bg1.png");
  height: 100%;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.5s ease-in-out;
  padding: 0px 6px;
}

.slideininner {
  height: 100%;
  background-image: url("@/assets/images/pattern-BG.png");
  color: #fff;
  overflow: scroll;
  border: 0.5px solid #ffffff;
  padding-bottom: 200px;
}

.slideininner::-webkit-scrollbar {
  display: none;
}

.slideinHeaderBar {
  background-image: url("@/assets/images/abstract-bar.png");
  background-repeat: no-repeat;
  height: 6px;
  width: 100%;
}

.slideinHeader {
  padding: 30px;
  color: #fff;
  align-items: center;
}

/* Set positioning back to 0 when toggled opened */
.open {
  right: 0;
}

/* add a close button in case toggle button is hidden on smaller screens */
.close-btn {
  border: none;
  font-weight: bold;
  font-size: 2em;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.5em;
}

.toggle {
  margin: 1em;
}

button {
  padding: 0.5em 1em;
  border-radius: 3em;
  font-size: 1.1em;
}

h1 {
  font-weight: 200;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  transition: all 0.3s;
}
.switch::after {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: white;
  top: 1px;
  left: 1px;
  transition: all 0.3s;
}

.checkbox:checked + .switch::after {
  left: 20px;
}
.checkbox:checked + .switch {
  background-color: #7983ff;
}
.checkbox {
  display: none;
}

.toggle-grey {
  --toggle-bg-off: rgb(59, 56, 58);
  --toggle-bg-on: rgb(199, 70, 52);
  --toggle-border-off: rgb(59, 56, 58);
  --toggle-border-on: rgb(199, 70, 52);
}

.toggle-container:focus {
  outline: none;
  box-shadow: none !important;
}

.gradientB {
  background: linear-gradient(
    99.44deg,
    #ffffff 0%,
    rgba(255, 255, 255, 0.5) 100%
  );
  box-shadow: 0px 2px 12px rgb(0 0 0 / 24%);
  backdrop-filter: blur(6px);
  padding: 12px 18px 18px 12px;
  border-radius: 6px;
  width: max-content;
  display: block;
}

.mainTitle {
  background: linear-gradient(95.86deg, #312d2a 0%, #000000 100%);
  border-radius: 3px;
  padding: 6px 12px;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 12px;
  width: max-content;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #ffffff;
}

.ociButton {
  margin-top: 12px;
  font-size: 18px;
  line-height: 21px;
  color: #312d2a;
  max-width: 400px;
}

.ociButton img {
  margin-right: 14px;
}
.ociButton .longArrow {
  margin-left: 14px;
  font-size: 21px;
}

.ociButton a {
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.02em;
  color: #080c1f;
  display: flex;
  align-items: center;
}

.columns.is-gapless > .column.OCIText {
  padding: 0px 18px !important;
}

.OCIText1 {
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
}

.OCIText2 {
  font-weight: 500;
  font-size: 30px;
  line-height: 35px;
  color: #ffffff;
}

.learnMoreC {
  text-align: center;
}

.learnMore {
  padding: 12px;
  border: 1px solid #ffffff;
  box-sizing: border-box;
  border-radius: 3px;
  color: #fff;
  font-size: 14px;
  line-height: 16px;
  display: block;
}

.learnMore:hover {
  color: #fff;
  opacity: 0.7;
}

.columns.is-gapless > .column.slideininnerC {
  padding: 24px !important;
}

.navbar-burger {
  color: #fff !important;
}

.slidein .closeIcon {
  position: absolute;
  right: 15px;
  color: #fff;
  z-index: 1000;
}

.notificationCount {
  position: absolute;
  width: 14px;
  height: 14px;
  right: 0px;
  top: 10px;
  background: #ed5f5b;
  font-weight: bold;
  font-size: 8px;
  line-height: 13px;
  text-align: center;
  color: #ffffff;
  border-radius: 50%;
}

.notificationCount a {
  color: #ffffff;
}

.nonotify {
  font-size: 11px;
}

#showNotifications .dropdown-content {
  background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.8) 100%);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
  min-width: 300px;
}

#showNotifications .icon {
  color: #ffffff;
}

#showProfiles .dropdown-content {
  background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.8) 100%);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
}

.profileRows {
  font-size: 13px;
  line-height: 15px;
  margin-bottom: 0px !important;
  cursor: pointer;
}

.profileRow {
  display: flex;
  align-items: center;
  padding: 12px;
}

.map {
  padding: 12px;
  font-size: 14px;
  line-height: 16px;
}

.mapInput {
  padding-top: 0px;
  padding-bottom: 0px;
}

.mapInput input {
  background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.5) 100%);
  border: 1px solid rgba(206, 210, 225, 0.6);
  box-sizing: border-box;
  border-radius: 2px;
  padding: 8px 10px 8px 8px;
}

.signOut {
  font-size: 12px;
  line-height: 14px;
  text-decoration-line: underline;
}

.signOut a {
  color: #fff;
}

.columns.is-gapless > .column.profileName {
  padding-left: 8px !important;
}

.columns.signOut.is-gapless > .column {
  padding: 12px !important;
}

.notificationsHeader {
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  padding: 12px 10px;
}

.navbar-divider {
  background-color: #ced2e1;
  height: 1px;
}

.notificationDetails {
  margin-bottom: 0px !important;
  padding: 12px 10px;
}

.columns.is-gapless > .column.notificationDesc {
  padding-left: 8px !important;
}

.notificationDesc .row1 {
  font-size: 20px;
  line-height: 23px;
  color: #ffc600;
}

.notificationDesc .row2 {
  font-style: italic;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
}
.notificationDesc .row3 {
  font-size: 14px;
  line-height: 16px;
  text-decoration-line: underline;
  color: #54a9f5;
  margin-top: 10px;
}

.notifImg {
  max-width: 82px;
}

.columns.is-gapless > .column.notificationButton {
  padding: 12px !important;
}

.loader {
  text-align: center;
  margin: 0 auto;
  margin-top: 20px;
}

.gradientDiv {
  position: absolute;
  width: 530px;
  height: 459px;
  left: 150px;
  top: 0px;
  background: rgb(8, 12, 31);
  background: linear-gradient(
    90deg,
    rgba(8, 12, 31, 0) 0%,
    rgba(8, 12, 31, 1) 26%,
    rgba(8, 12, 31, 1) 100%
  );
}

.moviemodal {
  background: #080c1f;
}

.checked {
  color: orange;
}

.button-group {
  bottom: 45px;
  position: absolute;
}
.button-group button {
  float: left;
  border-radius: 5%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 36px;
  height: 48px;
  margin: 5px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  /* identical to box height, or 111% */
  border: none;
  letter-spacing: 0.06em;
  color: #ffffff;
  border-radius: 6px;
}
.play {
  background: linear-gradient(92.52deg, #54a9f5 0%, #b76df4 100%);
}
.list {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid #ffffff;
  box-sizing: border-box;
  border-radius: 100px;
  width: 42px;
  height: 42px;
  color: #fff;
}
.like {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid #ffffff;
  box-sizing: border-box;
  border-radius: 100px;
  width: 42px;
  height: 42px;
  color: #fff;
}
.relTitle {
  font-size: 16px;
  font-weight: bold;
}
.cwPlay {
}
.title-play {
  bottom: 0px;
}
.title-info {
  padding-left: 250px;
}
.desc-title {
  font-weight: bold;
  font-size: 18px;
}

.stars {
}

.movie-title {
  font-weight: bold;
  font-size: 32px;
  padding-left: 250px;
}
.sub-title {
  font-weight: bold;
  font-size: 28px;
  padding-left: 0;
}
.moviemodal {
  width: 100%;
  margin: auto;
  color: white;
}

.modal-image {
  display: block;
  width: 500px;
  opacity: 0.9;
  margin: auto;
  margin-top: 0;
}

.summary {
  overflow: hidden;
  max-height: 120px;
  font-size: 18px;
  text-overflow: ellipsis;
}
.cast-info {
  text-align: right;
  font-size: 18px;
}

.genres {
  font-size: 18px;
}
.image-container {
  position: relative;
  overflow: hidden;
  padding-left: 0;
  padding-right: 0;
  background-repeat: no-repeat;
  min-height: 459px;
  background-size: auto 100%;
}
ul li {
  float: right;
}
.relatedCard {
}

.cast-info {
  text-align: left;
  overflow: hidden;
}
.cast-info p {
  max-height: 50px;
}

.modal-content::-webkit-scrollbar {
  display: none;
}

.modal-card {
  width: 55%;
}

.modal-content {
  width: 100%;
  scrollbar-width: none;
}

.modal-card-body {
  padding: 0px;
  overflow: hidden;
  background-color: rgb(10, 10, 10);
}

.modal-card-body .delete {
  position: absolute;
  z-index: 1;
  right: 25px;
  top: 14px;
}

.w700 {
  font-weight: bold;
}

.related-movies {
  padding: 30px;
}

.related_image img {
  width: 100%;
  height: 329px;
}
.ymalBlock {
  background: linear-gradient(
    96.23deg,
    rgba(206, 210, 225, 0.3) 32.79%,
    rgba(206, 210, 225, 0.06) 100%
  );
  box-shadow: 0px 3px 18px rgb(0 0 0 / 69%);
  border-radius: 12px;
  overflow: hidden;
}

.posterImage {
  cursor: pointer;
}

.modalNotfound {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.relatedCardCol {
  max-width: 255px;
}
@media only screen and (max-width: 600px) {
  .shelves,
  .contentBanner {
    padding: 30px;
  }

  .slidein {
    max-width: 100%;
  }

  .mylist {
    padding-left: auto;
  }
  .padding-left-sm {
    padding: 0.75rem;
  }
  .navbar-menu {
    background-color: transparent;
  }
  .contentBanner .columns {
    margin-left: 0px;
  }
  .mslogo {
    max-width: 175px;
    height: auto;
  }
  .navbar-burger {
    top: 5px;
  }
  .relatedCard {
    display: flex;
    justify-content: center;
  }
}
@media only screen and (max-width: 769px) {
  .bannerRHS {
    padding-left: 0px;
  }
  .modal-card {
    width: 90%;
  }
  .gradientDiv {
    background: rgba(8, 21, 31, 85%);
    left: 0px;
    height: 100%;
    width: 100%;
  }
  .image-container {
    height: 100%;
    overflow: hidden;
    min-height: auto;
  }
  .modal-content {
    margin: 0px;
  }
  .columns.is-gapless > .column.modalbannerRHS {
    padding-left: 20px !important;
  }
  .msFooter {
    padding: 40px;
  }
  .columns.is-gapless > .column.footerNav {
    margin-top: 20px;
  }
}
@media only screen and (min-width: 770px) and (max-width: 1200px) {
  .modal-card {
    width: 90%;
  }
}
@media only screen and (min-width: 600px) and (max-width: 1024px) {
}
@media only screen and (max-width: 1023px) {
  .bannerDRow1 {
    display: block !important;
  }

  .play,
  .mylist {
    width: 100%;
    max-width: 100%;
  }

  .navbar-menu {
    background: transparent;
  }
}

@media only screen and (max-height: 460px) {
  #msLogo.logoResize {
    display: none;
  }
}
@media only screen and (min-width: 1201px) {
  .related_image img {
    width: 100%;
    height: 329px;
  }
  .columns.is-gapless > .column.oTitle {
  }
  .modal-content .play {
    min-width: 400px;
  }
  .resizeNav {
    width: calc(100% - 600px);
  }
}
</style>
<style src="@vueform/toggle/themes/default.css"></style>
