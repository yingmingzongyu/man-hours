<template>
  <div>
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
        <FormItem prop="organizationName" label="部门：">
          <Input
            type="text"
            v-model="form.organizationName"
            readonly
            placeholder="请选择部门"
            style="width: 200px"
            icon="md-apps"
            @click.native="showOrganize"
          />
        </FormItem>
        <FormItem prop="userName" label="人员姓名：">
          <Input v-model="form.userName"/>
        </FormItem>
      </Form>
    </Card>
    <br>
    <Card dis-hover>
      <p slot="title"></p>
      <div slot="extra">
        <div class="btn-group">
          <Button type="primary" @click="reset">重置</Button>
          <Button type="primary" @click="query(true)">查询</Button>
        </div>
      </div>
      <Table :columns="columns" :data="tableData.list" :loading="tableLoading">
        <template slot-scope="{ row }" slot="action">
          <Button
            type="text"
            size="small"
            icon="ios-search"
            style="margin-right: 5px"
            @click="goToDetail(row)"
          ></Button>
          <Button type="text" size="small" icon="ios-search" @click="goToStatistic(row)"></Button>
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
    <OrganizeTree v-model="organizeVisible" :data="form.organizationId" @submit="setOrganize"/>
  </div>
</template>
<script>
import OrganizeTree from "@/components/organize-tree";
import { getManHourStatistics } from "@/api/statistic";
import { formatTime } from "@/libs/util";
export default {
  components: {
    OrganizeTree
  },
  data() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    return {
      form: {
        date: [start, end],
        organizationName: null,
        organizationId: null,
        userName: null
      },
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
      columns: [
        {
          title: "用户ID",
          key: "userId"
        },
        {
          title: "人员姓名",
          key: "userName"
        },
        {
          title: "部门",
          key: "organizationName"
        },
        {
          title: "参与项目数量",
          key: "involvedProjectTotal"
        },
        {
          title: "总工作时间(h)",
          key: "workTimeTotal"
        },
        {
          title: "完成打卡天数",
          key: "punchTotal"
        },
        {
          title: "操作",
          key: "action",
          slot: "action",
          align: "center"
        }
      ],
      organizeVisible: false,
      tableData: {
        list: [],
        total: 0,
        pageNum: 1
      },
      tableLoading: false
    };
  },
  methods: {
    showOrganize() {
      this.organizeVisible = true;
    },
    setOrganize(data) {
      if (data.id) {
        this.form.organizationId = data.id;
        this.form.organizationName = data.organizationName;
      }
    },
    reset() {
      this.$refs["form"].resetFields();
      this.form.organizationId = null
    },
    query(page) {
      //query
      this.tableLoading = true;
      const { organizationId, date, userName } = this.form;
      const { pageNum, pageSize } = this.tableData
      const params = {
        organizationId,
        startTime: formatTime(date[0]),
        endTime: formatTime(date[1]),
        userName,
        pageNum: page || pageNum,
        pageSize
      }
      console.log(params)
      getManHourStatistics(params).then(res => {
        if (res.data.status === 200) {
          console.log(res)
          this.tableData = res.data.data;
        }
        this.tableLoading = false;
      });
    },
    pageChange() {
      this.query();
    },
    pageSizeChange(pageSize) {
      this.tableData.pageSize = pageSize;
      this.query();
    },
    goToDetail(data) {
      console.log(data);
      //前往详情页
      this.$router.push({
        path: "/statistic/man-detail",
        query: {
          id: data.userId
        }
      });
    },
    goToStatistic(data) {
      //前往分析页
      this.$router.push({
        path: "/statistic/work-statistic",
        query: {
          id: data.id,
          userName: data.userName
        }
      });
    }
  },
  created() {
    this.query();
  }
};
</script>
<style lang="less">
.btn-group {
  button {
    margin-top: -6px;
    margin-left: 4px;
  }
}
</style>
