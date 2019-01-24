<!--
 * @Author: yincheng
 * @Date: 2019-01-22 10:12:57
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-22 10:41:50
 -->
<template>
  <div class="person-statistic">
    <Card dis-hover>
      <p slot="title">个人工作统计</p>
      <Form ref="form" :model="form" inline :label-width="120">
        <FormItem prop="userId" label="用户姓名：" v-if="searchUser">
          <Select
            v-model="form.userId"
            filterable
            remote
            :remote-method="getUser"
            :loading="user.loading"
            @on-change="getBusiness"
          >
            <Option
              v-for="(option, index) in user.data"
              :value="option.id"
              :key="index"
              :label="option.userName"
            >
              <span>{{option.userName}}</span>
              <span style="float:right;color:#ccc">工号{{option.userCode}}</span>
            </Option>
          </Select>
        </FormItem>
        <FormItem prop="year" label="统计年份：">
          <Select v-model="form.year" style="width: 182px" @on-change="getBusiness">
            <Option v-for="item in years" :key="item" :value="item">{{item}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="period" label="统计周期：">
          <Select v-model="form.period" style="width: 182px" @on-change="getBusiness">
            <Option v-for="item in months" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="businessType" label="项目归属：">
          <Select v-model="form.businessType" style="width: 182px">
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
      <Table border :columns="columns" :data="tableData.list" :loading="tableData.loading"/>
    </Card>
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { ChartPie, ChartBar } from "_c/charts";
import { querySystemUser } from "@/api/user";
import { queryStatisticProject } from "@/api/statistic";
import throttle from "lodash/throttle";
export default {
  name: "home",
  props: {
    searchUser: {
      type: Boolean,
      default: false
    }
  },
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
        },
        {
          value: 13,
          label: "第一季度"
        },
        {
          value: 14,
          label: "第二季度"
        },
        {
          value: 15,
          label: "第三季度"
        },
        {
          value: 16,
          label: "第四季度"
        },
        {
          value: 17,
          label: "上半年"
        },
        {
          value: 18,
          label: "下半年"
        },
        {
          value: 19,
          label: "全年"
        }
      ],
      businessTypes: [],
      form: {
        userId: this.$route.query.id || null,
        year: nowYear,
        period: nowMonth,
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
      tableData: {
        list: [],
        loading: false
      },
      user: {
        loading: false,
        data: []
      }
    };
  },
  methods: {
    getBusiness() {
      //获取项目归属类型
      const { userId, year, period } = this.form;
      queryStatisticProject({
        userId,
        year,
        period
      }).then(res => {
        if (res.data.status === 200) {
          this.businessTypes = res.data.data.businessType;
        }
      });
      //设置第一位为默认值
      this.form.businessType =
        this.businessTypes.length > 0 ? this.businessTypes[0].value : null;
    },
    query() {
      //query
      this.tableData.loading = true;
      setTimeout(() => {
        let data = [];
        for (let i = 0; i < 20; i++) {
          data.push({
            projectNumber: i + 1,
            projectName: `项目${i + 1}`,
            phase1A: parseInt(Math.random(1) * 10),
            phase1B: parseInt(Math.random(1) * 10),
            phase2A: parseInt(Math.random(1) * 10),
            phase2B: parseInt(Math.random(1) * 10)
          });
        }
        this.tableData.list = data;
        this.tableData.loading = false;
      }, 1000);
    },
    getUser(value) {
      if (this.user.loading) return;
      this.user.loading = true;
      querySystemUser({
        userName: value,
        pageSize: 20
      }).then(res => {
        if (res.data.status === 200) {
          this.user.data = res.data.data.list;
        }
        this.user.loading = false;
      });
    }
  },
  created() {
    this.getBusiness();
    this.query();
    if (this.searchUser) {
      this.getUser = throttle(this.getUser, 800, { trailing: true });
      this.getUser();
    }
  }
};
</script>

<style lang="less">
.person-statistic {
  .btn-group {
    button {
      margin-top: -6px;
      margin-left: 4px;
    }
  }
  .ivu-card-extra {
    width: 98%;
  }
}
</style>
