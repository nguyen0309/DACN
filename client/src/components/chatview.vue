<template>
  <div class="chatview">
    <div class="header">
      <img
        src="http://windows79.com/wp-content/uploads/2021/02/Thay-the-hinh-dai-dien-tai-khoan-nguoi-dung-mac.png"
        alt=""
        style="margin-right: 20px"
      />
      <div>
        <div class="information">
          <div class="name">
            {{ conversion.name ? conversion.name : detailUser.name }}
          </div>
          <div class="member">
            {{ conversion.name ? conversion.members.length + " members" : "" }}
          </div>
        </div>
        <!-- <div v-b-toggle.my-collapse><i class="fas fa-ellipsis-v"></i></div> -->
        <b-collapse id="my-collapse">
          <b-card title="Collapsible card"> Hello world! </b-card>
        </b-collapse>
      </div>
      <div v-if="conversion.name && conversion.sender_id == user.id" style="margin-left: 50px; display: flex; position: relative">
        <button class="btn btn-success" @click="displayAddUser" style="width: 150px">
          {{ showAddUSer ? "Huỷ" : "Thêm thành viên" }}
        </button>
        <!-- <form action=""> -->
        <input v-if="showAddUSer" type="text" style="margin-left: 50px" v-model="search" @keypress="handleChangeAddUser" />
        <div v-if="showAddUSer" class="list-user">
          <div style="display: flex; justify-content: space-between; padding: 4px;" v-for="u in listUser" :key="u._id">
            <div style="width: 100px; height: 35p; text-align: left;">{{ u.name }}</div>
            <div style="width: 55px">
              <button class="add-button" v-if="!u.in" @click="handleAddUser(u._id)">Add</button>
              <button class="add-button" v-if="u.in && u._id != conversion.sender_id" @click="handleRemoveUser(u._id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="boxchat">
      <div class="boxchat-content">
        <div class="list-chat" v-chat-scroll>
          <span v-for="(m, i) in messages" :key="i">
            <!-- <img style="width: 50px; height: 50px;position: absolute;" src="../assets/images/cat.jpg" alt=""> -->
            <p
              v-if="m.sender_id != user.id && conversion.type == 'group'"
              style="margin: 0; text-align: left; margin-left: 10%; font-size: 12px; margin-bottom: -9px"
            >
              {{ m.sender_name }}
            </p>
            <div :class="[user.id == m.sender_id ? 'your-text' : 'chat']">
              <div :class="[user.id == m.sender_id ? 'your-content' : 'chat-content']">
                <div :class="[user.id == m.sender_id ? 'content-right' : 'content']">
                  <span v-if="m.type == 'image'"><img :src="m.message" alt="" style="max-width: 300px" /></span>
                  <span v-else>{{ m.message }}</span>
                </div>
                <div :class="[user.id == m.sender_id ? 'your-time' : 'time']">
                  {{ new Date(m.created_time).toLocaleString() }}
                </div>
              </div>
            </div>
          </span>
        </div>

        <form v-if="active" method="POST">
          <div class="message-footer">
            <div class="message-footer-left">
              <div class="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style="color: #7d8185"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-smile"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <div class="message-input">
                <input type="text" class="input-content" placeholder="Enter message" v-model="text" />
              </div>
              <div class="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style="color: #7d8185"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-paperclip"
                  @click="handleOpenFile"
                >
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
                <input type="file" ref="inputFile" v-show="false" @change="handleImg($event)" />
              </div>
            </div>
            <div class="message-footer-right">
              <button class="message-footer-right-content" type="submit" style="border: none" @click="createMessage">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style="color: #3390ec"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-send"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
export default {
  props: ["conversion"],
  data() {
    return {
      users: [
        {
          image: "../assets/images/cat.jpg",
          name: "Nguyen",
          time: "2:39 PM",
          latestUser: "Manh",
          latestMessage: "AhihiAhihiAhihiAhihiAhihiAhihiAhihiAhihi",
          unreadMessage: 150,
          member: 10,
        },
      ],
      messages: [
        {
          sender_id: "61cdf718eb771b1b32b73a32",
          conversion_id: "conversion_id",
          receiver_id: "received_id",
          message: "Vui lòng chọn 1 cuộc trò chuyện",
          type: "private",
          created_time: "4567890",
          updated_time: "4567887",
        },
      ],
      cvs_id: "",
      text: "",
      active: false,
      detailUser: {},
      search: "",
      listUser: [],
      showAddUSer: false,
      flag: false,
      img: null,
    };
  },
  watch: {
    conversion() {
      this.cvs_id = this.conversion._id;
      this.fetchMessages();
      this.active = true;
      this.fetchDetaiUser();
    },
  },
  sockets: {
    getMessage: function (data) {
      this.messages.push(data);
      this.$emit("loadConver", true);
    },
  },
  // async mounted() {
  //   await this.loadUser();
  // },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async createMessage(e) {
      e.preventDefault();
      try {
        if (!this.text) return;

        if (this.flag) {
          let data = new FormData();
          data.append("sampleFile", this.img);
          let rsImg = await axios.post(`${process.env.VUE_APP_URL}/upload`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          this.text = rsImg.data.data.url;
          console.log("rsupload", rsImg.data.data);
        }

        let res = await axios.post(`${process.env.VUE_APP_URL}/message/create`, {
          sender_id: this.user.id,
          conversion_id: this.cvs_id,
          sender_name: this.user.name,
          receiver_id: this.user.id == this.conversion.sender_id ? this.conversion.receiver_id : this.conversion.sender_id,
          message: this.text,
          type: !this.flag ? "message" : "image",
        });
        this.flag = false;
        //send message

        if (res.data.success) {
          let updateConve = await axios.post(`${process.env.VUE_APP_URL}/conversion/update/${this.cvs_id}`, {
            last_message: res.data.data._id,
            updated_time: Date.now(),
          });
          this.messages.push(res.data.data);
          console.log("updateConve", updateConve);
          this.text = "";
          this.$emit("loadConver", true);
          this.$socket.emit("sendMessage", res.data.data);
        }
        console.log("res", res.data);
      } catch (error) {
        console.error(error.response);
      }
    },
    async fetchMessages() {
      try {
        let list = await axios.get(`${process.env.VUE_APP_URL}/message/list/${this.cvs_id}`);
        console.log("listMess", list.data);
        this.messages = list.data.data;
      } catch (error) {
        console.error(error.response);
      }
    },
    async fetchDetaiUser() {
      try {
        let idRe = this.conversion.sender_id == this.user.id ? this.conversion.receiver_id : this.conversion.sender_id;
        let user = await axios.get(`${process.env.VUE_APP_URL}/user/get/${idRe}`);
        if (user.data.success) {
          this.detailUser = user.data.data;
        }
        console.log("user", user.data);
      } catch (error) {
        console.error(error.response);
      }
    },
    async loadUser() {
      try {
        let rs = await axios.post(`${process.env.VUE_APP_URL}/user/list`, {
          search: this.search,
        });
        if (rs.data.success) {
          this.listUser = rs.data.data;
          this.listUser = this.listUser.map((val) => {
            if (this.conversion.members.includes(val._id)) {
              val.in = true;
            } else {
              val.in = false;
            }
            return val;
          });
          // this.listUser = this.listUser.filter(
          //   (val) => !this.conversion.members.includes(val._id)
          // );
          // console.log('sds',this.listUser)
          console.log("sds", this.listUser);
        }
        console.log("rs", rs);
      } catch (error) {
        console.error(error.response);
      }
    },
    async handleChangeAddUser() {
      // console.log(this.search)
      await this.loadUser();
    },
    async displayAddUser() {
      this.showAddUSer = !this.showAddUSer;
      await this.loadUser();
    },
    async handleAddUser(id) {
      try {
        console.log("id", id);
        let arrMembers = this.conversion.members;
        arrMembers.push(id);
        // console.log('arrMembers', arrMembers)
        let rs = await axios.post(`${process.env.VUE_APP_URL}/conversion/update/${this.conversion._id}`, {
          members: arrMembers,
        });
        console.log("rsc", rs);
        await this.loadUser();
      } catch (error) {
        console.error(error.response);
      }
    },
    async handleRemoveUser(id) {
      try {
        console.log("id", id);
        let arrMembers = this.conversion.members;
        let index = arrMembers.findIndex((m) => m === id);
        if (index == -1) return;
        arrMembers.splice(index, 1);
        let updateConve = await axios.post(`${process.env.VUE_APP_URL}/conversion/update/${this.cvs_id}`, {
          members: arrMembers,
        });
        if (updateConve.data.success) {
          await this.loadUser();
        }
      } catch (error) {
        console.error(error.response);
      }
    },
    handleOpenFile() {
      this.$refs.inputFile.click();
    },
    handleImg(event) {
      console.log("ev", event.target.files[0]);
      this.img = event.target.files[0];
      this.text = event.target.files[0].name;
      this.flag = true;
    },
  },
};
</script>

<style scoped>
/* message-footer */
.boxchat .message-footer {
  width: 90%;
  margin: 1% 5%;
  display: flex;
}

.boxchat .message-footer .message-footer-left {
  width: 80%;
  background-color: white;
  display: flex;
  align-items: center;
  border-radius: 10px;
  height: 50px;
  margin-left: 6%;
}

.boxchat .message-footer .message-footer-right {
  width: 20%;
}

.boxchat .message-footer .message-footer-right .message-footer-right-content {
  width: 35%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  margin-left: 10%;
}
.boxchat .message-footer .message-footer-right .message-footer-right-content:hover {
  background-color: #3390ec;
}
.boxchat .message-footer .message-footer-right .message-footer-right-content svg:hover {
  fill: white;
  color: white;
}

.boxchat .message-footer .icon {
  width: 5%;
  display: flex;
  justify-content: space-around;
}

.boxchat .message-footer .message-input {
  width: 90%;
}

.boxchat .message-footer .message-input .input-content {
  width: 100%;
  border: none;
}

.boxchat .message-footer .message-input .input-content:focus-visible {
  outline: none;
  border: none;
}

.boxchat .boxchat-content .chat {
  width: 80%;
  /* height: 100%; */
  margin: 1% 10%;
}

.boxchat .boxchat-content .your-text {
  width: 80%;
  /* height: 100%; */
  margin: 1% 10%;
}

.boxchat .boxchat-content .chat .chat-content {
  width: max-content;
  max-width: 80%;
  background-color: #ffffff;
  height: auto;
  max-height: 60%;
  padding: 5px;
  border-radius: 10px;
  position: relative;
  /* display: flex; */
}
.chat-content:hover .time {
  display: block;
}
.boxchat .boxchat-content .your-text .your-content {
  margin-left: auto;
  width: max-content;
  max-width: 80%;
  background-color: #e0fdc4;
  height: auto;
  max-height: 60%;
  padding: 5px;
  border-radius: 10px;
  /* display: flex; */
  margin-right: 15%;
  position: relative;
}

.content {
  /* width: 90%; */
  text-align: left;
}

.time {
  /* width: 10%;
  display: flex;
  align-items: end; */
  position: absolute;
  width: max-content;
  background-color: white;
  border-radius: 5px;
  color: red;
  box-shadow: 0px 2px 12px -4px black;
  padding: 5px;
  top: -35px;
  left: 0;
  display: none;
}

/*  */
.chatview {
  background-image: url("../assets/images/green.png");
  width: 100%;
  height: 100vh;
}

.header {
  display: flex;
  width: 100%;
  /* border-bottom: 1px solid black; */
  box-shadow: 0 2px 2px #726f702b;
  align-items: center;
  padding: 5px 10px 5px 10px;
  position: fixed;
  top: 0;
  background: #ffffff;
}

.header img {
  height: 45px;
  width: 45px;
  border-radius: 50%;
}

.box-infor {
  padding-left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.boxchat {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: end;
}

.boxchat .boxchat-content {
  width: 100%;
}
.content-right {
  text-align: left;
}
.your-time {
  text-align: right;
  display: none;
  position: absolute;
  top: -35px;
  right: 0;
  width: max-content;
  background-color: white;
  border-radius: 5px;
  color: red;
  box-shadow: 0px 2px 12px -4px black;
  padding: 5px;
}
.your-content:hover .your-time {
  display: block;
}
.list-chat {
  /* height: 530px; */
  max-height: 600px;
  overflow-y: scroll;
}
.list-user {
  /* display: flex; */
  position: absolute;
  max-width: auto;
  top: 43px;
  left: 200px;
  width: 200px;
  background-color: #fff;
  border-radius: 5px;
  z-index: 99999;
  padding-top: 5px;
  padding-right: 5px;
}
.add-button {
  border-radius: 5px;
  background: #fff;
  width: 50px;
}
</style>
