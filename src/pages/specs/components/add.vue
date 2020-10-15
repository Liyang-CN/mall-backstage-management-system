<template>
  <div>
    <el-dialog
      :visible.sync="info.isShow"
      :title="info.isAdd ? '添加商品规格' : '修改商品规格'"
      @closed="close"
    >
      <el-form>
        <el-form-item label="规格名称">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>
        <el-form-item
          label="规格属性"
          v-for="(item, index) in attrArr"
          :key="index"
        >
          <div class="con">
            <div class="input-wrap">
              <el-input v-model="item.value"></el-input>
            </div>
            <el-button type="primary" v-if="index == 0" @click="addAttr"
              >新增规格属性</el-button
            >
            <el-button type="danger" v-else @click="delAttr(index)"
              >删除</el-button
            >
          </div>
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
        <el-button type="primary" v-if="info.isAdd" @click="add"
          >添加</el-button
        >
        <el-button type="primary" v-else @click="update">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import {
  reqSpecsAdd,
  reqSpecsDetail,
  reqSpecsUpdate,
} from "../../../utils/request";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      attrArr: [{ value: "" }, { value: "" }],
      form: {
        specsname: "",
        attrs: "",
        status: 1,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      reqListAction: "specs/reqListAction",
      reqTotalAction: "specs/reqTotalAction",
    }),
    addAttr() {
      this.attrArr.push({ value: "" });
    },
    delAttr(index) {
      this.attrArr.splice(index, 1);
    },
    cancel() {
      this.info.isShow = false;
    },
    close() {
      //如果是添加开的弹框，就什么都不做；如果是编辑开的弹框，就清除form
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //数据重置
    empty() {
      this.attrArr = [{ value: "" }, { value: "" }];
      this.form = {
        specsname: "",
        attrs: "",
        status: 1,
      };
    },
    checkData() {
      // 验证规格名称
      if (this.form.specsname == "") {
        warningAlert("规格名称不能为空");
        return false;
      }
      // 验证每一个属性值都不能为空
      if (this.attrArr.some((item) => item.value == "")) {
        warningAlert("所有的属性值都必须填写");
        return false;
      }
      return true;
    },
    add() {
      if (!this.checkData()) {
        return;
      }
      this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
      reqSpecsAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          // 成功
          successAlert(res.data.msg);
          // 数据重置
          this.empty();
          // 弹框消失
          this.cancel();
          // list数据要刷新
          this.reqListAction();
          this.reqTotalAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    look(id) {
      reqSpecsDetail(id).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list[0];
          //'['s','l','m']'--->[{value:'s'},{value:'l'},{value:'m'}]
          this.attrArr = JSON.parse(this.form.attrs).map((item) => ({
            value: item,
          }));
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      if (!this.checkData()) {
        return;
      }
      this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
      reqSpecsUpdate(this.form).then((res) => {
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