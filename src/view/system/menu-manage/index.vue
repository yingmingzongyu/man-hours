<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-14 16:46:45
 * @LastEditTime: 2019-01-22 17:45:30
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
          <Form ref="form" :model="form.params" inline :label-width="100">
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
              <Button type="primary" @click="deleteHandler()">删除</Button>
              <Button type="primary" @click="addHandler()">新增</Button>
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
        <!--弹窗-->
          <Modal v-model="addEditDialog.show" :title="addEditDialog.type=='add'?'新增菜单':'编辑菜单'" :loading="true" @on-visible-change="onVisibleChange">
            <div slot="footer">
              <Button @click="submit" type="info" :loading="addEditDialog.submitLoading">保存</Button>
            </div>
            <Form ref="addEditDialogForm" :model="addEditDialog.params" :rules="addEditDialog.rules" inline :label-width="130" >
              <FormItem  label="父菜单名称：">
                {{tree.selectNode.title}}
              </FormItem>
              <FormItem prop="resourceName" label="菜单名称：">
                <Input type="text" v-model="addEditDialog.params.resourceName" placeholder="请输入菜单名称" style="width: 250px" />
              </FormItem>
              <FormItem prop="resourceUrl" label="菜单链接：">
                <Input type="text" v-model="addEditDialog.params.resourceUrl" placeholder="请输入菜单链接" style="width: 250px" />
              </FormItem>
              <FormItem prop="permissionUrl" label="权限URL：">
                <Input type="text" v-model="addEditDialog.params.permissionUrl" placeholder="请输入权限链接" style="width: 250px" />
              </FormItem>
              <FormItem prop="resourceType" label="菜单类型：">
                <Radio-group v-model="addEditDialog.params.resourceType">
                  <Radio :label="1">
                    <span>父级页面</span>
                  </Radio>
                  <Radio :label="2">
                    <span>功能视图</span>
                  </Radio>
                  <Radio :label="3">
                    <span>功能按钮</span>
                  </Radio>
                </Radio-group>
              </FormItem>
              <FormItem prop="operatingAuthorization" label="权限标签：" v-if="addEditDialog.params.resourceType==3" >
                <Checkbox-group v-model="addEditDialog.params.operatingAuthorization">
                  <Checkbox :label="1">查询</Checkbox>
                  <Checkbox :label="2">新增</Checkbox>
                  <Checkbox :label="3">更新</Checkbox>
                  <Checkbox :label="4">删除</Checkbox>
                </Checkbox-group>
              </FormItem>
            </Form>
          </Modal>
      </div>
    </split-pane>
</template>
<script>
import {
  getTreeList, getMenuTable, addMenuFun, editMenuFun, batchDeleteMenu, sortMenuFun
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
            key: "resourceUrl"
          },
          {
            title: "权限链接",
            key: "permissionUrl"
          },
          {
            title: "操作",
            key: "operate",
            align: "center",
            width: 230,
            render: (h, params) => {
              return h("div", [
                h("span", {
                  class: "operation-btn",
                  on: {
                    click: () => {
                      this.editHandler(params.row);
                    }
                  }
                }, "编辑"),
                h("span",  {
                  class: params.row.visible?"operation-btn ban-btn":"operation-btn",
                  on: {
                    click: () => {
                      params.row.visible?"operation-btn ban-btn":this.toggleHandler(params.row,1);
                    }
                  }
                }, "启用"),
                h("span",  {
                  class: params.row.visible?"operation-btn":"operation-btn ban-btn",
                  on: {
                    click: () => {
                      params.row.visible?this.toggleHandler(params.row,0):"operation-btn ban-btn";
                    }
                  }
                }, "禁用"),
                h("span", {
                  class: "operation-btn",
                  on: {
                    click: () => {
                      this.sortHandler(params.row.id,1);
                    }
                  }
                }, "升序"),
                h("span", {
                  class: "operation-btn",
                  on: {
                    click: () => {
                      this.sortHandler(params.row.id,2);
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
      },
      addEditDialog:{
        show:false,
        type:'add',
        submitLoading: false,
        params:{
          resourceName:'',
          resourceType:'',
          resourceUrl:'',
          permissionUrl:'',
          operatingAuthorization:[]
        },
        rules:{
          resourceName:[
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ],
          resourceType:[
            { required: true, type:'number', message: '请选择菜单类型', trigger: 'change' }
          ],
          resourceUrl:[
            { required: true, message: '请输入菜单链接', trigger: 'blur' }
          ],
          permissionUrl:[
            { required: true, message: '请输入权限URL', trigger: 'blur' }
          ],
          operatingAuthorization:[
            { required: true, type:'number', message: '请选择权限标签', trigger: 'change' }
          ]
        }
      }
    };
  },
  methods: {
    /***********************表格操作***************************/
    /**
     * @description: 删除方法
     * @param {type} --
     * @return: 
     */
    deleteHandler() {
      let ids = this.table.selection.join(',');
      batchDeleteMenu(ids,-1).then(res=>{
        let {status, message} = res.data;
        if(status==200){
          this.$Message.success(message);
          this.table.pageNum = 1;
          this.initTree();
          this.initTablbe();
        }else{
          this.$Message.warning(message);
        }
      })
    },
    /**
     * @description: 新增方法
     * @param {type} --
     * @return: 
     */
    addHandler() {
      this.addEditDialog.show = true;
      this.addEditDialog.type = 'add';
    },
    /**
     * @description: 编辑方法
     * @param {Object} row 表格该列数据
     * @return: 
     */
    editHandler(row) {
      this.addEditDialog.show = true;
      this.addEditDialog.type = 'edit';
      // 从row选取回显值
      let {id,resourceName,resourceType,resourceUrl,permissionUrl,operatingAuthorization} = row;
      // 加工选取的回显值
      operatingAuthorization = operatingAuthorization&&operatingAuthorization.length>0?operatingAuthorization.split(','):[]
      // 赋值给addEditDialog.params回显
      this.addEditDialog.params = {id,resourceName,resourceType,resourceUrl,permissionUrl,operatingAuthorization}
    },
    /**
     * @description: 启禁用方法
     * @param {Number} status 1启用 0禁用
     * @param {Object} row 该列数据
     * @return: 
     */
    toggleHandler(row, status){
      batchDeleteMenu(row.id,status).then(res=>{
        let {status, message} = res.data;
        if(status==200){
          this.$Message.success(message);
          this.initTree();
          this.initTablbe();
        }else{
          this.$Message.warning(message);
        }
      })
    },
    /**
     * @description: 排序方法
     * @param {Number} id 排序数据的id
     * @param {Number} sort 1升序 2降序
     * @return: 
     */
    sortHandler(id, sort){
      sortMenuFun(id,sort).then(res=>{
        let {status, message} = res.data;
        if(status==200){
          this.$Message.success(message);
          this.initTree();
          this.initTablbe();
        }else{
          this.$Message.warning(message);
        }
      });
    },
    
    /***********************moadl方法***************************/
    submit(){
      this.$refs['addEditDialogForm'].validate((valid) => {
        if (valid) {
          let params = {
            parentResourceId: this.tree.selectNode.id,
            ...this.addEditDialog.params,
            parentFlag: this.addEditDialog.params.resourceType===1?true:false
          }
          params.operatingAuthorization =  params.operatingAuthorization.join(',');
          this.addEditDialog.type==="add"?
          addMenuFun(params).then(res=>{
            let {status, message} = res.data;
            if(status==200){
              this.$Message.success(message);
              this.addEditDialog.show = false;
              this.initTree();
              this.initTablbe();
            }else{
              this.$Message.warning(message);
            }
          }):
          editMenuFun(params).then(res=>{
            let {status, message} = res.data;
            if(status==200){
              this.$Message.success(message);
              this.addEditDialog.show = false;
              this.initTree();
              this.initTablbe();
            }else{
              this.$Message.warning(message);
            }
          });
        }
      })

    },
    onVisibleChange(visible) {
      if(!visible){
        this.$refs['addEditDialogForm'].resetFields();
      }
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
    /**
     * @description: 选取树节点事件
     * @param {type} 
     * @return: 
     */
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
        this.table.total = total;
        if(pages < pageNum && pages!= 0){
          this.table.pageNum = pages;
        }
      })
    },
    /**
     * @description: 初始化表格函数
     * @param {Array} selection选中的数据集合
     * @return: 
     */
    onSelectionChange(selection) {
      this.table.selection = selection.map(v=> v.id);
      console.log(this.table.selection);
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
