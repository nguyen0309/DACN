<template>
  <div class="main-select-custom" v-click-outside="hideDropDown">
    <div class="select-custom hover-bt" :class="{ disable: disable }" @click="changeDropDown">
      <span>{{ getName() }}</span>
      <img v-if="show" src="../assets/images/up.svg" alt="" />
      <img v-else src="../assets/images/down.svg" alt="" />
    </div>
    <div class="dropdown-custom" v-if="show">
      <ul class="dropdown-list">
        <li v-for="(item, index) in list" :key="index" @click="handleSelect(item)" :class="{ active: checkActive(item) }">
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import vClickOutside from "v-click-outside";
export default {
  props: {
    list: Array,
    selected: Array,
    disable: Boolean,
    placeholder: String,
  },
  data() {
    return {
      show: false,
    };
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  methods: {
    checkActive(event) {
      const find = this.selected.find((sl) => sl.value == event.data.value);
      if (find) return true;
      return false;
    },
    changeDropDown() {
      if (this.disable) return;
      this.show = !this.show;
    },
    hideDropDown() {
      this.show = false;
    },
    handleSelect(item) {
      let event = {
        action: "push",
        data: item,
      };
      if (this.checkActive(item)) event.action = "splice";
      this.$emit("getEvent", event);
      setTimeout(() => {
        this.show = false;
      }, 200);
    },
    getName() {
      if (!this.selected.length) return this.placeholder;
      let name = "";
      this.selected.forEach((sl, index) => {
        if (index + 1 == this.selected.length) return (name += sl.name);
        return (name += `${sl.name}, `);
      });
      if (!name) return this.placeholder;
      return name;
    },
  },
};
</script>
<style lang="scss" scoped>
.main-select-custom {
  position: relative;
  width: 220px;
}
.select-custom {
  background: #ffffff;
  border: 1px solid #dcdfe5;
  box-sizing: border-box;
  border-radius: 5px;
  height: 40px;
  padding: 8px 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
  span {
    font-size: 14px;
    line-height: 21px;
    color: #222222;
    font-weight: 300;
    text-transform: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    width: 90%;
  }
}
.select-custom:focus {
  border-color: #4880ff;
}
.select-custom.disable {
  background: #f5f6fa;
  cursor: no-drop;
}
.dropdown-custom {
  background: #ffffff;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  border-radius: 5px;
  position: absolute;
  bottom: -1px;
  left: 0;
  transform: translate(0, 100%);
  padding: 9px;
  width: 220px;
  z-index: 9999;
}
ul.dropdown-list {
  margin-bottom: 0;
  list-style: none;
  max-height: 360px;
  overflow: auto;
  z-index: 9999;
  list-style: none;
  padding-left: 0;
}
ul.dropdown-list > li {
  padding: 7px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.5s;
}
// ul.dropdown-list > li:not(:last-child) {
//   margin-bottom: 1px;
// }
ul.dropdown-list > li:hover,
ul.dropdown-list > li.active {
  background: #f5f6fa;
  border-radius: 5px;
}
.box-avata-custom {
  width: 22px;
  height: 22px;
  background: #eee;
  border-radius: 50%;
  background-position: center !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  flex-shrink: 0;
  margin-right: 12px;
}
ul.dropdown-list > li > span {
  flex: 1;
  font-size: 14px;
  line-height: 21px;
  color: #222222;
  font-weight: 300;
  text-transform: initial;
}
.select-custom > img {
  width: 9px;
}
</style>
