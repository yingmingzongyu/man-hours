<!--标签管理-->
<template>
  <div class="label-manage">
    <Card dis-hover>
      <p slot="title">
        <Icon type="ios-search"/>查询条件
      </p>
      <Form ref="form" :model="form" inline :label-width="120">
        <FormItem prop="labelName" label="标签名称：">
          <Input type="text" v-model="form.labelName" placeholder="请输入标签名称" style="width: 180px"/>
        </FormItem>
      </Form>
    </Card>
    <br>
    <Card dis-hover>
      <p slot="title"></p>
      <div slot="extra">
        <div class="btn-group">
          <Button type="primary" @click="query(true)">查询</Button>
        </div>
      </div>
      <Table :columns="columns" :data="tableData.list" :loading="tableLoading"></Table>
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
import { getLabel, delLabel } from "@/api/project";
export default {
  data() {
    return {
      form: {
        labelName: null
      },
      columns: [
        { title: "标签名称", key: "labelName" },
        { title: "标签关联项目数量", key: "relatedProjectsCount" },
        {
          title: "操作",
          key: "handle",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要删除吗?"
                  },
                  on: {
                    "on-ok": () => {
                      this.deleteData(params.row.id);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableLoading: false,
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    // 查询
    query(first) {
      this.tableLoading = true;
      let data = {
        ...this.form,
        pageNum: first ? 1 : this.tableData.pageNum,
        pageSize: this.tableData.pageSize
      };
      getLabel(data).then(res => {
        if (res.data.status === 200) {
          this.tableData = res.data.data;
        }
        this.tableLoading = false;
      });
    },
    pageChange(pageNum) {
      this.tableData.pageNum = pageNum;
      this.query();
    },
    pageSizeChange(pageSize) {
      this.tableData.pageSize = pageSize;
      this.query();
    },
    deleteData(id) {
      delLabel({
        id
      }).then(res => {
        if (res.data.status === 200) {
          this.tableData.list = this.tableData.list.filter(
            item => item.id !== id
          );
          this.tableData.total -= 1;
          this.$Message.success(res.data.message);
        }
      });
    }
  },
  watch: {},
  created() {
    this.query();
  }
};
</script>

<style lang="less">
.label-manage {
  button {
    margin-top: -5px;
    margin-left: 4px;
  }
  .ivu-poptip-rel {
    cursor: pointer;
    color: #2d8cf0;
  }
  .ivu-poptip-confirm .ivu-poptip-footer {
    text-align: center;
  }
  .ivu-poptip-confirm .ivu-poptip-body .ivu-icon {
    left: 20px;
  }
}
</style>
