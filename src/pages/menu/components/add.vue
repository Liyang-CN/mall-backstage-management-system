<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加菜单' : '编辑菜单'"
      :visible.sync="info.isShow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select
            v-model="form.pid"
            placeholder="请选择活动区域"
            @change="changePid"
          >
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio v-model="form.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="form.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>
        <el-form-item label="菜单图标" v-if="form.type == 1">
          <el-select v-model="form.icon" placeholder="请选择菜单图标">
            <el-option v-for="item in icons" :key="item" :value="item">
              <i :class="item"> {{ item }}</i>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单地址" v-else>
          <el-select v-model="form.url" placeholder="请选择菜单地址">
            <el-option
              v-for="item in indexRoutes"
              :key="item.path"
              :label="item.name"
              :value="'/' + item.path"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd"
          >添 加</el-button
        >
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { indexRoutes } from "../../../router/index";
import {
  reqMenuAdd,
  reqMenuDetail,
  reqMenuUpdate,
} from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      },
      indexRoutes: indexRoutes,
      icons: [
        "el-icon-s-tools",
        "el-icon-user",
        "el-icon-message-solid",
        "el-icon-s-goods",
        "el-icon-s-data",
      ],
    };
  },
  computed: {
    ...mapGetters({
      list: "menu/list",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "menu/reqListAction",
    }),
    // 取消按钮
    cancel() {
      this.info.isShow = false;
    },
    // 弹框消失完成时
    close() {
      // 如果是添加的弹窗，就什么也不做，如果是编辑的弹框，就清楚form
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    // 数据重置
    empty() {
      this.form = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      };
    },
    changePid() {
      if (this.form.pid == 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
    // 正则判断
    checkData() {
      if (this.form.title == "") {
        warningAlert("菜单名称不能为空");
        return false;
      }
      if (this.form.icon == "") {
        warningAlert("请选择一个菜单图标");
        return false;
      }
      return true;
    },
    // 点击添加按钮
    add() {
      if (!this.checkData()) {
        return;
      }
      reqMenuAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          // 成功弹窗
          successAlert(res.data.msg);
          //   数据重置
          this.empty();
          //   弹框消失
          this.cancel();
          // list数据刷新
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    // 获取一条详情信息
    look(id) {
      // 发请求
      reqMenuDetail(id).then((res) => {
        if (res.data.code == 200) {
          // 这个时候的form是没有id的
          this.form = res.data.list;
          this.form.id = id;
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    // 修改
    update() {
      if (!this.checkData()) {
        return;
      }
      reqMenuUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {},
};
</script>
<style scoped>
</style>