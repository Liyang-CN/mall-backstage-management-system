<template>
  <div>
    <el-dialog :visible.sync="info.isShow" title="修改会员信息" @closed="close">
      <el-form>
        <el-form-item label="手机号">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
          <p>留空则不修改</p>
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
        <el-button type="primary" @click="update">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import { reqMemberDetail, reqMemberUpdate } from "../../../utils/request";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqListAction: "member/reqListAction",
    }),
    cancel() {
      this.info.isShow = false;
    },
    close() {
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      // if (!this.info.isAdd) {
      //   this.empty();
      // }
      this.empty();
    },
    //数据重置
    empty() {
      this.form = {
        specsname: "",
        attrs: "",
        status: 1,
      };
    },
    look(id) {
      reqMemberDetail(id).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list;
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      if (this.form.password == "") {
        warningAlert("密码不能为空！");
        return;
      }
      reqMemberUpdate(this.form).then((res) => {
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
.con {
  display: flex;
}
.input-wrap {
  flex: 1;
}
</style>