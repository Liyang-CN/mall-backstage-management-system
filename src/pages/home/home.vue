<template>
  <div>
    <h1>首页</h1>
    <div class="box" id="main"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
  },
  mounted() {},
};
</script>
<style scoped>
.box{
  width: 80%;
  height: 400px;
  margin: 20px auto;
  border: 1px solid #ccc;
}
</style>