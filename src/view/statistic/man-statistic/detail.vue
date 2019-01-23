/*
 * @Author: yincheng
 * @Date: 2019-01-23 09:40:28
 * @Last Modified by: yincheng
 * @Last Modified time: 2019-01-23 13:03:26
 */
<template>
  <div class="man-detail">
    <Card dis-hover>
      <p slot="title">
        <Icon type="ios-search"/>查询条件
      </p>
      <Form ref="form" :model="form" inline :label-width="120">
        <FormItem prop="date" label="统计时间：">
          <DatePicker
            v-model="form.date"
            type="daterange"
            :options="dateOptions"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
      </Form>
    </Card>
    <br>
    <Card dis-hover>
      <p slot="title"></p>
      <div slot="extra">
        <div class="btn-group">
          <Button type="primary" @click="reset">导出Excel</Button>
          <Button type="primary" @click="reset">编辑工时</Button>
          <Button type="primary" style="float: right" @click="query">查询</Button>
          <Button type="primary" style="float: right" @click="reset">重置</Button>
        </div>
      </div>
      <ChartPie style="height: 400px;" :value="pieData" text="业务工时" :subtext="daterRange"/>
      <Table :columns="columns" :data="tableData.list" :loading="tableLoading">
        <template slot-scope="{ row }" slot="action">
          <Button type="text" size="small" icon="ios-search" style="margin-right: 5px">查看附件</Button>
        </template>
      </Table>
      <br>
      <Page
        show-total
        :total="tableData.total"
        :current.sync="tableData.pageNum"
        show-sizer
        show-elevator
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
    </Card>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import { ChartPie } from "_c/charts";
export default {
  name: "ManDetail",
  components: {
    ChartPie
  },
  data() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    return {
      form: {
        date: [start, end]
      },
      daterRange: dayjs(start).format('YYYY-MM-DD') + '~' + dayjs(end).format('YYYY-MM-DD'),
      dateOptions: {
        shortcuts: [
          {
            text: "最近7天",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "最近30天",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "最近90天",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      },
      pieData: [
        { value: 335, name: "直接访问" },
        { value: 310, name: "邮件营销" },
        { value: 234, name: "联盟广告" },
        { value: 135, name: "视频广告" },
        { value: 1548, name: "搜索引擎" }
      ],
      tableData: {
        list: [],
        total: 0,
        pageNum: 1
      },
      columns: [
        {
          title: "日期",
          key: "time"
        },
        {
          title: "项目名称",
          key: "projectName"
        },
        {
          title: "耗时(h)",
          key: "part"
        },
        {
          title: "日志",
          key: "projectNumber"
        },
        {
          title: "操作",
          key: "action",
          slot: "action",
          align: "center"
        }
      ],
      tableLoading: false
    };
  },
  methods: {
    reset() {
      this.$refs["form"].resetFields();
    },
    query() {
      console.log("query");
    },
    pageChange() {
      this.query();
    },
    pageSizeChange(pageSize) {
      this.tableData.pageSize = pageSize;
      this.query();
    }
  },
  created() {}
};
</script>

<style lang="less">
.man-detail {
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
