<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加角色' : '编辑角色'"
      :visible.sync="info.isShow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>

        <el-form-item label="角色权限">
          <!-- 树形控件  -->
          <!-- data是要展示的数组 -->
          <!-- props配置：children用来判断是否有下一层的字段；label用来展示在页面中的字段 -->
          <el-tree
            ref="tree"
            :data="menuList"
            show-checkbox
            node-key="id"
            :props="{ children: 'children', label: 'title' }"
          >
          </el-tree>
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
  reqRoleAdd,
  reqRoleDetail,
  reqRoleUpdate,
} from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        rolename: "",
        menus: "[]",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      menuList: "menu/list",
      roleList: "role/list",
    }),
  },
  methods: {
    ...mapActions({
      reqMenuListAction: "menu/reqListAction",
      reqRoleListAction: "role/reqListAction",
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
      // 数据置空
      this.form = {
        rolename: "",
        menus: "[]",
        status: 1,
      };
      // 树形控件置空
      this.$refs.tree.setCheckedKeys([]);
    },
    changePid() {
      if (this.form.pid == 0) {
        this.form.type = 1;
      } else {
        this.form.type = 2;
      }
    },
    // 点击添加按钮
    add() {
      // 树形控件取值 this.$refs.tree.getCheckedKeys()
      // 先获取到树形控件的值 并转换为后端要求的字符串数组格式
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          // 成功弹窗
          successAlert(res.data.msg);
          //   数据重置
          this.empty();
          //   弹框消失
          this.cancel();
          // list数据刷新
          this.reqRoleListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    // 获取一条详情信息
    look(id) {
      // 发请求
      reqRoleDetail(id).then((res) => {
        if (res.data.code == 200) {
          // 这个时候的form是没有id的
          this.form = res.data.list;
          this.form.id = id;
          // 给树形控件赋值
          this.$refs.tree.setCheckedKeys(JSON.parse(this.form.menus));
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    // 修改
    update() {
      // 讲树形控件的内容转换为字符数组传给后端
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys())
      reqRoleUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqRoleListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    if (this.menuList.length == 0) {
      this.reqMenuListAction();
    }
  },
};
</script>
<style scoped>
</style>