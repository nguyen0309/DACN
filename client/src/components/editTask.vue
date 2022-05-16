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
    <div class="add-address">
      <div class="input-content">
        <span class="input-title">Task Name <span style="color: red">*</span></span>
        <a-input v-model="name" placeholder="Họ và tên" :class="{ 'validate-err': validateName }" />
        <div class="box-validate-pos" v-if="validateName">
          <span class="text-validate">Không được để trống trường này!</span>
        </div>
      </div>
      <div class="input-content">
        <span class="input-title">Estimate Time <span style="color: red">*</span></span>
        <a-input v-model="time" placeholder="Thời gian dự tính" :class="{ 'validate-err': validateTime }" />
        <div class="box-validate-pos" v-if="validateTime">
          <span class="text-validate">Không được để trống trường này!</span>
        </div>
      </div>
      <div class="input-content">
        <span class="input-title">Descriptions</span>
        <a-textarea v-model="description" placeholder="Mô tả" />
      </div>
      <div class="add-shop-footer">
        <a-button @click="hide" style="width: 73px; border-radius: 8px; height: 37px"> Huỷ </a-button>
        <a-button type="primary" style="width: 73px; margin-left: 8px; border-radius: 8px; height: 37px"> Lưu </a-button>
      </div>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    show: Boolean,
    tasks: Object,
  },

  data() {
    return {
      name: "",
      time: "",
      description: "",
      validateName: false,
      validateTime: false,
    };
  },
  methods: {
    hide() {
      this.$emit("hide");
    },
    handelValidate() {
      if (!this.name) {
        this.validateName = true;
        setTimeout(() => {
          this.validateName = false;
        }, 3000);
        return false;
      }
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
