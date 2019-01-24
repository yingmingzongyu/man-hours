<template>
  <div>
    <DatePicker
      type="daterange"
      show-week-numbers
      placement="bottom-end"
      :clearable="false"
      :options="dateOptions"
      placeholder="默认近7日"
      style="width: 250px;float:right"
      @on-change="dateChange"
    ></DatePicker>
    <div ref="dom" style="height: 310px;padding-top:50px;"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { on, off } from "@/libs/tools";
export default {
  name: "eachrs-line",
  data() {
    return {
      dom: null,
      dateOptions: {
        shortcuts: [
          {
            text: "近7天",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "近30天",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "近90天",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      },
      lineOptions: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        grid: {
          top: "3%",
          left: "1.2%",
          right: "1%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
        ]
      }
    };
  },
  methods: {
    init() {
      this.chartList = [
        {
          name: "需求阶段",
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: "方案设计阶段",
          data: [257, 358, 278, 234, 290, 330, 310]
        },
        {
          name: "招标阶段",
          data: [379, 268, 354, 269, 310, 478, 358]
        },
        {
          name: "投标阶段",
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: "项目实施",
          data: [820, 645, 546, 745, 872, 624, 258]
        },
        {
          name: "运维阶段",
          data: [820, 645, 546, 334, 390, 330, 320]
        }
      ]
    },
    resize() {
      this.dom.resize();
    },
    dateChange(v) {
      
    },
    formatOptions(list){
      
    }
  },
  watch:{
    options:{
      handler(){
        this.dom.setOption(option);
      },
      deep: true
    }
  },
  mounted() {
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      grid: {
        top: "3%",
        left: "1.2%",
        right: "1%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [
        {
          name: "运营商/网络服务",
          type: "line",
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: "银行/证券",
          type: "line",
          data: [257, 358, 278, 234, 290, 330, 310]
        },
        {
          name: "游戏/视频",
          type: "line",
          data: [379, 268, 354, 269, 310, 478, 358]
        },
        {
          name: "餐饮/外卖",
          type: "line",
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: "快递/电商",
          type: "line",
          label: {
            normal: {
              show: true,
              position: "top"
            }
          },
          data: [820, 645, 546, 745, 872, 624, 258]
        }
      ]
    };
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom);
      this.dom.setOption(option);
      on(window, "resize", this.resize);
    });
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>
