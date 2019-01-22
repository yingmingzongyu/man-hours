<!--
 * @Author: yincheng
 * @Date: 2019-01-22 10:12:57
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-22 10:41:50
 -->
<template>
  <div class="home">
    <Card dis-hover>
      <p slot="title">个人工作统计</p>
      <Form ref="form" :model="form" inline :label-width="120">
        <FormItem prop="year" label="统计年份：">
          <Select v-model="form.year" style="width: 182px" @on-change="getBusiness">
            <Option v-for="item in years" :key="item" :value="item">{{item}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="month" label="统计周期：">
          <Select v-model="form.month" style="width: 182px" @on-change="getBusiness">
            <Option v-for="item in months" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="businessType" label="项目归属：">
          <Select v-model="form.businessType" style="width: 182px" @on-change="query">
            <Option
              v-for="item in businessTypes"
              :key="item.value"
              :value="item.value"
            >{{item.label}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Card>
    <br>
    <Card dis-hover>
      <p slot="title"></p>
      <div slot="extra">
        <div class="btn-group">
          <Button type="primary" @click="query">导出</Button>
          <Button style="float: right" type="primary" @click="query">查询</Button>
        </div>
      </div>
      <Table
        stripe
        border
        :columns="columns"
        :data="tableData.list"
        :loading="tableLoading"
      />
    </Card>
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { ChartPie, ChartBar } from "_c/charts";
import Example from "./example.vue";
export default {
  name: "home",
  components: {},
  data() {
    //计算可统计年份
    const startYear = 2019;
    const nowYear = new Date().getFullYear();
    const nowMonth = new Date().getMonth() + 1;
    const years = [];
    for (let i = startYear; i <= nowYear; i++) {
      years.push(i);
    }
    return {
      years: years,
      months: [
        {
          value: 1,
          label: "一月"
        },
        {
          value: 2,
          label: "二月"
        },
        {
          value: 3,
          label: "三月"
        },
        {
          value: 4,
          label: "四月"
        },
        {
          value: 5,
          label: "五月"
        },
        {
          value: 6,
          label: "六月"
        },
        {
          value: 7,
          label: "七月"
        },
        {
          value: 8,
          label: "八月"
        },
        {
          value: 9,
          label: "九月"
        },
        {
          value: 10,
          label: "十月"
        },
        {
          value: 11,
          label: "十一月"
        },
        {
          value: 12,
          label: "十二月"
        }
      ],
      businessTypes: [],
      form: {
        year: nowYear,
        month: nowMonth,
        businessType: null
      },
      columns: [
        {
          title: "项目",
          key: "project",
          align: "center",
          children: [
            {
              title: "项目编号",
              align: "center",
              key: "projectNumber"
            },
            {
              title: "项目名称",
              align: "center",
              key: "projectName"
            }
          ]
        },
        {
          title: "阶段一",
          align: "center",
          key: "phase1",
          children: [
            {
              title: "子阶段1A",
              align: "center",
              key: "phase1A"
            },
            {
              title: "子阶段1B",
              align: "center",
              key: "phase1B"
            }
          ]
        },
        {
          title: "阶段二",
          align: "center",
          key: "phase2",
          children: [
            {
              title: "子阶段2A",
              align: "center",
              key: "phase2A"
            },
            {
              title: "子阶段2B",
              align: "center",
              key: "phase2B"
            }
          ]
        }
      ],
      tableLoading: false,
      tableData: {
        list: []
      }
    };
  },
  methods: {
    getBusiness() {
      //获取项目归属类型
      this.businessTypes = [
        {
          value: 1,
          label: "智能化项目"
        },
        {
          value: 2,
          label: "系统集成项目"
        },
        {
          value: 3,
          label: "多媒体项目"
        },
        {
          value: 4,
          label: "运维服务项目"
        },
        {
          value: 5,
          label: "软件项目"
        },
        {
          value: 6,
          label: "软件产品"
        },
        {
          value: 7,
          label: "内部培训"
        },
        {
          value: 8,
          label: "外部培训"
        }
      ];
      //设置第一位为默认值
      this.form.businessType = this.businessTypes.length > 0 ? this.businessTypes[0].value : null;
      this.query()
    },
    query() {
      //query
      this.tableLoading = true;
      setTimeout(() => {
        let data = [];
        for (let i = 0; i < 20; i++) {
          data.push({
            projectNumber: i+1,
            projectName: `项目${i+1}`,
            phase1A: parseInt(Math.random(1) * 10),
            phase1B: parseInt(Math.random(1) * 10),
            phase2A: parseInt(Math.random(1) * 10),
            phase2B: parseInt(Math.random(1) * 10)
          });
        }
        this.tableData.list = data;
        this.tableLoading = false;
      }, 1000);
    }
  },
  mounted() {
    //
  },
  created() {
    this.getBusiness();
    this.query()
  }
};
</script>

<style lang="less">
.home {
  button {
    margin-top: -5px;
    margin-left: 4px;
  }
  .ivu-card-extra {
    width: 98%;
  }
}
</style>
