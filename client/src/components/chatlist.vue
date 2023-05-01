<template>
  <div class="chatlist">
    <div class="chatlist-content">
      <div class="header">
        <div v-b-toggle.my-sidebar class="icon">
          <i class="fas fa-bars"></i>
        </div>
        <b-sidebar id="my-sidebar" title="User Information" shadow>
          <div class="wrap-chatlist">
            <div>
              <div>
                <img
                  class="img-user"
                  style="width: 100px; height: 100px"
                  src="http://windows79.com/wp-content/uploads/2021/02/Thay-the-hinh-dai-dien-tai-khoan-nguoi-dung-mac.png"
                  alt=""
                />
              </div>
              <h3>{{ user.name }}</h3>
              <router-link v-if="user.role == '0'" to="/admin/list" style="margin-bottom: 20px; font-size: 18px"> User management </router-link>
            </div>
            <div class="task">
              <router-link to="/task" style="margin-bottom: 20px; font-size: 18px"> Task list </router-link>
            </div>
            <button class="btn btn-success" @click="showCreateGroup" style="margin-bottom: 20px; margin-top: 20px">Create group</button>
            <form v-if="isGroup" method="post" style="margin-bottom: 20px">
              <input type="text" v-model="groupName" class="form-control" placeholder="Nhấn enter sau khi đặt tên để hoàn thành" />
              <input v-show="false" type="submit" @click="handleCreateGroup" />
            </form>
            <h4>User List</h4>
            <div class="px-3 py-2">
              <div v-for="(user, index) in listUser" :key="index" class="user-content" style="">
                <img
                  class="img-user"
                  src="http://windows79.com/wp-content/uploads/2021/02/Thay-the-hinh-dai-dien-tai-khoan-nguoi-dung-mac.png"
                  alt=""
                  style=""
                />
                <p>{{ user.name }}</p>
                <div class="status" style="">
                  <div :class="[user.online ? 'dot-blue' : 'dot-black']"></div>
                  <button class="button" style="width: 50px; height: 20px; font-size: 10px" @click="handleCreateConversion(user)">Send</button>
                </div>
              </div>
            </div>
            <div class="logout" @click="handleLogout">Log out</div>
          </div>
        </b-sidebar>
        <input class="input-search" type="search" v-model="search" @keyup="handleSearchConversion" placeholder="Tìm kiếm ..." />
      </div>
      <div class="chat-list">
        <div v-for="conv in listConversion" :key="conv._id">
          <div :class="['users', userActive[conv._id] ? 'active' : '']" style="" @click="loadMessages(conv)">
            <img src="http://windows79.com/wp-content/uploads/2021/02/Thay-the-hinh-dai-dien-tai-khoan-nguoi-dung-mac.png" alt="" />
            <div class="content">
              <div class="content-top">
                <div class="name">
                  {{ conv.name ? conv.name : conv.sender_id == user.id ? conv.receiver_name : conv.sender_name }}
                </div>
                <!-- <span class="online"></span> -->
                <div class="time">
                  {{ conv.update_time }}
                </div>
              </div>
              <div class="content-bot">
                <div class="message">
                  <div>
                    {{ conv.last_message ? conv.last_message.sender_name + " :" : "" }}
                  </div>
                  <div>
                    {{ conv.last_message ? conv.last_message.message : "" }}
                  </div>
                </div>
                <!-- <div class="unread-message">
                  <div class="number">1</div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations, mapState } from "vuex";
export default {
  props: ["isLoad"],
  data() {
    return {
      listUser: [],
      users: [
        {
          image: "../assets/images/cat.jpg",
          name: "Nguyen",
          time: "2:39 PM",
          latestUser: "Manh",
          latestMessage: "AhihiAhihiAhihiAhihiAhihiAhihiAhihiAhihi",
          unreadMessage: 150,
        },
      ],
      listConversion: [],
      userActive: {},
      arrUserOnl: [],
      isGroup: false,
      groupName: "",
      search: "",
    };
  },
  async created() {
    await this.checkToken();
    this.$socket.emit("setUserOnl", { id: this.user.id });
    await this.fetchConversion();
  },
  sockets: {
    getUserOnl: async function (data) {
      console.log("arr", data);
      this.arrUserOnl = data;
      await this.getAllUser();
      this.listUser.forEach((val) => {
        if (this.arrUserOnl.find((c) => val._id == c.id)) {
          this.$set(val, "online", true);
        }
      });
      console.log("this.listUseronll", this.listUser);
    },
  },
  watch: {
    isLoad() {
      this.fetchConversion();
    },
  },
  // async beforeMount() {
  //   this.fetchConversion();
  // },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapMutations(["setUser"]),
    async getAllUser() {
      try {
        const res = await axios.post(`${process.env.VUE_APP_URL}/user/list`);
        if (res.data.success) {
          this.listUser = res.data.data.filter((val) => val._id != this.$store.state.user.id);
          this.listUser.forEach((val) => this.$set(val, "online", false));
          console.log("this.user", this.listUser);
        }
        //    console.log('res', res.data)
      } catch (error) {
        console.error(error.response);
      }
    },
    async checkToken() {
      try {
        let token = localStorage.getItem("tokenSocket");
        if (token) {
          let response = await axios.get(`${process.env.VUE_APP_URL}/user/check-token`, {
            headers: { Authorization: "Bearer " + token },
          });
          if (response.data.success) {
            let user = {
              name: response.data.data.name,
              role: response.data.data.role,
              id: response.data.data._id,
              auth: true,
            };
            this.setUser(user);
            return response.data;
          }
        } else {
          this.$router.push({ path: "/login" });
        }
      } catch (error) {
        console.error(error.response);
        if (!error.response.data.success) {
          this.$router.push({ path: "/login" });
        }
      }
    },
    async handleCreateConversion(user) {
      try {
        console.log("user", user);
        let token = localStorage.getItem("tokenSocket");
        let res = await axios.post(
          `${process.env.VUE_APP_URL}/conversion/create`,
          {
            type: "private",
            members: [user._id, this.$store.state.user.id],
            sender_id: this.$store.state.user.id,
            sender_name: this.$store.state.user.name,
            receiver_id: user._id,
            receiver_name: user.name,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        console.log("res", res);
        if (res.data.success) {
          this.$socket.emit("joinConversion", res.data.data);
          this.$emit("loadMess", res.data.data);
        }
        console.log("res-create", res.data);
      } catch (error) {
        console.error(error.response);
      }
    },
    async fetchConversion() {
      try {
        // let id = this.$store.state.user.id;
        let res = await axios.get(`${process.env.VUE_APP_URL}/conversion/list/${this.user.id}?search=${this.search}`);
        // console.log(
        //   `${process.env.VUE_APP_URL}/conversion/list/${this.user.id}`
        // );
        console.log("listConv", res.data);
        if (res.data.success) {
          this.listConversion = res.data.data.filter((cvs) => cvs.last_message || cvs.type == "group");
          // this.listConversion = res.data.data;
          this.listConversion.forEach((val) => this.$set(this.userActive, val._id, false));
          this.listConversion = this.listConversion.sort((a, b) => b.update_time - a.update_time);
          // console.log('ac', this.userActive)
        }
      } catch (error) {
        console.error(error.response);
      }
    },
    loadMessages(conv) {
      this.$socket.emit("joinConversion", conv);
      for (let pro in this.userActive) {
        if (pro == conv._id) {
          this.$set(this.userActive, pro, true);
        } else {
          this.$set(this.userActive, pro, false);
        }
      }
      this.$emit("loadMess", conv);
    },
    showCreateGroup() {
      this.isGroup = !this.isGroup;
    },
    async handleCreateGroup(e) {
      try {
        e.preventDefault();
        if (!this.groupName) return;
        let token = localStorage.getItem("tokenSocket");
        let res = await axios.post(
          `${process.env.VUE_APP_URL}/conversion/create`,
          {
            type: "group",
            members: [this.$store.state.user.id],
            sender_id: this.$store.state.user.id,
            sender_name: this.$store.state.user.name,
            receiver_id: this.$store.state.user.id,
            name: this.groupName,
          },
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        if (res.data.success) {
          alert("thành công");
          this.groupName = "";
          await this.fetchConversion();
          // this.$emit("loadMess", res.data.data);
        }
        console.log("dvnsv", res.data);
      } catch (error) {
        console.error(error.response);
      }
    },
    async handleSearchConversion() {
      try {
        this.fetchConversion();
      } catch (error) {
        console.error(error.response);
      }
    },
    handleLogout() {
      localStorage.setItem("tokenSocket", "");
      let user = {
        name: "",
        role: "",
        id: "",
        auth: false,
      };
      this.setUser(user);
      this.$router.push({ path: "/login" });
    },
  },
};
</script>
<style>
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background: rgb(199, 194, 194);
  border-radius: 10px;
}
</style>

<style scoped>
.chatlist {
  height: 100%;
  width: 100%;
  overflow-y: hidden;
}

.chatlist-content {
  padding: 10px 10px 10px 10px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.icon:hover {
  background: gray;
  border-radius: 50%;
}

.input-search {
  padding-left: 20px;
  width: 90%;
  height: 45px;
  overflow: hidden;
  border-radius: 22px;
  touch-action: none !important;
}

.chat-list {
  width: 100%;
  margin-top: 5px;
  height: 89vh;
  overflow-y: scroll;
}

.users {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 5px 5px 5px;
}

.users:hover {
  background: #dfe1e5;
  border-radius: 10px;
}

.users img {
  width: 15%;
  border-radius: 50%;
}

.content {
  width: 85%;
  padding-left: 10px;
}

.content-top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0px;
}

.content-bot {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.name {
  font-weight: bold;
  font-size: 18px;
}

.time {
  color: rgba(128, 128, 128, 0.877);
  font-size: 14px;
}

.message {
  display: flex;
  font-size: 16px;
  width: 85%;
}

.message div:last-child {
  color: rgba(128, 128, 128, 0.877);
  white-space: nowrap;
  overflow: hidden;
  /* width: 100%; */
  text-overflow: ellipsis;
  padding: 0 5px;
}

.unread-message {
  background: #00c73e;
  border-radius: 50%;
  height: 30px;
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.number {
  color: white;
}
.img-user {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  margin-right: 5px;
}
.dot-blue {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: green;
  margin-right: 10px;
}
.dot-black {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: gray;
  margin-right: 10px;
}
.user-content {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
p {
  margin: 0;
}
.button {
  width: 50px;
  height: 20px;
  font-size: 10px;
  border-radius: 5px;
  background: #00c73e;
}
.status {
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
}
.active {
  /* background: #3390ec;
  border-radius: 10px */
  background: #dfe1e5;
  border-radius: 10px;
}
.active-color {
  color: white;
}
.online {
  width: 10px;
  height: 10px;
  background-color: green;
  border-radius: 5px;
  margin-left: auto;
}
.offline {
  width: 10px;
  height: 10px;
  background-color: gray;
  border-radius: 5px;
  margin-left: auto;
}
.wrap-chatlist {
  position: relative;
  height: 100%;
}
.logout {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translate(-50%, -50%);
  color: blue;
  font-size: 18px;
  cursor: pointer;
}
</style>
