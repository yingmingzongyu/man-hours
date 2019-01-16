<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-14 16:46:45
 * @LastEditTime: 2019-01-16 10:08:29
 * @LastEditors: Please set LastEditors
 -->
<template>
    <split-pane v-model="split.offset" min="200px" max="500px">
      <div slot="left" style="height:100%;background:#fff;padding-left:20px;padding-top:10px">
        <Tree :data="tree.data" ></Tree>
      </div>

      <div slot="right">
        <Card dis-hover>
          <p slot="title">
            当前分类信息
          </p>
          <Form ref="form" :model="form.params" inline :label-width="80">
            <FormItem  label="上级菜单:">
              {{form.params.parentName}}
            </FormItem>
            <FormItem  label="菜单名称:">
              {{form.params.parentName}}
            </FormItem>
          </Form>
        </Card>
        <br>
        <Card dis-hover>
          <p slot="title"></p>
          <div slot="extra">
            <div class="btn-group">
              <Button type="primary" @click="reset()">删除</Button>
              <Button type="primary" @click="showAdd()">新增</Button>
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
import {
  getTreeList, getMenuTable
} from '@/api/system.js'
import {
  formatTreeList
} from '@/libs/util.js';
import SplitPane from "_c/split-pane";
export default {
  components: {
    SplitPane
  },
  data() {
    return {
      split:{
        offset: 0.2,
      },
      tree:{
        data:[],
      },
      form: {
        params: {}
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
        pageNum: 1,
        pageSize: 10
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
     * @description: 初始化树函数
     * @param   
     * @return: 
     */
    initTree(){
      getTreeList().then(res => {
        let list = formatTreeList(res.data.data.top);
        this.tree.data = [{ id:0, title:'菜单树', expand: true, children:list }]
        console.log(JSON.stringify(this.tree.data))
      })
      
    },
    /**
     * @description: 获取表格数据实体函数
     * @param {Number} parentId当前分页页面ID
     * @return: 
     */
    initTablbe(parentId=0){
      let params = {
        ...this.form.query,
        parentId,
        pageNum: this.table.pageNum,
        pageSize: this.table.pageSize
      }
      getMenuTable(params).then(res=>{
        let { list, total, pages, pageNum} = res.data.data;
        this.table.data = list;
        if(pages < pageNum && pages!= 0){
          this.table.pageNum = pages;
        }
      })
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
  mounted() {
    this.initTablbe();

    this.initTree();
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
