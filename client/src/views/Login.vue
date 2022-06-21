<template>
  <div>
    <div id="" class="container-fluid">
      <!-- Background animtion-->
      <div class="background">
        <div class="cube"></div>
        <div class="cube"></div>
        <div class="cube"></div>
        <div class="cube"></div>
        <div class="cube"></div>
      </div>
      <!-- header -->
      <header>
        <div class="logo"><span>N</span></div>
        <!-- title & content -->
        <section class="header-content">
          <div class="container py-2">
            <div class="row d-flex align-items-center justify-content-center">
              <div class="col-md-8 col-lg-7 col-xl-6">
                <img
                  src="https://mdbootstrap.com/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                  class="img-fluid"
                  alt="Phone image"
                />
              </div>
              <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                <div class="mb-4">
                  <h1>Welcome</h1>
                </div>
                <form @submit.prevent="handleLogin" method="POST">
                  <!-- sđt input -->
                  <div
                    class="form-outline mb-4"
                    :class="{ 'form-group--error': $v.phone.$error }"
                  >
                    <input
                      class="form__input form-control form-control-lg"
                      placeholder="Mời nhập số điện thoại"
                      id="form1Example13"
                      v-model.trim="$v.phone.$model"
                      type="number"
                    />
                  </div>
                  <!-- <div class="error" v-if="!$v.phone.required">Số điện thoại không đúng.</div> -->
                  <div class="error" v-if="!$v.phone.minLength">
                    Phone number must have at least
                    {{ $v.phone.$params.minLength.min }} number.
                  </div>
                  <!-- mật khẩu input -->
                  <div
                    class="form-outline mb-4"
                    :class="{ 'form-group--error': $v.password.$error }"
                  >
                    <input
                      type="password"
                      class="form__input form-control form-control-lg"
                      placeholder="Mời nhập mật khẩu"
                      id="form1Example13"
                      v-model.trim="$v.password.$model"
                    />
                  </div>
                  <!-- <div class="error" v-if="!$v.password.required">Mật khẩu không đúng.</div> -->
                  <div class="error" v-if="!$v.password.minLength">
                    Password must have at least
                    {{ $v.password.$params.minLength.min }} letters.
                  </div>
                  <!-- <button class="button" @click="handleLogin" >Submit!</button> -->

                  <!-- Password input -->
                  <!-- <div class="form-outline mb-4">

                                    <input type="password" v-model="password" id="form1Example23" placeholder="Mời nhập mật khẩu" class="form-control form-control-lg" />

                                </div> -->

                  <div
                    class="
                      d-flex
                      justify-content-around
                      align-items-center
                      mb-4
                    "
                  >
                    <!-- Checkbox -->
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="form1Example3"
                        checked
                      />
                      <label class="form-check-label" for="form1Example3">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg btn-block"
                    :disabled="submitStatus === 'PENDING'"
                  >
                    Sign in
                  </button>
                  <p class="typo__p" v-if="submitStatus === 'OK'">
                    Thanks for your submission!
                  </p>
                  <p class="typo__p" v-if="submitStatus === 'ERROR'">
                    Phone number or password is wrong!
                  </p>
                  <p class="typo__p" v-if="submitStatus === 'PENDING'">
                    Sending...
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </header>
    </div>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import axios from "axios";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      phone: "",
      password: "",
      submitStatus: null,
    };
  },
  head: {
    title() {
      return {
        inner: "Login",
      };
    },
  },
  validations: {
    phone: {
      required,
      minLength: minLength(10),
    },
    password: {
      required,
      minLength: minLength(8),
    },
  },
  methods: {
    ...mapMutations(["setUser"]),
    async handleLogin(event) {
      this.$v.$touch();
      // console.log(this.$v.$invalid);
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
        alert("Phone number or password is wrong!");
      } else {
        event.preventDefault();
        const response = await axios.post(
          `${process.env.VUE_APP_URL}/auth/login`,
          {
            phone: this.phone,
            password: this.password,
          }
        );
        if (response.data.success) {
          let user = {
            name: response.data.data.name,
            role: response.data.data.role,
            id: response.data.data._id,
            auth: true,
          };
          this.setUser(user);
          localStorage.setItem("tokenSocket", response.data.token);
          this.$router.push({
            path: "/",
          });
        }
      }
      // try {
      //     event.preventDefault();

      //     const response = await axios.post(`${process.env.VUE_APP_URL}/auth/login`, {
      //         phone: this.phone,
      //         password: this.password
      //     })
      //     if (response.data.success) {
      //         let user = {
      //             name: response.data.data.name,
      //             role: response.data.data.role,
      //             id: response.data.data._id,
      //             auth: true
      //         }
      //         this.setUser(user)
      //         localStorage.setItem('tokenSocket', response.data.token)
      //         this.$router.push({
      //             path: "/"
      //         })
      //     }
      // } catch (error) {
      //     console.error(error.response)
      // }
    },
  },
};
</script>

<style scoped>
.container-fluid {
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
  background: #fff;
}

/* ============= Animation background ========= */

.background {
  background: linear-gradient(132deg, #fc415a, #591bc5, #212335);
  background-size: 400% 400%;
  animation: Gradient 15s ease infinite;
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0px;
}

.cube {
  position: absolute;
  top: 80vh;
  left: 45vw;
  width: 10px;
  height: 10px;
  border: solid 1px #d7d4e4;
  transform-origin: top left;
  transform: scale(0) rotate(0deg) translate(-50%, -50%);
  animation: cube 12s ease-in forwards infinite;
}

.cube:nth-child(2n) {
  border-color: #fff;
}

.cube:nth-child(2) {
  animation-delay: 2s;
  left: 25vw;
  top: 40vh;
}

.cube:nth-child(3) {
  animation-delay: 4s;
  left: 75vw;
  top: 50vh;
}

.cube:nth-child(4) {
  animation-delay: 6s;
  left: 90vw;
  top: 10vh;
}

.cube:nth-child(5) {
  animation-delay: 8s;
  left: 10vw;
  top: 85vh;
}

.cube:nth-child(6) {
  animation-delay: 10s;
  left: 50vw;
  top: 10vh;
}

/* ================= Header ============ */

header {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* navbar */

nav {
  color: #fff;
  float: right;
  margin: 30px 90px;
}

nav ul {
  list-style: none;
}

nav ul li {
  float: left;
  transition: 0.3s;
}

nav ul li a {
  text-decoration: none;
  color: #efeef5;
  transition: 0.5;
  font-size: 15px;
  margin-left: 16px;
}

nav ul li:hover a {
  text-decoration: none;
  color: #591bc5;
}

nav ul li:hover {
  height: 45px;
  padding-top: 30px;
  margin-top: -30px;
  background: #efeef5;
  text-decoration: none;
  transform: skew(15deg);
}

/* Logo */

.logo {
  width: 35px;
  height: 35px;
  background: #efeef5;
  margin: 40px 63px;
  float: left;
  transform: rotate(-30deg);
}

.logo span {
  color: #591bc5;
  font-size: 2em;
  line-height: 1.4;
  padding-left: 5px;
  font-weight: bold;
}

/* Header content & title & button*/

.header-content {
  margin-top: 9%;
  text-align: center;
  color: #efeef5;
}

.header-content h1 {
  text-transform: uppercase;
  font-size: 3em;
  letter-spacing: 1px;
}

.header-content p {
  font-size: 20px;
  line-height: 1.5;
  margin: 20px auto;
}

.header-content button {
  width: 140px;
  margin: 20px 10px;
  color: #591bc5;
  font-size: 17px;
  border: 1px solid #efeef5;
  font-weight: 500;
  background: #efeef5;
  border-radius: 20px;
  padding: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.header-content button:hover {
  border-radius: 0;
}

/* Animate Background*/

@keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes cube {
  from {
    transform: scale(0) rotate(0deg) translate(-50%, -50%);
    opacity: 1;
  }

  to {
    transform: scale(20) rotate(960deg) translate(-50%, -50%);
    opacity: 0;
  }
}

/* css view đăng nhập */

.divider:after,
.divider:before {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
}
</style>
