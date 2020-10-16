<template>
  <div>
    <el-dialog
      :title="info.isAdd ? '添加用户' : '编辑用户'"
      :visible.sync="info.isShow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="所属角色">
          <el-select v-model="form.roleid">
            <el-option label="请选择" disabled value=""></el-option>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :value="item.id"
              :label="item.rolename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
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
  reqManageAdd,
  reqManageDetail,
  reqManageUpdate,
} from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      roleList: "role/list",
      manageList: "manage/list",
    }),
  },
  methods: {
    ...mapActions({
      reqRoleListAction: "role/reqListAction",
      reqManageListAction: "manage/reqListAction",
      reqTotalAction: "manage/reqTotalAction",
    }),
    // 取消按钮
    cancel() {
      this.info.isShow = false;
    },
    // 弹框消失完成时
    close() {
      // 如果是添加的弹窗，就什么也不做，如果是编辑的弹框，就清除form
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    // 数据重置
    empty() {
      // 数据置空
      this.form = {
        roleid: "",
        username: "",
        password: "",
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
    checkDate(){
      if(this.form.roleid == ''){
        warningAlert('请选择所属角色')
        return false
      }
      if (this.form.username == "") {
        warningAlert("请填写用户名");
        return false
      }
      if (this.form.password == "") {
        warningAlert("请填写密码");
        return false
      }
      return true
    },
    // 点击添加按钮
    add() {
      if(!this.checkDate()){
        return
      }
      reqManageAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          // 成功弹窗
          successAlert(res.data.msg);
          //   数据重置
          this.empty();
          //   弹框消失
          this.cancel();
          // list数据刷新
          this.reqManageListAction();
          // 重新获取总数
          this.reqTotalAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    // 获取一条详情信息
    look(uid) {
      // 发请求
      reqManageDetail(uid).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.password = "";
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    // 修改
    update() {
      if(!this.checkDate()){
        return
      }
      reqManageUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqManageListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    if (this.roleList.length == 0) {
      this.reqRoleListAction();
    }
  },
};
</script>
<style scoped>
</style>