/*
 * @Author: yincheng
 * @Date: 2019-01-23 09:40:28
 * @Last Modified by: yincheng
 * @Last Modified time: 2019-01-24 16:35:30
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
          <Button type="primary" @click="editManHour">编辑工时</Button>
          <Button type="primary" style="float: right" @click="query(1)">查询</Button>
          <Button type="primary" style="float: right" @click="reset">重置</Button>
        </div>
      </div>
      <div>
        <ChartPie style="height: 400px;" :value="pie.data" text="业务工时" :subtext="daterRange"/>
        <Spin fix szie="large" v-if="pie.loading"></Spin>
      </div>
      <Table :columns="columns" :data="tableData.list" :loading="tableData.loading">
        <template slot-scope="{ row }" slot="action">
          <span class="operation-btn" @click="showAccessory(row.punchId)">查看附件</span>
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
    <Modal v-model="accessory.visible" title="查看附件" width="680" footer-hide>
      <div class="img-body" v-if="accessory.data && accessory.data.length > 0">
        <div v-for="(item, index) in accessory.data" :key="index" class="img-box">
          <Button type="text" class="download-btn" icon="md-download">{{item}}</Button>
          <img :src="item">
        </div>
      </div>
      <p v-else>暂无附件</p>
      <Spin fix szie="large" v-if="accessory.loading"></Spin>
    </Modal>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { ChartPie } from "_c/charts";
import {
  manHourStatisticsChart,
  getStatisticManHour,
  queryPunchAccessory,
  queryStatisticProject
} from "@/api/statistic";
import { formatTime } from "@/libs/util";
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
      daterRange: formatTime(start) + "~" + formatTime(end),
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
      pie: {
        data: [],
        loading: false,
      },
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        loading: false
      },
      columns: [
        {
          title: "日期",
          key: "createDate"
        },
        {
          title: "项目名称",
          key: "projectName"
        },
        {
          title: "耗时(h)",
          key: "elapsedTotal"
        },
        {
          title: "日志",
          key: "recordLog"
        },
        {
          title: "操作",
          key: "action",
          slot: "action",
          align: "center"
        }
      ],
      accessory: {
        data: [],
        visible: false,
        loading: false
      }
    };
  },
  methods: {
    reset() {
      this.$refs["form"].resetFields();
    },
    query(page) {
      this.queryPieData();
      this.queryTableData(page);
    },
    queryPieData() {
      this.pie.loading = true;
      const { date } = this.form;
      manHourStatisticsChart({
        userId: this.$route.query.id,
        startTime: formatTime(date[0]),
        endTime: formatTime(date[1])
      }).then(res => {
        if (res.data.status === 200) {
          this.pie.data = res.data.data.list.map(item => ({
            value: item.elapsedTotal,
            name: item.projectName
          }));
          this.pie.loading = false;
        }
      });
    },
    queryTableData(page) {
      this.tableData.loading = true;
      const { date } = this.form;
      getStatisticManHour({
        userId: this.$route.query.id,
        startTime: formatTime(date[0]),
        endTime: formatTime(date[1]),
        pageNum: page || this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        if (res.data.status === 200) {
          this.tableData = {
            ...res.data.data,
            loading: false
          }
        }
        this.tableData.loading = false;
      });
    },
    pageChange() {
      this.queryTableData();
    },
    pageSizeChange(pageSize) {
      this.tableData.pageSize = pageSize;
      this.queryTableData();
    },
    showAccessory(punchId) {
      this.accessory.data = []
      this.accessory.loading = true;
      this.accessory.visible = true;
      queryPunchAccessory({ punchId }).then(res => {
        if (res.data.status === 200) {
          this.accessory.data = res.data.data.punchAccessoryUrl;
        }
        this.accessory.loading = false;
      });
    },
    editManHour() {
      //to do
    }
  },
  created() {
    this.query();
  }
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
.img-body{
  overflow-x: auto;
  .img-box {
    padding: 4px 0;
    .download-btn {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
