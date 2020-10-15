<template>
  <div>
    <el-dialog
      :visible.sync="info.isShow"
      :title="info.isAdd ? '添加商品' : '修改商品'"
      @closed="close"
      @opened='opened'
    >
      <el-form ref="form" :model="form">
        <el-form-item label="一级分类">
          <el-select v-model="form.first_cateid" @change="changeFirst">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价格">
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>
        <!-- 原生 上传图片-start -->
        <el-form-item label="图片">
          <div class="my-upload">
            <h3>+</h3>
            <img class="img" v-if="imgUrl" :src="imgUrl" />
            <input @change="getFile" class="my-input" type="file" />
          </div>
        </el-form-item>
        <!-- 原生 上传图片-end -->
        <el-form-item label="商品规格">
          <el-select v-model="form.specsid" @change="changeSpecs">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性">
          <el-select multiple v-model="form.specsattr">
            <el-option label="请选择" value="" disabled></el-option>
            <el-option
              v-for="item in goodsAttrList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
        <el-form-item>
          <div v-if="info.isShow" id="editor"></div>
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
import E from 'wangeditor'
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../utils/alert";
import {
  reqCateList,
  reqGoodsAdd,
  reqGoodsDetail,
  reqGoodsUpdate,
} from "../../../utils/request";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      // 图片地址
      imgUrl: "",
      // 二级分类的列表数据
      secondCateList: [],
      // 商品属性list
      goodsAttrList: [],
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
      specsList: "specs/list",
    }),
  },
  methods: {
    opened(){
      this.editor = new E('#editor');
      this.editor.create();
      this.editor.txt.html(this.form.description)
    },
    ...mapActions({
      reqCateListAction: "cate/reqListAction",
      reqSpecsListAction: "specs/reqListAction",
      reqGoodsListAction: "goods/reqListAction",
      reqTotalAction: "goods/reqTotalAction",
    }),
    changeFirst() {
      // 一级分类改变后，二级分类的值先置空
      this.form.second_cateid = "";
      this.getSecondList();
    },
    // 获得二级分类list
    getSecondList() {
      reqCateList({ pid: this.form.first_cateid }).then((res) => {
        this.secondCateList = res.data.list;
      });
    },
    // 商品规格发生改变是，计算商品属性的数组
    changeSpecs() {
      // 商品规格改变时，先把商品属性置空
      this.form.specsattr = [];
      this.getAttrArr();
    },
    // 获得商品属性数组
    getAttrArr() {
      // this.specsList是请求过来的所有的商品规格
      // 在specsList中找到 哪一条数据的id和当前this.form.specsid是一样的
      let obj = this.specsList.find((item) => item.id == this.form.specsid);
      // 把这条数据的attrs赋值给goodsAttrList
      this.goodsAttrList = obj.attrs;
    },
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
      this.form = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      this.imgUrl = "";
      // 二级分类的列表数据
      this.secondCateList = [];
      // 商品属性list
      this.goodsAttrList = [];
    },
    add() {
      // 得到富文本的内容 赋值给description
      this.form.description = this.editor.txt.html();
      let data = {
        ...this.form,
        specsattr: JSON.stringify(this.form.specsattr),
      };
      reqGoodsAdd(data).then((res) => {
        if (res.data.code == 200) {
          // 成功
          successAlert(res.data.msg);
          // 数据重置
          this.empty();
          // 弹框消失
          this.cancel();
          // list数据要刷新
          this.reqGoodsListAction();
          this.reqTotalAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    look(id) {
      reqGoodsDetail({id:id}).then((res) => {
        if (res.data.code == 200) {
          // 这个时候form没有id
          this.form = res.data.list;
          this.form.id = id

          // 请求一下二级分类的list
          this.getSecondList();
          
          // 图片
          this.imgUrl = this.$imgPre+this.form.img

          // 商品属性从字符串转换为数组[]
          this.form.specsattr = JSON.parse(this.form.specsattr)

          // 获取商品属性的数组
          this.getAttrArr();

          // 给富文本赋值，但是这个时候编辑器还没有创建，所以要等有了编辑器才能赋值
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      this.form.description = this.editor.txt.html();
      let data = {
        ...this.form,
        specsattr:JSON.stringify(this.form.specsattr)
      }
      reqGoodsUpdate(data).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.reqGoodsListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    // 如果商品一级分类没有请求过，就请求一下
    if (this.cateList.length == 0) {
      this.reqCateListAction();
    }
    // 由于商品规格模块使用了分页，但是商品管理需要得到所有的商品规格列表，所以就多传一个参数，用来区分是否分页
    this.reqSpecsListAction(true);
  },
};
</script>
<style scoped>
.con {
  display: flex;
}
.input-wrap {
  flex: 1;
}
.my-upload {
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  position: relative;
  margin-left: 40px;
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
</style>