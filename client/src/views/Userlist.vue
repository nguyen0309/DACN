<template>
  <layout>
    <div slot="name-tab">User management</div>
    <div class="content">
      <div class="header">
        <h2>User management</h2>
      </div>
      <div>
        <a-button class="btn" type="primary" @click="showModal">
          Add User
        </a-button>
        <a-modal v-model="visible" title="Add User" on-ok="handleOk">
          <template slot="footer">
            <a-button key="back" @click="handleCancel"> Return </a-button>
            <a-button
              key="submit"
              type="primary"
              :loading="loading"
              @click="handleOk"
            >
              Submit
            </a-button>
          </template>
          <form action="" method="POST">
            <div class="label">Name</div>
            <input class="input" type="text" v-model="name" />
            <div class="label">Phone</div>
            <input class="input" type="text" v-model="phone" />
            <div class="label">Password</div>
            <input class="input" type="password" v-model="password" />
          </form>
        </a-modal>
      </div>

      <div class="ant-table">
        <a-table
          :columns="columns"
          :data-source="users"
          bordered
          :pagination="{ pageSize: 5 }"
        >
          <template slot="id" slot-scope="id, record, index">
            {{ index + 1 }}
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="action">
              <button
                v-if="record.role != 0"
                class="edit"
                @click="() => handleUpdate(record._id)"
              >
                Edit
              </button>
              <button
                v-if="record.role != 0"
                class="delete"
                @click="deleteClick(record._id)"
              >
                Delete
              </button>
            </div>
          </template>
        </a-table>
      </div>

      <div>
        <a-modal v-model="visibleEdit" title="Edit User" on-ok="handleOk">
          <template slot="footer">
            <a-button key="back" @click="handleCancel"> Return </a-button>
            <a-button
              key="submit"
              type="primary"
              :loading="loading"
              @click="handleEditOk"
            >
              OK
            </a-button>
          </template>
          <form action="" method="POST">
            <div class="label">Name</div>
            <input class="input" type="text" v-model="name" />
            <div class="label">Phone</div>
            <input class="input" type="text" v-model="phone" />
            <div class="label">Password</div>
            <input class="input" type="password" v-model="password" />
          </form>
        </a-modal>
      </div>
    </div>
  </layout>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
import { mapState } from "vuex";
import layout from "../layouts/layout.vue";
const columns = [
  {
    title: "STT",
    width: "5%",
    dataIndex: "id",
    scopedSlots: { customRender: "id" },
  },
  {
    title: "Name",
    dataIndex: "name",
    width: "25%",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Phone",
    dataIndex: "phone",
    width: "25%",
    scopedSlots: { customRender: "phone" },
  },
  {
    title: "Role",
    dataIndex: "name_role",
    width: "25%",
    scopedSlots: { customRender: "role" },
  },
  {
    title: "Action",
    dataIndex: "operation",
    width: "15%",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  data() {
    return {
      users: [],
      columns,
      modalTitle: "",
      UserName: "",
      UserId: 0,
      loading: false,
      visible: false,
      visibleEdit: false,
      name: "",
      phone: "",
      password: "",
      id: "",
      collapsed: false,
    };
  },
  head: {
    title() {
      return {
        inner: "User management",
      };
    },
  },
  components: {
    layout,
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapMutations(["setUser"]),
    async loadData() {
      await axios
        .post("http://localhost:3002/api/user/list")
        .then((response) => {
          this.users = response.data.data;
          console.log(this.users);
        });
    },
    addClick() {
      this.modalTitle = "Add User";
      this.UserId = 0;
      this.UserName = "";
    },
    editClick(user) {
      this.modalTitle = "Edit User";
      this.UserId = user._id;
      this.UserName = user.name;
    },
    async createClick() {
      await axios
        .post("http://localhost:3002/api/user/create", {
          name: this.name,
          phone: this.phone,
          password: this.password,
        })
        .then(() => {
          // console.log('response', response)
          this.loadData();
          alert("Thêm thành công");
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async updateClick(id) {
      let dataUpdate = {
        name: this.name,
        phone: this.phone,
      };
      if (this.password) {
        dataUpdate.password = this.password;
      }
      await axios
        .post(`http://localhost:3002/api/user/update/${id}`, dataUpdate)
        .then((response) => {
          console.log("res-update", response);
          this.loadData();
          alert("Thành công");
        })
        .catch((err) => {
          console.error(err);
        });
    },
    deleteClick(_id) {
      if (!confirm("Are you sure?")) {
        return;
      }
      axios
        .delete("http://localhost:3002/api/user/delete/" + _id)
        .then((response) => {
          console.log("res-delete", response);
          this.loadData();
          alert("Xoá thành công");
        });
    },
    showModal() {
      this.visible = true;
    },
    async handleOk() {
      this.loading = true;
      await this.createClick();
      setTimeout(() => {
        this.visible = false;
        this.loading = false;
      }, 3000);
    },
    async handleEditOk() {
      this.loading = true;
      await this.updateClick(this.id);
      // setTimeout(() => {
      this.visibleEdit = false;
      this.loading = false;
      // }, 3000);
    },
    handleCancel() {
      this.visible = false;
      this.visibleEdit = false;
    },
    async handleUpdate(id) {
      try {
        let rs = await axios.get(`http://localhost:3002/api/user/get/${id}`);
        if (rs.data.success) {
          this.name = rs.data.data.name;
          this.phone = rs.data.data.phone;
          this.password = "";
          this.id = rs.data.data._id;
          this.visibleEdit = true;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  async mounted() {
    await this.loadData();
  },
};
</script>
<style scoped>
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
.content {
  /* background-image: url("../assets/images/green.png"); */
  width: 100%;
  height: 100%;
}
.btn {
  float: right;
  width: 10%;
  margin: 20px 0 20px;
}
.header {
  width: 100%;
  text-align: center;
  padding-top: 20px;
}
.ant-table {
  width: 100%;
  margin: auto;
}
.action {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.edit {
  color: #fff;
  cursor: pointer;
  background: green;
  border: 1px solid green;
  padding: 5px 20px 5px 20px;
  border-radius: 5px;
}
.delete {
  color: #fff;
  cursor: pointer;
  background: red;
  border: 1px solid red;
  padding: 5px 20px 5px 20px;
  border-radius: 5px;
}
.input {
  width: 90%;
  border-radius: 5px;
  height: 35px;
  border: 1px solid black;
}
</style>
