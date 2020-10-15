<template>
  <div>
    <el-dialog
      :visible.sync="info.isShow"
      :title="info.isAdd ? '添加秒杀活动' : '修改秒杀活动'"
      @closed="close"
    >
      <el-form ref="form" :model="form">
        <el-form-item label="活动名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dateValue"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </el-form-item>
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
          <el-select v-model="form.second_cateid" @change="changeSecond">
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
          <el-select v-model="form.goodsid">
            <el-option label="请选择商品" value="" disabled></el-option>
            <el-option
              v-for="item in thirdGoodsList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
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
  reqCateList,
  reqGoodsList,
  reqSeckillAdd,
  reqSeckillDetail,
  reqSeckillDel,
  reqSeckillUpdate,
} from "../../../utils/request";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "未来一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "未来一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "未来三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      dateValue: [],
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      // 二级分类的列表数据
      secondCateList: [],
      // 三级商品分类的列表数据
      thirdGoodsList: [],
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
      specsList: "specs/list",
      goodsList: "goods/list",
    }),
  },
  methods: {
    ...mapActions({
      reqCateListAction: "cate/reqListAction",
      reqSpecsListAction: "specs/reqListAction",
      reqGoodsListAction: "goods/reqListAction",
      reqSeckillListAction: "seckill/reqListAction",
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
    changeSecond() {
      this.form.goodsid = "";
      this.getThirdList();
    },
    // 获取三级商品分类list
    getThirdList() {
      reqGoodsList({ fid: this.form.second_cateid }).then((res) => {
        let arr = res.data.list;
        this.thirdGoodsList = arr.filter(
          (item) => item.second_cateid == this.form.second_cateid
        );
      });
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
      this.dateValue = [];
      this.form = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      // 二级分类的列表数据
      this.secondCateList = [];
      // 三级商品分类的列表数据
      this.thirdGoodsList = [];
    },
    add() {
      // 将得到的时间转化为时间戳 存进form里
      let startTime = new Date(this.dateValue[0]).getTime();
      let endTime = new Date(this.dateValue[1]).getTime();
      this.form.begintime = startTime;
      this.form.endtime = endTime;
      reqSeckillAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          // 成功
          successAlert(res.data.msg);
          // 数据重置
          this.empty();
          // 弹框消失
          this.cancel();
          // list数据要刷新
          this.reqSeckillListAction();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    look(id) {
      reqSeckillDetail(id).then((res) => {
        if (res.data.code == 200) {
          // 这个时候form没有id
          this.form = res.data.list;
          this.form.id = id;
          // 转换时间格式
          this.dateValue = [
            new Date(parseInt(this.form.begintime)),
            new Date(parseInt(this.form.endtime)),
          ];
          // 请求一下二级分类的list
          this.getSecondList();
          // 请求一下三级分类的list
          this.getThirdList();
          // console.log(this.dateValue);
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    update() {
      let startTime = new Date(this.dateValue[0]).getTime();
      let endTime = new Date(this.dateValue[1]).getTime();
      this.form.begintime = startTime;
      this.form.endtime = endTime;
      reqSeckillUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          // list数据要刷新
          this.reqSeckillListAction();
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