<template>
  <div class="add">
    <el-dialog
      :title="info.isAdd ? '添加商品分类' : '编辑商品分类'"
      :visible.sync="info.isShow"
      @closed="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="上级分类">
          <el-select v-model="form.pid" placeholder="请选择">
            <el-option label="顶级分类" :value="0"></el-option>
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="form.catename"></el-input>
        </el-form-item>

        <!-- 原生 上传图片-start -->
        <el-form-item label="图片" v-if="!form.pid == 0">
          <div class="my-upload">
            <h3>+</h3>
            <img class="img" v-if="imgUrl" :src="imgUrl" />
            <input @change="getFile" class="my-input" type="file" />
          </div>
        </el-form-item>
        <!-- 原生 上传图片-end -->

        <!-- element-ui 上传照片 start -->
        <!-- <el-form-item label="图片" v-if="!form.pid == 0">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="getFile2"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <!-- element-ui 上传照片 end -->

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
  reqCateAdd,
  reqCateDetail,
  reqCateUpdate,
} from "../../../utils/request";
import { successAlert, warningAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        pid: 0,
        catename: "",
        img: "",
        status: 1,
      },
      imgUrl: "",
    };
  },
  computed: {
    ...mapGetters({
      list: "cate/list",
    }),
  },
  methods: {
    ...mapActions({
      reqListAction: "cate/reqListAction",
    }),
    getFile(e) {
      let file = e.target.files[0]; // 得到的是图片的详细信息
      // 1、大小不超过3M 3*1024*1024
      if (file.size > 3 * 1024 * 1024) {
        warningAlert("文件大小不能超过3M");
        return;
      }
      // 2、必须是图片
      let imgExtArr = [".jpg", ".png", ".jpeg", ".gif"];
      let extName = file.name.slice(file.name.lastIndexOf(".")); // 得到文件的后缀名
      if (!imgExtArr.some((item) => item == extName)) {
        warningAlert("文件格式不正确！");
        return;
      }
      // 3、通过URL.createObjectURL()可以通过文件生成一个地址
      this.imgUrl = URL.createObjectURL(file);
      // 4、将文件保存在form.img中
      this.form.img = file;
    },
    getFile2(e) {
      let file = e.raw;
      this.imgUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
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
        catename: "",
        img: "",
        status: 1,
      };
      this.imgUrl = "";
    },
    checkData() {
      if (this.form.catename == "") {
        warningAlert("请填写商品分类名称");
        return false;
      }
      return true;
    },
    // 点击添加按钮
    add() {
      if (!this.checkData()) {
        return;
      }
      reqCateAdd(this.form).then((res) => {
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
      reqCateDetail(id).then((res) => {
        if (res.data.code == 200) {
          // 这个时候的form是没有id的
          this.form = res.data.list;
          // this.form.id = id;
          this.imgUrl = this.$imgPre + this.form.img;
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
  mounted() {
    this.reqListAction();
  },
};
</script>
<style lang="stylus" scoped>
.my-upload {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  position: relative;
}

.my-upload h3 {
  width: 100%;
  height: 100%;
  font-size: 30px;
  font-weight: 400;
  text-align: center;
  line-height: 150px;
}

.my-upload .my-input {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  outline: none;
  cursor: pointer;
  opacity: 0;
}

.my-upload .img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

/* element-ui */
.add >>>.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>