<!--
 * @Description: In User Settings Edit
 * @Author: Zero
 * @Date: 2019-01-16 10:29:42
 * @LastEditTime: 2019-01-22 13:11:21
 * @LastEditors: Please set LastEditors
 -->
<!--用户管理-->
<template>
  <div class="user-manage">
    <Card dis-hover>
      <p slot="title">
        <Icon type="ios-search"/>查询条件
      </p>
      <Form ref="searchForm" :model="form.params" inline :label-width="80">
        <FormItem prop="userCode" label="工号：">
          <Input type="text" v-model="form.params.userCode" placeholder="请输入工号" style="width: 180px"/>
        </FormItem>
        <FormItem prop="userName" label="姓名：">
          <Input type="text" v-model="form.params.userName" placeholder="请输入姓名" style="width: 180px"/>
        </FormItem>
        <FormItem prop="organizationName" label="部门：">
          <Input type="text" v-model="form.params.organizationName" readonly placeholder="请选择部门" style="width: 180px" icon="md-apps" @on-click="organizeOpen('search')" />
        </FormItem>
        <FormItem prop="availableStatus" label="在职状态：">
          <Select v-model="form.params.availableStatus" style="width: 180px">
            <Option value="">全部</Option>
            <Option value="0">在职</Option>
            <Option value="1">离职</Option>
          </Select>
        </FormItem>
        <FormItem prop="accountStatus" label="账号状态：">
          <Select v-model="form.params.accountStatus" style="width: 180px">
            <Option value="">全部</Option>
            <Option value="0">启用</Option>
            <Option value="1">禁用</Option>
          </Select>
        </FormItem>
      </Form>
    </Card>
    <br>
    <Card dis-hover>
      <p slot="title"></p>
      <div slot="extra">
        <div class="btn-group">
          <Upload style="float: left;" :show-upload-list="false" action="/api/itsm/system/sso/user/importPoiExcelUser" :on-success="uploadSuccess" :on-error="uploadError" :headers="{Token:$store.state.user.token}">
            <Button type="primary" >导入</Button>
          </Upload>
          <Button type="primary" @click="downTmplHandler()">下载导入模板</Button>
          <Button type="primary" @click="exportHandler()">导出</Button>
          <Button type="primary" @click="deleteHandler()">删除</Button>
          <Button type="primary" style="float: right;" @click="addEditOpen('add')">新增</Button>
          <Button type="primary" style="float: right;" @click="queryHandler()">查询</Button>
          <Button type="primary" style="float: right;" @click="resetHandler()">重置</Button>
        </div>
      </div>
      <Table :columns="table.columns" :data="table.data" :loading="tableLoading" @on-selection-change="onSelectionChange"></Table>
      <br>
      <Page
        :total="table.total"
        :current.sync="table.pageNum"
        show-sizer
        show-elevator
        show-total
        @on-change="pageChange"
      />
    </Card>

    <!--弹窗-->
    <Modal
      v-model="addEditDialog.show" :title="addEditDialog.type=='add'?'新增用户':'编辑用户'" class-name="user-dialog" :loading="true" @on-visible-change="onVisibleChange">
      <div slot="footer">
        <Button @click="addEditSave()" type="info" :loading="addEditDialog.submitLoading">保存</Button>
      </div>
      <Tabs v-model="addEditDialog.tabs">
        <TabPane label="基本信息" name="basic">
          <Form ref="addEditDialogForm" :model="addEditDialog.params" inline :label-width="130" :rules="addEditDialog.rules"
          >
            <FormItem prop="userName" label="名称：">
              <Input type="text" v-model="addEditDialog.params.userName" placeholder="请输入姓名" style="width: 200px" />
            </FormItem>
            <FormItem prop="loginName" label="登录ID：">
              <Input type="text" v-model="addEditDialog.params.loginName" placeholder="请输入登录ID" style="width: 200px" />
            </FormItem>
            <FormItem prop="userCode" label="工号：">
              <Input type="text" v-model="addEditDialog.params.userCode" placeholder="请输入工号" style="width: 200px" />
            </FormItem>
            <FormItem prop="position" label="职位：">
              <Select v-model="addEditDialog.params.position" style="width: 200px">
                <Option value="1">普通职员</Option>
                <Option value="2">中层</Option>
                <Option value="3">部门经理</Option>
                <Option value="4">管理层</Option>
              </Select>
            </FormItem>
            <FormItem prop="organizationName" label="部门：">
              <Input type="text" v-model="addEditDialog.params.organizationName" readonly placeholder="请选择部门" style="width: 200px" icon="md-apps" @on-click="organizeOpen('modal')" />
            </FormItem>
            <FormItem prop="sex" label="性别：">
              <RadioGroup v-model="addEditDialog.params.sex">
                <Radio :label="0">
                    <span>男</span>
                </Radio>
                <Radio :label="1">
                    <span>女</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem prop="mobile" label="手机：">
              <Input type="text" v-model="addEditDialog.params.mobile" placeholder="请输入手机号码" style="width: 200px" />
            </FormItem>
            <FormItem prop="accountStatus" label="账号状态：">
              <RadioGroup v-model="addEditDialog.params.accountStatus">
                <Radio label="0">
                    <span>启用</span>
                </Radio>
                <Radio label="1">
                    <span>禁用</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem prop="phone" label="联系电话：">
              <Input type="text" v-model="addEditDialog.params.phone" placeholder="请输入联系电话" style="width: 200px" />
            </FormItem>
            <FormItem prop="availableStatus" label="在职状态：">
              <RadioGroup v-model="addEditDialog.params.availableStatus">
                <Radio label="0">
                    <span>在职</span>
                </Radio>
                <Radio label="1">
                    <span>离职</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem prop="email" label="电子邮件：">
              <Input type="text" v-model="addEditDialog.params.email" placeholder="请输入电子邮件地址" style="width: 200px"  />
            </FormItem>
            <FormItem prop="description" label="用户描述：">
              <Input type="textarea" v-model="addEditDialog.params.description" placeholder="请输入用户描述" style="width: 400px" />
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="角色" name="roles" >
          <Table :columns="addEditDialog.columns" ref='roleTable' :data="addEditDialog.data" @on-selection-change="onSelectionRole" size="small" height="380" ></Table>
        </TabPane>
      </Tabs>
    </Modal>
    <organizeTree v-model="organize.show"  :data="organize.organizationId" @submit="organizeSave"></organizeTree>
  </div>
</template>

<script>
import { 
  getUserTable, getUserDetail, addUserFun, delUserFun, editUserFun, getRole, resetUserPass, exportUserFun
} from "@/api/system";
// 组织单选弹框
import organizeTree from '../components/organize-tree.vue'
export default {
  components:{
    organizeTree
  },
  props: {
    tableLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 组织弹框
      organize:{
        type:'search',
        show: false,
        organizationId: 0
      },
      form: {
        params: {
          userCode: "", // 工号
          userName: "", // 姓名
          organizationId: "", //部门
          organizationName: "", //部门名称
          accountStatus: "", // 账号状态
          availableStatus: "" // 在职状态
        },
        query: {
          userCode: "", // 工号
          userName: "", // 姓名
          organizationId: "", //部门
          organizationName: "", //部门名称
          accountStatus: "", // 账号状态
          availableStatus: "" // 在职状态
        }
      },
      table: {
        columns: [
          { type: 'selection',width: 60,align: 'center'},
          { title: "工号", key: "userCode" },
          { title: "姓名", key: "userName" },
          { title: "登录ID", key: "loginName" },
          { title: "部门", key: "organizationName" },
          { title: "性别", key: "sex", render:(h, params)=>{
            let text = params.row.sex == '0'?'男':'女';
            return h('span', null, text)
          } },
          { title: "在职状态", key: "availableStatus", render:(h, params)=>{
            let text = params.row.availableStatus == '0'?'在职':'离职';
            return h('span', null, text)
          }  },
          { title: "账号状态", key: "accountStatus", render:(h, params)=>{
            let text = params.row.accountStatus == '0'?'启用':'禁用';
            return h('span', null, text)
          }  },
          { title: "手机", key: "mobile" },
          {
            title: "操作",
            key: "handle",
            align: "center",
            width: 120,
            render: (h, params) => {
              return h("div", [
                h(
                  "span",
                  {
                    class: "operation-btn",
                    on: {
                      click: () => {
                        this.addEditOpen("edit", params.row.id);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Poptip",
                  {
                    props: {
                      confirm: true,
                      title: "你确定要重置密码吗?"
                    },
                    on: {
                      "on-ok": () => {
                        this.resetPassHandler(params.row.id)
                      }
                    }
                  },
                  "重置密码"
                )
              ]);
            }
          }
        ],
        data: [],
        selection: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      // 新增角色
      addEditDialog: {
        show: false,
        type: "add", // 新增还是编辑
        tabs: "basic",
        submitLoading: false,
        // 基本信息
        params: {
          loginName: "", // 登录名
          userName: "", // 姓名
          userCode: "", // 工号
          organizationName:"", // 部门
          organizationId:"", // 部门
          mobile: "", // 手机
          phone: "", // 联系电话
          email:"", // 电子邮件
          position: "", // 职位
          sex: "", // 性别
          accountStatus:"", // 账号状态
          availableStatus: "", // 组织状态
          roleIds: "", // 角色id数组
        },
        rules:{
          loginName: [
            { required: true, message: '请输入登录ID', trigger: 'blur' }
          ], // 登录名
          userName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ], // 姓名
          userCode: [
            { required: true, message: '请输入工号', trigger: 'blur' }
          ], // 工号
          organizationName:[
            { required: true, message: '请选择部门', trigger: 'blur' }
          ], // 部门
          mobile: [
            { required: true, message: '请输入手机号码', trigger: 'blur' }
          ], // 手机
          email:[
            { required: true, message: '请输入电子邮件地址', trigger: 'blur' }
          ], // 电子邮件
          position: [
            { required: true, message: '请选择职位', trigger: 'blur' }
          ], // 职位
        },
        // 角色
        data:[],
        columns:[
          {type: 'selection',width: 60,align: 'center'},
          { title: "角色名称", key: "roleName" },
					{ title: "描述", key: "description" },
        ],
        selection:[]
      }
    };
  },
  methods: {
    /***********************操作按钮***************************/
    /**
     * @description: 导出函数
     * @param {userIds} 导出的用户id
     * @return:
     */
    exportHandler(){
      if(this.table.selection.length == 0){
        this.$Message.warning('请选择要导出的数据!')
        return
      }  
      let token = this.$store.state.user.token, ids = this.table.selection.join(',');
      window.open(`/api/itsm/system/sso/user/exportExcelUser?Token=${token}&userIds=${ids}`)
    },
    uploadSuccess(response, file, fileList){
      let { status, message } = response;
      if(status==200){
        this.$Message.success(message);
      }else{
        this.$Message.warning(message);
      }
    },
    uploadError(error, file, fileList){
      this.$Message.error('上传失败');
    },
    /**
     * @description: 下载模板
     * @param {type}
     * @return:
     */
    downTmplHandler() {
      let token = this.$store.state.user.token;
      window.open(`/api/itsm/system/sso/user/downloadExcelUser?Token=${token}`)
    },

    /**
     * @description: 查询函数：将searchForm的数据与实际搜索数据合并进行查询
     * @param {type} --
     * @return:
     */
    queryHandler() {
      this.form.query = {
        ...this.form.params
      };
      this.table.pageNum = 1;
      this.initTablbe();
    },

    /**
     * @description: 重置函数
     * @param {type} --
     * @return:
     */
    resetHandler() {
      this.form.params.organizationId = '';
      this.$refs['searchForm'].resetFields();
      console.log(this.form.params);
    },

    /**
     * @description: 删除函数
     * @param {String} id 要删除用户的id
     * @return:
     */
    deleteHandler() {
      const self = this;
      if(self.table.selection.length == 0){
        self.$Message.warning('请选择要删除的用户！');
        return;
      } else{
        self.$Modal.warning({
          title:'提示',
          content:"是否删除所选中的用户？",
          closable: true,
          onOk:()=>{
            let id = self.table.selection.join(',');
            delUserFun(id).then(res=>{
              let {status, message} = res.data;
              if(status == 200){
                self.$Message.success(message)
                self.initTablbe()
              }else{
                self.$Message.warning(message)
              }
            })
          }
        })
      }
      
      
      
    },

    /**
     * @description: 新增函数
     * @param {type} --
     * @return:
     */
    addEditOpen(v,id) {
      this.addEditDialog.show = true;
      this.addEditDialog.type = v;
      this.addEditDialog.tabs = 'basic';
      if(v=='edit'){
        getUserDetail(id).then(res=>{
          // 获取用户详细信息并格式化
          let row = {
            ...res.data.data.userBean,
            roleIds: res.data.data.roleList
          }
          Object.keys(this.addEditDialog.params).map(v=>{
            this.addEditDialog.params[v] = row[v];
          })
          this.addEditDialog.params.id = row.id;
        }).then(res=>{
          return getRole()
        }).then(res=>{
          if(res.data.status === 200) {
            this.addEditDialog.data = res.data.data;
            // 获取所有角色 并赋值给tab2页中的表格
            this.$nextTick(()=>{
              let roleIds = this.addEditDialog.params.roleIds.length>0?this.addEditDialog.params.roleIds.map(v=>v.id):[], roleData = this.$refs['roleTable'].$refs.tbody.objData;
              if(roleIds.length>0) for(var k in roleData){
                // 遍历回显 选中的role
                if(roleIds.indexOf(roleData[k].id)!==-1){
                  roleData[k]._isChecked = true
                } 
              }
            })
          }
        })
      }else{
        getRole().then(res=>{
          if(res.data.status === 200) {
            this.addEditDialog.data = res.data.data;
            // 获取所有角色 并赋值给tab2页中的表格
            this.$nextTick(()=>{
              let roleIds = this.addEditDialog.params.roleIds.length>0?this.addEditDialog.params.roleIds.map(v=>v.id):[], roleData = this.$refs['roleTable'].$refs.tbody.objData;
            })
          }
        })
      }
    },

    /**
     * @description: 重置密码
     * @param {String} id 需要重置密码的用户id
     * @return:
     */
    resetPassHandler(id){
      resetUserPass(id).then(res=>{
        let {status, message} = res.data;
        if(status == 200){
          this.$Message.success(message)
        }else{
          this.$Message.warning(message)
        }
      })
    },
    /***********************modal方法***************************/
    /**
     * @description: 打开部门选择弹框
     * @param {type} --
     * @return:
     */
    organizeOpen(t){
      this.organize.show = true
      this.organize.type = t
      if(t=='search'){
        this.organize.organizationId = this.form.params.organizationId || 0;
      }else{
        this.organize.organizationId = this.addEditDialog.params.organizationId || 0;
      }
    },

    /**
     * @description: 保存部门选择弹框
     * @param {type} --
     * @return:
     */
    organizeSave(data){
      if(this.organize.type == 'search'){
        this.form.params.organizationId = data.id
        this.form.params.organizationName = data.organizationName
      }else{
        this.addEditDialog.params.organizationId = data.id
        this.addEditDialog.params.organizationName = data.organizationName
      }
     
    },

    /**
     * @description: 提交编辑或新增
     * @param {type} --
     * @return:
     */
    addEditSave() {
      this.$refs['addEditDialogForm'].validate((valid) => {
        if (valid) {
          this.addEditDialog.params.roleIds = this.addEditDialog.selection.join(',');
          let type = this.addEditDialog.type, params = {
            ...this.addEditDialog.params
          }
          type == 'add'?
          addUserFun(params).then(res=>{
            let {status, message} = res.data;
            if(status == 200){
              this.$Message.success(message)
              this.addEditDialog.show = false
              this.table.pageNum = 1;
              this.initTablbe()
            }
          }):
          editUserFun(params).then(res=>{
            let {status, message} = res.data;
            if(status == 200){
              this.$Message.success(message)
              this.addEditDialog.show = false
              this.initTablbe()
            }
          });
        }
      })
    },
    onSelectionRole(selection){
      this.addEditDialog.selection = selection.map(v=> v.id)
    },
    pageChangeRole(v){
      getRole({pageNum: v,pageSize: 10}).then(res=>{
        if(res.data.status === 200) {
          this.addEditDialog.data = res.data.data;
        }
      })
    },
    onVisibleChange(visible) {
      if(!visible){
        this.addEditDialog.params.organizationId = '';
        this.$refs['addEditDialogForm'].resetFields();
      }
    },
    /***********************表格方法***************************/
    /**
     * @description: 初始化表格函数
     * @param {type} 
     * @return:
     */
    initTablbe() {
      let params = {
        ...this.form.query,
        pageNum: this.table.pageNum,
        pageSize: this.table.pageSize
      };
      getUserTable(params).then(res => {
        let { list, total, pages, pageNum } = res.data.data;
        this.table.data = list;
        this.table.total = total;
        if (pages < pageNum && pages != 0) {
          this.table.pageNum = pages;
        }
      });
    },
    /**
     * @description: 初始化表格函数
     * @param {Array} selection选中的数据集合
     * @return:
     */
    onSelectionChange(selection) {
      this.table.selection = selection.map(v => v.id);
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
  }
};
</script>

<style lang="less">
.user-dialog{
  .ivu-modal{
    width: 750px !important;
  }
}
.user-manage {
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
  .ivu-card-extra {
    width: 98%;
  }
}
</style>