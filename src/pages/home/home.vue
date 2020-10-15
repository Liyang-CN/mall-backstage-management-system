<template>
  <div>
    <h1>首页</h1>
    <div class="box" id="main"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import echarts from "echarts";
export default {
  props: [],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
    }),
  },
  methods: {
    ...mapActions({
      reqCateList: "cate/reqListAction",
    }),
  },
  watch: {
    cateList: {
      handler() {
        if (this.cateList.length > 0) {
          // 基于已经准备好的dom，初始化echarts实例
          var myChart = echarts.init(document.getElementById("main"));
          // 指定图标的配置项和数据
          var option = {
            title: {
              text: "商品分类",
            },
            tooltip: {},
            legend: {
              data: ["下级分类数量"],
            },
            xAxis: {
              data: this.cateList.map((item) => item.catename),
            },
            yAxis:{},
            series:[
              {
                name:'下级分类数量',
                type:'bar',
                data:this.cateList.map(item=>item.children.length)
              }
            ]
          };
          // 使用刚指定的配置项和数据 显示图表
          myChart.setOption(option);
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.reqCateList();
  },
};
</script>
<style scoped>
.box {
  width: 80%;
  height: 400px;
  margin: 20px auto;
  border: 1px solid #ccc;
}
</style>