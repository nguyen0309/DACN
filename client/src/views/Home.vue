<template>
  <div class="home">
    <ChatList style="width: 25%" @loadMess="loadMess" :isLoad="isLoad" />
    <ChatView style="width: 75%" @loadConver="loadConver" :conversion="conversion" />
  </div>
</template>

<script>
import ChatList from "@/components/chatlist.vue";
import ChatView from "@/components/chatview.vue";

export default {
  name: "Home",
  head: {
    title() {
      return {
        inner: 'Homepage',
      };
    },
  },
  components: {
    ChatList,
    ChatView,
  },
  data() {
    return {
      conversion: {},
      isLoad: true,
    };
  },
  methods: {
    loadMess(data) {
      this.conversion = data;
      console.log("conversion", this.conversion);
    },
    loadConver() {
      this.isLoad = !this.isLoad;
    },
  },
};
</script>
<style scoped>
.home {
  display: flex;
}
</style>
