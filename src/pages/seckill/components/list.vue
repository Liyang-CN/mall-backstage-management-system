<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column sortable prop="title" label="活动名称"></el-table-column>
      <el-table-column label="起始时间" sortable prop="begintime">
        <template slot-scope="scope">
          <span>{{scope.row.begintime|filterTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" sortable prop="endtime">
        <template slot-scope="scope">
          <span>{{scope.row.endtime|filterTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="primary"
            >启用</el-button
          >
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column width="200" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <del-btn @confirm="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import { reqSeckillDel } from "../../../utils/request";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "seckill/list",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "seckill/reqListAction",
    }),
    edit(id) {
      this.$emit("edit", id);
    },
    del(id) {
      reqSeckillDel(id).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    this.reqListAction();
    // this.reqTotalAction();
  },
};
</script>
<style scoped>
img {
  width: 75px;
  height: 75px;
}
</style>