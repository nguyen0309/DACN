<template>
  <a-modal
    v-model="showModal"
    :maskClosable="false"
    :footer="false"
    :class="'header-not-border'"
    :bodyStyle="{ padding: '0 32px 32px 32px' }"
    :width="680"
    class="add-address-modal"
  >
    <template slot="closeIcon">
      <div class="close-icon-custom" @click="hide">
        <a-icon type="close" />
      </div>
    </template>
    <template slot="title">
      <div class="header-custom">
        <h3>Add Task</h3>
      </div>
    </template>
    <div class="add-address">
      <div class="input-content">
        <span class="input-title"
          >Task name <span style="color: red">*</span></span
        >
        <a-input
          v-model="name"
          placeholder="Task name"
          :class="{ 'validate-err': validateName }"
        />
        <div class="box-validate-pos" v-if="validateName">
          <span class="text-validate">Task name cannot be left blank!</span>
        </div>
      </div>
      <div class="input-content">
        <span class="input-title"
          >Estimate time<span style="color: red">*</span></span
        >
        <a-input
          v-model="time"
          placeholder="Estimate time"
          :class="{ 'validate-err': validateTime }"
        />
        <div class="box-validate-pos" v-if="validateTime">
          <span class="text-validate">Estimate time cannot be left blank!</span>
        </div>
      </div>
      <div class="input-content">
        <span class="input-title"
          >Assign task to<span style="color: red">*</span></span
        >
        <select
          style="
            height: 32px;
            border-radius: 4px;
            padding-left: 10px;
            border: 1px solid #d9d9d9;
          "
          v-model="assign"
          placeholder="User"
          :class="{ 'validate-err': validateAssign }"
        >
          <option v-for="user in users" :key="user._id" :value="user._id">
            {{ user.name }}
          </option>
        </select>
        <div class="box-validate-pos" v-if="validateAssign">
          <span class="text-validate"
            >Assign task to cannot be left blank!</span
          >
        </div>
      </div>
      <div class="input-content">
        <span class="input-title"
          >Priority<span style="color: red">*</span></span
        >
        <select
          style="
            height: 32px;
            border-radius: 4px;
            padding-left: 10px;
            border: 1px solid #d9d9d9;
          "
          v-model="priority"
          placeholder="Priority"
          :class="{ 'validate-err': validatePriority }"
        >
          <option v-for="i in prioritys" :key="i.value" :value="i.value">
            {{ i.label }}
          </option>
        </select>
        <div class="box-validate-pos" v-if="validatePriority">
          <span class="text-validate">Priority cannot be left blank!</span>
        </div>
      </div>
      <div class="input-content">
        <span class="input-title">Description<span style="color: red">*</span></span>
        <a-textarea
          v-model="description"
          placeholder="Description"
          :class="{ 'validate-err': validateDescription }"
        />
        <div class="box-validate-pos" v-if="validateDescription">
          <span class="text-validate">Description cannot be left blank!</span>
        </div>
      </div>
      <div class="add-shop-footer">
        <a-button
          @click="hide"
          style="width: 73px; border-radius: 8px; height: 37px"
        >
          Cancel
        </a-button>
        <a-button
          @click="createClick"
          type="primary"
          style="
            width: 73px;
            margin-left: 8px;
            border-radius: 8px;
            height: 37px;
          "
        >
          Save
        </a-button>
      </div>
    </div>
  </a-modal>
</template>
<script>
import axios from "axios";
export default {
  props: {
    showModal: Boolean,
    users: Array,
  },

  data() {
    return {
      name: "",
      time: "",
      assign: "",
      description: "",
      prioritys: [
        {
          value: "high",
          label: "High",
        },
        {
          value: "normal",
          label: "Normal",
        },
        {
          value: "low",
          label: "Low",
        },
      ],
      priority: "",
      validateName: false,
      validateTime: false,
      validateAssign: false,
      validateDescription: false,
      validatePriority: false,
    };
  },
  methods: {
    hide() {
      this.$emit("hide");
      this.clear();
    },
    handleValidate() {
      if (!this.name) {
        this.validateName = true;
        setTimeout(() => {
          this.validateName = false;
        }, 3000);
        return false;
      }
      if (!this.time) {
        this.validateTime = true;
        setTimeout(() => {
          this.validateTime = false;
        }, 3000);
        return false;
      }
      if (!this.assign) {
        this.validateAssign = true;
        setTimeout(() => {
          this.validateAssign = false;
        }, 3000);
        return false;
      }
      if (!this.priority) {
        this.validatePriority = true;
        setTimeout(() => {
          this.validatePriority = false;
        }, 3000);
        return false;
      }
      if (!this.description) {
        this.validateDescription = true;
        setTimeout(() => {
          this.validateDescription = false;
        }, 3000);
        return false;
      }
      return true;
    },
    async createClick() {
      if (!this.handleValidate()) return;
      await axios
        .post(
          "http://localhost:3002/api/task/create",
          {
            name: this.name,
            estimate_time: this.time,
            assign: this.assign,
            priority: this.priority,
            description: this.description,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("tokenSocket")}`,
            },
          }
        )
        .then(() => {
          alert("Thêm thành công");
          this.$emit("hide");
          this.clear();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    clear() {
      this.name = "";
      this.time = "";
      this.assign = "";
      this.priority = "";
      this.description = "";
    },
  },
};
</script>
<style>
.add-address-modal > .ant-modal-wrap > .ant-modal > .ant-modal-content {
  border-radius: 16px !important;
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.header-custom {
  padding: 9px 6px 0px;
}
.header-custom > h3 {
  font-weight: bold;
  font-size: 19px;
  line-height: 22px;
  color: #222222;
  margin-bottom: 0;
}
.header-custom > span {
  font-size: 14px;
  line-height: 21px;
  margin-top: 5px;
  color: #656e82;
}
.input-title {
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  color: #27324d;
  margin-top: 16px;
  margin-bottom: 4px;
}

.input-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.mgl-8 {
  margin-left: 8px;
}
.box-fil {
  /* min-height: 50px; */
  max-height: 250px;
  overflow: auto;
  background: #fff;
  z-index: 999999999999999;
}
.box-fil > div {
  padding: 5px 15px;
  cursor: pointer;
  transition: all 0.5s;
}
.box-fil > div:not(.box-fil > div.box-not-fil):hover {
  background: #e8f6fd;
}
.box-fil > div.box-not-fil {
  cursor: no-drop;
}
.not-fil {
  width: 100%;
  height: 70px;
}
.not-fil > div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.not-fil > div > span {
  color: #000;
  font-size: 13px;
}
.box-validate-pos {
  position: absolute;
  z-index: 1;
  right: 10px;
  bottom: 5px;
}
.add-shop-footer {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
}
.box-btn {
  margin-top: 27px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  > div.btn:not(:first-child) {
    margin-left: 10px;
  }
  > div.btn {
    border: 1px solid #656e82;
    box-sizing: border-box;
    border-radius: 5px;
    height: 35px;
    padding: 7px 29px;
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      font-size: 14px;
      line-height: 21px;
      text-align: center;
      color: #27324d;
    }
  }
  > div.btn.red {
    background: #ed4747;
    border-color: #ed4747;
    span {
      color: #ffffff;
    }
  }
}
</style>
