<template>
  <layout>
    <div class="task-container">
      <ul class="task-list">
        <li class="task-column task-column-on-hold">
          <span class="task-column-header">
            <h2>Tasks</h2>
          </span>

          <div class="task-input">
            <input type="text" placeholder="+ Add an task" @keyup.enter="addIssue('tasks')" v-model="create.tasks" />
          </div>
          <ul class="task-inner-list" id="tasks">
            <li v-for="item in tasks" :key="item.id" class="task-item" @click="openTaskInfo">
              <taskInfo :task="item" :show="showModal" @hide="openTaskInfo"></taskInfo> 
              <h1>{{ item.name }}</h1>
            </li>
          </ul>
        </li>
        <li class="task-column task-column-in-progress">
          <span class="task-column-header">
            <h2>In Progress</h2>
          </span>
          <ul class="task-inner-list" id="inprogress">
            <li v-for="item in inprogress" :key="item.id" class="task-item">
              <h1>{{ item.name }}</h1>
            </li>
          </ul>
        </li>
        <li class="task-column task-column-needs-review">
          <span class="task-column-header"> <h2>Needs Test</h2> </span>
          <ul class="task-inner-list" id="review">
            <li v-for="item in review" :key="item.id" class="task-item">
              <h1>{{ item.name }}</h1>
            </li>
          </ul>
        </li>
        <li class="task-column task-column-approved">
          <span class="task-column-header">
            <h2>Done</h2>
          </span>
          <ul class="task-inner-list" id="approved">
            <li v-for="item in approved" :key="item.id" class="task-item">
              <h1>{{ item.name }}</h1>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </layout>
</template>
<script>
import $ from "jquery";
import dragula from "dragula";
// import axios from "axios";
import { mapState } from "vuex";
import layout from "../layouts/layout.vue";
import taskInfo from "../components/taskInfomation.vue";
export default {
  created: onCreate,
  data() {
    return {
      showModal: false,
      create: {},
      tasks: [
        {
          name: "New sidebar design",
          time: "2 days",
          description: "Design a new sidebar",
        },
        {
          name: "Header design featuresHeader design featuresHeader design featuresHeader design features",
          time: "2 days",
          description: "Design a new sidebar",
        },
      ],
      inprogress: [],
      review: [],
      approved: [],
    };
  },
  components: {
    layout,
    taskInfo,
  },
  methods: {
    openTaskInfo() {
      this.showModal = !this.showModal;
    },
    addIssue: function (key) {
      if (!this.create[key]) return;
      this[key].push({
        name: this.create[key],
        estimate: "2d",
      });
      this.create[key] = "";
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};

function onCreate() {
  $(document).ready(() => {
    dragula([
      document.getElementById("tasks"),
      document.getElementById("inprogress"),
      document.getElementById("review"),
      document.getElementById("approved"),
    ])
      .on("drag", function (el) {
        el.classList.add("is-moving");
      })

      .on("dragend", function (el) {
        el.classList.remove("is-moving");
        window.setTimeout(function () {
          el.classList.add("is-moved");
          window.setTimeout(function () {
            el.classList.remove("is-moved");
          }, 600);
        }, 100);
      });
  });
}
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
  max-width: 1200px;
  margin: 20px auto;
  .task-list {
    display: flex;
    align-items: flex-start;
    @media (max-width: 750px) {
      display: block;
    }
    .task-column {
      flex: 1;
      margin: 0 10px;
      padding: 10px;
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
        padding: 1.5rem;
        h2 {
          font-size: 1.5rem;
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
  min-height: 50px;
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
</style>
