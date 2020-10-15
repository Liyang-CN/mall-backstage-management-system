<template>
  <el-table
    :data="list"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
    :tree-props="{ children: 'children' }"
  >
    <el-table-column prop="id" label="编号" sortable width="180">
    </el-table-column>
    <el-table-column prop="title" label="轮播图标题" sortable width="180">
    </el-table-column>
    <el-table-column label="图片">
      <template slot-scope="scope">
        <img
          v-if="scope.row.pid != 0"
          class="img"
          :src="$imgPre + scope.row.img"
        />
      </template>
    </el-table-column>

    <el-table-column label="状态">
      <template slot-scope="scope">
        <el-button v-if="scope.row.status == 1" type="primary">启用</el-button>
        <el-button v-else type="info">禁用</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="操作">
      <template slot-scope="scope">
        <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
        <del-btn @confirm="del2(scope.row.id)"></del-btn>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import { reqBannerDel } from "../../../utils/request";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "banner/list",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "banner/reqListAction",
    }),
    // 删除功能
    del2(id) {
      reqBannerDel(id).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //   编辑功能
    edit(id) {
      this.$emit("edit", id);
    },
  },
  mounted() {
    this.reqListAction();
  },
};
</script>
<style scoped>
.img {
  width: 100px;
  height: 100px;
}
</style>