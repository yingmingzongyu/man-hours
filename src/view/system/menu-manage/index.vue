<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-14 16:46:45
 * @LastEditTime: 2019-01-15 13:47:39
 * @LastEditors: Please set LastEditors
 -->
<template>
    <split-pane v-model="split.offset">
      <div slot="left" style="height:100%;background:#fff">
      </div>

      <div slot="right">
        <Card dis-hover>
          <p slot="title">
            <Icon type="ios-search"/>查询条件
          </p>
          <Form ref="form" :model="form.params" inline :label-width="80">
            <FormItem prop="projectName" label="项目名称：">
              <Input
                type="text"
                v-model="form.projectName"
                placeholder="请输入关键词"
                style="width: 180px"
              />
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
          <Table :columns="table.columns" :data="table.data"></Table>
          <br>
          <Page
            :total="table.total"
            :current.sync="table.pageNum"
            show-sizer
            show-elevator
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"
          />
        </Card>
      </div>
    </split-pane>
</template>
<script>
import SplitPane from "_c/split-pane";
export default {
  components: {
    SplitPane,
    modalComponsents
  },
  data() {
    return {
      split:{
        offset: 0.2,
        offsetVertical: '250px'
      },
      form: {
        params: {},
        query:{}
      },
      table: {
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
        data: [],
        total: 0,
        pageNum: 0
      }
    };
  },
  methods: {
    
    /**
     * @description: 重置函数：将searchForm的数据重置
     * @param {type} 
     * @return: 
     */
    reset() {
      this.$refs["form"].resetFields();
    },
    /**
     * @description: 查询函数：将searchForm的数据与实际搜索数据合并惊醒查询
     * @param {type} 
     * @return: 
     */
    query() {
      this.form.query = {
        ...this.form.params,
      };
      this.table.pageNum = 1;
      this.initTablbe();
    },
    /**
     * @description: 获取表格数据实体函数
     * @param   
     * @return: 
     */
    initTablbe(){
      let params = {
        ...this.form.query,
        pageNum: this.table.pageNum,
        pageSize: this.table.pageSize
      }
      console.log(params);
    },
    /**
     * @description: pageNum变动函数
     * @param {Number} pageNum
     * @return: 
     */
    pageChange() {
      this.initTablbe();
    },
    /**
     * @description: pageSize变动函数
     * @param {Number} pageSize
     * @return: 
     */
    pageSizeChange(pageSize) {
      this.table.pageSize = pageSize;
      this.initTablbe();
    }
  },
  watch: {

  }
};
</script>
<style>
.ivu-split-trigger-vertical{
  box-shadow: none !important;
}
button {
  margin-top: -5px;
  margin-left: 4px;
}
</style>
