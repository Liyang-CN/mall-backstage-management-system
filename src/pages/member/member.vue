<template>
  <div>
    <v-list @edit="edit"></v-list>
    <v-add :info="info" ref="add"></v-add>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list";
import vAdd from "./components/add";
export default {
  props: [],
  components: {
    vList,
    vAdd,
  },
  data() {
    return {
      info: {
        isShow: false,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    edit(id){
      this.info.isShow = true;
      // 让子组件发起获取详情的请求
      this.$refs.add.look(id)
    }
  },
  mounted() {},
};
</script>
<style scoped>
</style>