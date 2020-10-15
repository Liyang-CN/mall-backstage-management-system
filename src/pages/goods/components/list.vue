<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column sortable prop="id" label="商品编号"></el-table-column>
      <el-table-column
        sortable
        prop="goodsname"
        label="商品名称"
      ></el-table-column>
      <el-table-column sortable prop="price" label="商品价格">
        <template slot-scope="scope">
          <span>￥{{scope.row.price|filterPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column sortable prop="specsname" label="图片">
        <template slot-scope="scope">
          <img :src="$imgPre + scope.row.img" />
        </template>
      </el-table-column>
      <el-table-column sortable prop="specsname" label="是否新品">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isnew == 1" type="primary">是</el-button>
          <el-button v-else type="danger">否</el-button>
        </template>
      </el-table-column>
      <el-table-column sortable prop="specsname" label="是否热卖">
        <template slot-scope="scope">
          <el-button v-if="scope.row.ishot == 1" type="primary">是</el-button>
          <el-button v-else type="danger">否</el-button>
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

     <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import { reqGoodsDel } from "../../../utils/request";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "goods/list",
      size: "goods/size",
      total: "goods/total",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "goods/reqListAction",
      reqTotalAction: "goods/reqTotalAction",
      changePageAction: "goods/changePageAction",
    }),
    edit(id) {
      this.$emit("edit", id);
    },
    del(id) {
      reqGoodsDel(id).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.reqListAction();
          this.reqTotalAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
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
img {
  width: 75px;
  height: 75px;
}
</style>