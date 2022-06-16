<template>
  <layout style="background: #dadceb">
    <div slot="name-tab">Quản lý công việc</div>
    <div class="task-header">
      <div class="box-search">
        <input
          type="text"
          class="search-ip-custom hover-bt"
          placeholder="Gõ tên người làm hoặc code công việc để tìm kiếm"
          v-model="search"
          @keyup="handleSearch"
        />
        <img src="../assets/images/search.svg" alt="" />
      </div>
      <div class="user-list">
        <div class="user" v-for="i in users" :key="i._id">
          <div
            @click="filterUser(i)"
            class="avatar"
            :class="{ avatarborder: user_id.find((u) => u == i._id) }"
            :style="{ backgroundColor: randomColor(i._id) }"
          >
            {{ i.name.charAt(0) }}
            <div class="user-name">{{ i.name }}</div>
          </div>
        </div>
      </div>
      <select
        style="height: 40px; width: 220px; font-size: 17px; padding-left: 10px; border-radius: 5px"
        :placeholder="'Độ ưu tiên'"
        v-model="select"
        @change="filterPriority"
      >
        <option value="" disabled selected>Độ ưu tiên</option>
        <option v-for="i in prioritys" :key="i.value" :value="i">{{ i.name }}</option>
      </select>
    </div>
    <div class="task-container">
      <draggable v-model="tasks" class="task-list">
        <div v-for="item in tasks" :key="item.index" class="task-column task-column-on-hold">
          <span class="task-column-header">
            <h2>{{ item.name }}</h2>
            <button v-if="item.status == 'todo'" @click="openAddTaskModal" class="add-task">+ Add Task</button>
          </span>
          <draggable :list="item.list" :group="{ name: 'item' }" class="task-inner-list" @change="log(item, $event)">
            <div v-for="i in item.list" :key="i.id" class="task-item">
              <div class="task-action">
                <div @click="openTaskInfo(i)" :class="{ taskname: true, redtext: i.priority == 'high', yellowtext: i.priority == 'low' }">
                  {{ i.name }}
                </div>
                <div class="action">
                  <img style="margin-right: 10px" @click="openEditTaskModal(i)" src="../assets/images/edit.svg" alt="" />
                  <img @click="deleteClick(i._id)" src="../assets/images/delete.svg" alt="" />
                </div>
              </div>
              <div class="task-info">
                <div>{{ i.code }} - {{ i.estimate_time }}</div>
                <div class="assigner" :style="{ backgroundColor: randomColor(i.map_assign._id) }">
                  {{ i.map_assign.name.charAt(0) }}
                </div>
              </div>
            </div>
          </draggable>
        </div>
        <taskInfo :task="info" :show="showModal" @hide="openTaskInfo"></taskInfo>
        <addTask :users="users" :showModal="showAddModal" @hide="openAddTaskModal"></addTask>
        <editTask :users="users" :showEdit="showEditModal" :taskObject="taskObject" @hide="openEditTaskModal"></editTask>
      </draggable>
    </div>
  </layout>
</template>
<script>
import draggable from "vuedraggable";
import axios from "axios";
import { mapMutations } from "vuex";
import { mapState } from "vuex";
import layout from "../layouts/layout.vue";
import taskInfo from "../components/taskInfomation.vue";
import addTask from "../components/addTask.vue";
import editTask from "../components/editModal.vue";
// import dropdownComponent from "../components/dropdown.vue";
export default {
  name: "functional",
  display: "Functional third party",
  order: 17,
  head() {
    return {
      title: "Quản lý công việc",
    };
  },
  data() {
    return {
      showModal: false,
      showAddModal: false,
      showEditModal: false,
      create: {},
      tasks: [],
      users: [],
      info: {},
      status: "",
      enabled: true,
      taskObject: {},
      search: "",
      filter: {},
      user_id: [],
      userid: "",
      colorCache: {},
      clickOn: false,
      priority: "",
      priorityActive: [],
      prioritys: [
        { name: "All", value: "" },
        {
          value: "high",
          name: "High",
        },
        {
          value: "normal",
          name: "Normal",
        },
        {
          value: "low",
          name: "Low",
        },
      ],
      conditions: [],
      selectOption: {
        priority: [],
        key: [],
      },
      select: "",
    };
  },
  components: {
    layout,
    taskInfo,
    addTask,
    editTask,
    draggable,
  },
  mounted() {
    this.getTaskList();
    this.loadData();
  },
  methods: {
    ...mapMutations(["setUser"]),
    log(data, event) {
      if (event.added) {
        console.log("data", data);
        console.log(event);
        axios
          .post(
            "http://localhost:3002/api/task/update/" + event.added.element._id,
            {
              status: data.status,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("tokenSocket")}`,
              },
            }
          )
          .then(() => {})
          .catch((err) => {
            console.error(err);
          });
      }
    },
    randomColor(id) {
      const r = () => Math.floor(256 * Math.random());

      return this.colorCache[id] || (this.colorCache[id] = `rgb(${r()}, ${r()}, ${r()})`);
    },
    openTaskInfo(i) {
      this.info = i;
      this.showModal = !this.showModal;
    },
    handleSearch() {
      this.getTaskList();
    },
    filterPriority() {
      console.log("select", this.select);
      // console.log("event", event);
      this.priority = this.select.value;
      this.getTaskList();
    },
    filterUser(user) {
      this.clickOn = !this.clickOn;
      let index = this.user_id.findIndex((i) => i == user._id);
      console.log("index1", index);
      if (index == -1) {
        console.log("index2", index);
        this.user_id.push(user._id);
      } else {
        this.user_id.splice(index, 1);
      }
      console.log("user_id", this.user_id);
      this.getTaskList();
    },
    async openAddTaskModal() {
      this.showAddModal = !this.showAddModal;
      await this.getTaskList();
    },
    async openEditTaskModal(obj) {
      this.showEditModal = !this.showEditModal;
      this.taskObject = obj;
      await this.getTaskList();
    },
    async loadData() {
      await axios.post("http://localhost:3002/api/user/list").then((response) => {
        this.users = response.data.data;
        console.log(this.users);
      });
    },
    async getTaskList() {
      let filter = {};
      if (this.user_id.length != 0) filter.assign_to = this.user_id;
      if (this.priority) filter.priority = this.priority;
      await axios
        .post("http://localhost:3002/api/task/list", {
          search: this.search,
          filter,
        })
        .then((res) => {
          this.tasks = res.data.data;
          this.tasks = this.tasks.map((task) => {
            task.name = task.status.replace(/_/g, " ").toUpperCase();
            return task;
          });
          console.log("tasks", this.tasks);
        });
    },
    deleteClick(_id) {
      if (!confirm("Are you sure?")) {
        return;
      }
      axios.delete("http://localhost:3002/api/task/delete/" + _id).then((response) => {
        console.log("res-delete", response);
        this.showModal = false;
        this.getTaskList();
        alert("Xoá thành công");
      });
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.task-container {
  margin: 20px auto;
  .task-list {
    display: flex;
    align-items: flex-start;
    @media (max-width: 750px) {
      display: block;
    }
    .task-column {
      width: calc(100% / 5 - 20px);
      margin: 0 10px;
      padding: 10px 10px 0 10px;
      position: relative;
      overflow: hidden;
      background: #dbe1ec;
      border: 1px solid #dbe1ec;
      border-radius: 10px;

      @media (max-width: 750px) {
        margin-bottom: 30px;
      }
      .task-input {
        padding: 0 0 1rem;
        input {
          border: 1px solid #cfd9ea;
          border-top: 0;
          background: white;
          border-radius: 0.2rem;
          box-shadow: 0px 2px 5px rgba(#cfd9ea, 0.1);
          width: 100%;
          padding: 1rem;
          font-size: 1.3rem;
          font-weight: 300;
          outline: none;
          font-family: "Roboto", sans-serif;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          &:focus {
            box-shadow: 0px 4px 10px rgba(#cfd9ea, 0.5);
          }
        }
      }
      .task-column-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        h2 {
          font-size: 20px;
          font-weight: 400;
          margin: 0;
          text-transform: uppercase;
        }
      }
      &-on-hold {
        .task-column-header,
        .is-moved,
        .task-options {
          background: #4b9efd;
          color: white;
          border-radius: 50px;
        }
      }
      &-in-progress {
        .task-column-header,
        .is-moved,
        .task-options {
          background: #ffb335;
          color: white;
        }
      }
      &-needs-review {
        .task-column-header,
        .is-moved,
        .task-options {
          background: #8473e1;
          color: white;
        }
      }
      &-approved {
        .task-column-header,
        .is-moved,
        .task-options {
          background: #44d26f;
          color: white;
        }
      }
    }
  }
}

.task-inner-list {
  margin-top: 20px;
  max-height: 450px;
  overflow-y: scroll;
  margin-right: -10px;
}

.task-item {
  position: relative;
  margin-bottom: 1rem;
  padding: 1rem;
  padding: 15px 2px;
  background: white;
  border-radius: 10px;
  border: 1px solid #cfd9ea;
  box-shadow: 0px 2px 5px rgba(#cfd9ea, 0.1);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  margin-right: 5px;
  // &:last-child {
  //   margin-bottom: 0;
  // }
  h1 {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    padding: 0 2rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span.task-time {
    font-size: 1.3rem;
    display: inline-block;
    margin-top: 0.5rem;
    color: #566578;
  }
  .assigned {
    display: block;
    margin-top: 1rem;
    li {
      display: inline-block;
      margin-right: 0.5rem;
      img {
        max-width: 20px;
        border-radius: 100%;
      }
    }
  }
  .track-task {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    &:hover {
      opacity: 0.6;
    }
  }
  &.is-moving {
    cursor: move;
  }
}

.gu-mirror {
  position: fixed !important;
  margin: 0 !important;
  z-index: 9999 !important;
  opacity: 0.8;
  list-style-type: none;
}

.gu-hide {
  display: none !important;
}

.gu-unselectable {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}

.gu-transit {
  opacity: 0.5;
}
.add-task {
  background: #4b9efd;
  font-size: 15px;
  color: white;
  border: none;
}
.task-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin-top: 10px;
}
.assigner {
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
.task-action {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
}
.taskname {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 135px;
  text-align: start;
}
.redtext {
  color: red;
}
.yellowtext {
  color: blue;
}
.box-search {
  position: relative;
  height: 40px;
  width: 45%;
  margin-right: 8px;
}
.box-search > img {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  left: 25px;
  width: 15px;
}
.search-ip-custom {
  width: 100%;
  border: 1px solid #c8cdd6;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 7px 7px 7px 41px;
  height: 40px;
  background: #ffffff;
  font-size: 14px;
  line-height: 21px;
  color: #27324d;
}
.search-ip-custom::placeholder {
  color: #c8cdd6;
}
.user-list {
  display: flex;
  align-items: center;
  margin-left: 20px;
  .user {
    margin-left: -10px;
    .avatar {
      position: relative;
      width: 45px;
      height: 45px;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 2px solid white;
      .user-name{
        display: none;
      }
      &:hover > .user-name {
        display: block !important;
        position: absolute;
        bottom: -22px;
        color: #566578;
        width: 200px;
      }
    }
  }
  .user:first-child {
    margin-left: 0 !important;
  }
}
.avatarborder {
  opacity: 100000;
  border: 3px solid greenyellow !important;
}
.task-header {
  display: flex;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
}
</style>
