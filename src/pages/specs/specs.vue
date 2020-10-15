<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
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
        isAdd: true,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    willAdd() {
      this.info.isShow = true;
      this.info.isAdd = true
    },
    edit(id){
      this.info.isShow = true;
      this.info.isAdd = false;
      // 让子组件发起获取详情的请求
      this.$refs.add.look(id)
    }
  },
  mounted() {},
};
</script>
<style scoped>
</style>