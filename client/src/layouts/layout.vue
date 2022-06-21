<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1">
          <router-link to="/task">
            <a-icon type="team" />
            <span>Task management</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2" v-if="user.role == '0'">
          <router-link to="/admin/list">
            <a-icon type="user" />
            <span>User management</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/">
            <a-icon type="twitter" />
            <span>Chatbox</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon class="trigger" style="float: left" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
        <div class="config">
          <div class="manage"><slot name="name-tab"> </slot></div>
          <div class="hello">
            Hello {{ user.name }}
            <div class="avatar">{{ user.name.charAt(0) }}</div>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { mapMutations } from "vuex";
import { mapState } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      collapsed: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapMutations(["setUser"]),
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
  },
  async created() {
    await this.checkToken();
  },
};
</script>
<style scoped>
section {
  height: 100% !important;
}
.ant-menu-item {
  text-align: left !important;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  height: 100%;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.config {
  display: flex;
  width: auto;
  justify-content: space-between;
  margin: 0 15px;
}
.manage {
  font-weight: 500;
  font-size: 20px;
}
.hello {
  display: flex;
  align-items: center;
  text-transform: uppercase;
}
.avatar {
  width: 35px;
  height: 35px;
  background: greenyellow;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  cursor: pointer;
}
</style>
