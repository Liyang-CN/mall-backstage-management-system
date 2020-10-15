<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="用户编号" sortable width="180">
      </el-table-column>
      <el-table-column prop="username" label="用户名" sortable width="180">
      </el-table-column>
      <el-table-column prop="rolename" label="所属角色" sortable width="180">
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="primary"
            >启用</el-button
          >
          <el-button v-else type="info">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column class="option" prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.uid)"
            >编辑</el-button
          >
          <del-btn @confirm="del(scope.row.uid)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <!-- total：设置总数
    page-size：每页有多少个
    有多少页不用自己计算
    current-change：当前页码发生了变化，就会触发该事件，参数就是当前的页码
     -->
    <el-pagination
      background
      layout="prev,pager,next"
      :total="total"
      :page-size="size"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import { reqManageDel } from "../../../utils/request";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "manage/list",
      size: "manage/size",
      total: "manage/total",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "manage/reqListAction",
      reqTotalAction: "manage/reqTotalAction",
      changePageAction: "manage/changePageAction",
    }),
    del(uid) {
      // 点了确定按钮
      reqManageDel(uid).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.reqListAction();
          // 重新获取总数
          this.reqTotalAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //   编辑功能
    edit(id) {
      this.$emit("edit", id);
    },
    changePage(e) {
      this.changePageAction(e);
    },
  },
  mounted() {
    this.reqListAction();
    this.reqTotalAction();
  },
};
</script>
<style scoped>
</style>