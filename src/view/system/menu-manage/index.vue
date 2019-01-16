<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-14 16:46:45
 * @LastEditTime: 2019-01-16 14:03:20
 * @LastEditors: Please set LastEditors
 -->
<template>
    <split-pane v-model="split.offset" min="200px" max="500px">
      <div slot="left" style="height:100%;background:#fff;padding-left:20px;padding-top:10px">
        <Tree :data="tree.data" @on-select-change="onSelectChange" ></Tree>
      </div>

      <div slot="right">
        <Card dis-hover>
          <p slot="title">
            当前分类信息
          </p>
          <Form ref="form" :model="form.params" inline :label-width="80">
            <FormItem  label="上级菜单：">
              {{tree.selectNode.parentNode?tree.selectNode.parentNode.title:'暂无'}}
            </FormItem>
            <FormItem  label="菜单名称：">
              {{tree.selectNode.title}}
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
          <Table :columns="table.columns" :data="table.data" @on-selection-change="onSelectionChange"></Table>
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
        selectNode:{
          id:0, 
          title:'菜单树'
        },
        data:[],
      },
      form: {
        params: {}
      },
      table: {
        columns: [
          {
              type: 'selection',
              width: 60,
              align: 'center'
          },
          {
            title: "菜单名称",
            key: "resourceName"
          },
          {
            title: "菜单类型",
            key: "resourceType",
            render: (h, params) => {
              let text = params.resourceType==1?'父级菜单':(params.resourceType==2?'功能视图':'功能按钮');
              return h('span',text)
            }
          },
          {
            title: "权限标签",
            key: "operatingAuthorization",
          },
          {
            title: "菜单链接",
            key: "permissionUrl"
          },
          {
            title: "权限链接",
            key: "resourceUrl"
          },
          {
            title: "操作",
            key: "operate",
            align: "center",
            render: (h, params) => {
              return h("div", [
                h("span", {
                  class: "operation-btn",
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                }, "编辑"),
                h("span",  {
                  class: "operation-btn",
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                }, "启用"),
                h("span", {
                  class: "operation-btn",
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                }, "禁用"),
                h("span", {
                  class: "operation-btn",
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                }, "升序"),
                h("span", {
                  class: "operation-btn",
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                }, "降序")
              ]);
            }
          }
        ],
        data: [],
        selection:[],
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    /***********************表格操作***************************/
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
    /***********************树方法***************************/
    /**
     * @description: 初始化树函数
     * @param   
     * @return: 
     */
    initTree(){
      getTreeList().then(res => {
        let list = formatTreeList(res.data.data.top);
        this.tree.data = [{ id:0, title:'菜单树', expand: true, children:list }]
      })
    },
    onSelectChange(nodelist,node){
      this.tree.selectNode = node;
      this.initTablbe(node.id);
    },
    /***********************表格方法***************************/
    /**
     * @description: 初始化表格函数
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
    onSelectionChange() {

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
