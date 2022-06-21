<template>
  <a-modal
    v-model="show"
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
        <h3>Task Infomation</h3>
      </div>
    </template>
    <div class="add-address" v-if="task">
      <div class="task-name">
        Task name: <span> {{ task.name }}</span>
      </div>
      <div class="task-name">
        Estimate time:
        <span
          >{{ task.estimate_time }}<span v-if="task.estimate_time <= 1"> day</span>
          <span v-else>days</span></span
        >
      </div>
      <div class="task-name">
        Assign task to:
        <span v-if="task.map_assign">{{ task.map_assign.name }}</span>
      </div>
      <div class="task-name">
        Priority:
        <span
          class="priority"
          :class="{
            redtext: task.priority == 'high',
            greentext: task.priority == 'normal',
            yellowtext: task.priority == 'low',
          }"
        >
          {{ task.priority }}</span
        >
      </div>
      <div class="task-name">
        Description:<span> {{ task.description }}</span>
      </div>
    </div>
    <div class="add-shop-footer">
      <a-button
        @click="hide"
        style="width: 73px; border-radius: 8px; height: 37px"
      >
        Cancel
      </a-button>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    show: Boolean,
    task: Object,
  },

  data() {
    return {};
  },
  methods: {
    hide() {
      this.$emit("hide");
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
.add-address {
  margin-top: 15px;
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
.priority {
  text-transform: uppercase;
}
.redtext {
  color: red;
}
.yellowtext {
  color: blue;
}
.greentext {
  color: greenyellow;
}
.task-name {
  font-weight: 500;
}
</style>
