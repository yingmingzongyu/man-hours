<!--
 * @Author: yincheng
 * @Date: 2019-01-10 17:58:57
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-14 11:02:36
 -->
<template>
  <div>
    <Card dis-hover>
      <p slot="title">
        <Icon type="ios-search"/>查询条件
      </p>
      <Form ref="form" :model="form" inline :label-width="80">
        <FormItem prop="projectName" label="项目名称：">
          <Input type="text" v-model="form.projectName" placeholder="请输入关键词" style="width: 180px"/>
        </FormItem>
        <FormItem prop="createTime" label="创建时间：">
          <DatePicker
            type="daterange"
            v-model="form.createTime"
            placeholder="请选择时间"
            style="width: 180px"
          />
        </FormItem>
        <FormItem prop="projectAttribution" label="项目归属：">
          <Select v-model="form.projectAttribution" style="width: 182px">
            <Option value="ZHX" key="ZHX">智恒信</Option>
            <Option value="GX" key="GX">智信共创</Option>
            <Option value="PT" key="PT">平台公司</Option>
          </Select>
        </FormItem>
        <FormItem prop="labelName" label="标签：">
          <Input type="text" v-model="form.labelName" style="width: 180px"/>
        </FormItem>
      </Form>
    </Card>
    <br>
    <Card dis-hover>
      <p slot="title"></p>
      <div slot="extra">
        <div class="btn-group">
          <Button type="primary" icon="ios-search" @click="reset()">重置</Button>
          <Button type="primary" icon="ios-search" @click="query()">查询</Button>
          <Button type="primary" icon="ios-search" @click="showAdd()">新增</Button>
        </div>
      </div>
      <Table :columns="columns" :data="tableData.list" :loading="tableLoading"></Table>
      <br>
      <Page
        :total="tableData.total"
        :current.sync="pageNum"
        show-sizer
        show-elevator
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
    </Card>
    <Modal v-model="modal" title="新增项目" :loading="true">
      <div slot="footer">
        <Button @click="submit" type="info" :loading="submitLoading">提交</Button>
      </div>
      <ProjectFrom ref="form"/>
    </Modal>
  </div>
</template>
<script>
import ProjectFrom from "../project-form";
export default {
  props: {
    tableLoading: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Object,
      required: true,
      default: ()=>({})
    }
  },
  components: {
    ProjectFrom
  },
  data() {
    return {
      form: {
        projectName: null,
        createTime: [],
        projectAttribution: null,
        labelName: null
      },
      columns: [
        {
          title: "项目编号",
          key: "projectNumber"
        },
        {
          title: "项目名称",
          key: "projectName"
        },
        {
          title: "项目归属",
          key: "projectAttribution"
        },
        {
          title: "创建人",
          key: "createUser"
        },
        {
          title: "标签",
          key: "labelName"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "操作",
          key: "address",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Button", {
                props: {
                  type: "text",
                  size: "small",
                  icon: "ios-search"
                },
                on: {
                  click: () => {
                    this.show(params.index);
                  }
                }
              }),
              h("Button", {
                props: {
                  type: "text",
                  size: "small",
                  icon: "ios-search"
                },
                on: {
                  click: () => {
                    this.remove(params.index);
                  }
                }
              }),
              h("Button", {
                props: {
                  type: "text",
                  size: "small",
                  icon: "ios-search"
                },
                on: {
                  click: () => {
                    this.remove(params.index);
                  }
                }
              })
            ]);
          }
        }
      ],
      modal: false,
      submitLoading: false,
      pageNum: this.tableData.pageNum,
      pageSize: this.tableData.pageSize
    };
  },
  methods: {
    //重置
    reset() {
      this.$refs["form"].resetFields();
    },
    //查询
    query() {
      let data = {
        ...this.form,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      data.startTime = data.createTime[0];
      data.endTime = data.createTime[1];
      delete data.createTime;
      this.$emit("query", data);
    },
    //显示add
    showAdd() {
      this.modal = true;
    },
    //add
    submit() {
      this.submitLoading = true;
      this.$refs["form"].$refs["form"].validate(valid => {
        if (valid) {
          this.$emit("submitProject", this.$refs["form"].form, () => {
            this.submitLoading = false;
            this.modal = false;
          });
        } else {
          this.submitLoading = false;
        }
      });
    },
    pageChange(pageNum) {
      this.query();
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.query();
    }
  },
  watch: {
    modal() {
      //重置表单状态
      this.$refs["form"].$refs["form"].resetFields();
    }
  }
};
</script>
<style scoped>
button {
  margin-top: -5px;
  margin-left: 4px;
}
</style>
