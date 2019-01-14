<template>
  <div>
    <Form ref="form" :model="form" inline>
      <FormItem prop="userName" label="用户名：" :label-width="60">
        <Input type="text" v-model="form.userName" style="width: 140px"/>
      </FormItem>
      <FormItem prop="userId" label="登录ID：" :label-width="60">
        <Input type="text" v-model="form.userId" style="width: 140px"/>
      </FormItem>
      <FormItem>
        <Button type="primary" icon="ios-search">查询</Button>
      </FormItem>
    </Form>
    <Table :columns="columns" :data="tableData.list" :loading="tableLoading"/>
    <br>
    <Page
      size="small"
      :total="tableData.total"
      :current.sync="tableData.pageNum"
      show-sizer
      show-elevator
      @on-change="pageChange"
      @on-page-size-change="pageSizeChange"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        projectAttribution: null,
        summarize: null,
        timeEvaluation: null,
        startTime: null,
        endTime: null,
        participants: null
      },
      rules: {
        projectAttribution: [
          {
            required: true,
            message: "项目归属不能为空",
            trigger: "change"
          }
        ],
        projectName: [
          {
            required: true,
            message: "项目名称不能为空",
            trigger: "blur"
          }
        ],
        participants: [
          {
            required: true,
            message: "项目参与人员不能为空",
            trigger: "blur"
          }
        ]
      },
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "工号",
          key: "projectName"
        },
        {
          title: "登录ID",
          key: "projectAttribution"
        },
        {
          title: "用户名",
          key: "createUser"
        }
      ],
      tableLoading: false,
      tableData: {
        list: [],
        total: 40,
        pageNum: 1,
        pageSize: 10
      },
      user: [1, 2, 3]
    };
  },
  methods: {
    query() {
      console.log("query");
    },
    pageChange(pageNum) {
      this.query();
    },
    pageSizeChange(pageSize) {
      this.tableData.pageSize = pageSize;
      this.query();
    }
  }
};
</script>
<style scoped>
</style>
