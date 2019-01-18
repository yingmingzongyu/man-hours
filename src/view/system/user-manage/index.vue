<!--用户管理-->
<template>
  <div class="user-manage">
    <Card dis-hover>
      <p slot="title">
        <Icon type="ios-search"/>查询条件
      </p>
      <Form ref="form" :model="form.params" inline :label-width="80">
        <FormItem prop="userCode" label="工号：">
          <Input type="text" v-model="form.params.userCode" placeholder="请输入工号" style="width: 180px"/>
        </FormItem>
        <FormItem prop="userName" label="姓名：">
          <Input type="text" v-model="form.params.userName" placeholder="请输入姓名" style="width: 180px"/>
        </FormItem>
        <FormItem prop="labelName" label="部门：">
          <Input type="text" v-model="form.params.roleName" placeholder="请选择部门" style="width: 180px" icon="md-apps" />
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
          <Button type="primary" style="float: left;">导入</Button>
          <Button type="primary">下载导入模板</Button>
          <Button type="primary">导出</Button>
          <Button type="primary">删除</Button>
          <Button type="primary" style="float: right;" @click="addEditOpen('add')">新增</Button>
          <Button type="primary" style="float: right;" @click="queryHandler()">查询</Button>
          <Button type="primary" style="float: right;" @click="resetFields()">重置</Button>
        </div>
      </div>
      <Table :columns="table.columns" :data="table.data" :loading="tableLoading" @on-selection-change="onSelectionChange"></Table>
      <br>
      <Page
        :total="table.total"
        :current.sync="table.pageNum"
        show-sizer
        show-elevator
        @on-change="pageChange"
      />
    </Card>

    <!--弹窗-->
    <Modal
      v-model="addEditDialog.show" :title="addEditDialog.type=='add'?'新增用户':'编辑用户'" class-name="user-dialog" :loading="true" @on-visible-change="onVisibleChange">
      <div slot="footer">
        <Button @click="addEditSave()" type="info" :loading="addEditDialog.submitLoading">保存</Button>
      </div>
      <Tabs :value="addEditDialog.tabs">
        <TabPane label="基本信息" name="name1">
          <Form ref="addEditDialogForm" :model="addEditDialog.params" inline :label-width="130" :rules="addEditDialog.rules"
          >
            <FormItem prop="userName" label="角色名称：">
              <Input type="text" v-model="addEditDialog.params.userName" placeholder="请输入用户姓名" style="width: 200px" />
            </FormItem>
            <FormItem prop="loginName" label="登录ID：">
              <Input type="text" v-model="addEditDialog.params.loginName" placeholder="请输入登录ID" style="width: 200px" />
            </FormItem>
            <FormItem prop="userCode" label="工号：">
              <Input type="text" v-model="addEditDialog.params.userCode" placeholder="请输入用户工号" style="width: 200px" />
            </FormItem>
            <FormItem prop="position" label="职位：">
              <Select v-model="addEditDialog.params.position" style="width: 200px">
                <Option value="普通职员" key="1"></Option>
                <Option value="中层" key="2"></Option>
                <Option value="部门经理" key="3"></Option>
                <Option value="管理层" key="4"></Option>
              </Select>
            </FormItem>
            <FormItem prop="organizationId" label="部门：">
              <Input type="text" v-model="addEditDialog.params.organizationId" placeholder="请输入用户工号" style="width: 200px" icon="md-apps" />
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
              <Input type="text" v-model="addEditDialog.params.mobile" placeholder="请输入用户工号" style="width: 200px" />
            </FormItem>
            <FormItem prop="accountStatus" label="账号状态：">
              <RadioGroup v-model="addEditDialog.params.accountStatus">
                <Radio :label="0">
                    <span>开启</span>
                </Radio>
                <Radio :label="1">
                    <span>关闭</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem prop="phone" label="联系电话：">
              <Input type="text" v-model="addEditDialog.params.phone" placeholder="请输入用户工号" style="width: 200px" />
            </FormItem>
            <FormItem prop="availableStatus" label="在职状态：">
              <RadioGroup v-model="addEditDialog.params.availableStatus">
                <Radio :label="0">
                    <span>在职</span>
                </Radio>
                <Radio :label="1">
                    <span>离职</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem prop="email" label="电子邮件：">
              <Input type="text" v-model="addEditDialog.params.email" placeholder="请输入用户工号" style="width: 200px"  />
            </FormItem>
            <FormItem prop="description" label="用户描述：">
              <Input type="textarea" v-model="addEditDialog.params.description" placeholder="请输入用户描述" style="width: 400px" />
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="角色" name="name2" >
          <Table :columns="addEditDialog.columns" :data="addEditDialog.data" @on-selection-change="onSelectionRole" size="small" height="350" ></Table>
          <Page
            size="small"
            :total="addEditDialog.total"
            :current.sync="addEditDialog.pageNum"
            show-elevator
            @on-change="pageChangeRole"
            :styles="{float:'right',margin:'10px'}"
          />
        </TabPane>
      </Tabs>
    </Modal>
  </div>
</template>

<script>
import { 
  getUserTable, addUserFun, editUserFun, getRole
} from "@/api/system";
export default {
  props: {
    tableLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        params: {
          userCode: "", // 工号
          userName: "", // 姓名
          organizationId: "", //部门
          accountStatus: "", // 账号状态
          availableStatus: "" // 在职状态
        },
        query: {
          userCode: "", // 工号
          userName: "", // 姓名
          organizationId: "", //部门
          accountStatus: "", // 账号状态
          availableStatus: "" // 在职状态
        }
      },
      table: {
        columns: [
          { title: "工号", key: "userCode" },
          { title: "姓名", key: "userName" },
          { title: "登录ID", key: "loginName" },
          { title: "部门", key: "organizationId" },
          { title: "性别", key: "sex" },
          { title: "在职状态", key: "availableStatus" },
          { title: "账号状态", key: "accountStatus" },
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
                        this.addEditOpen("edit", params.row);
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
                        this.deleteData(params);
                        //                  						vm.$emit('on-delete', params)
                        //                  						vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
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
        tabs: "",
        submitLoading: false,
        // 基本信息
        params: {
          loginName: "", // 登录名
          userName: "", // 姓名
          userCode: "", // 工号
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
          organizationId:[
            { required: true, message: '请选择所属部门', trigger: 'blur' }
          ], // 部门
          mobile: [
            { required: true, message: '请输入手机号码', trigger: 'blur' }
          ], // 手机
          email:[
            { required: true, message: '请输入邮件地址', trigger: 'blur' }
          ], // 电子邮件
          position: [
            { required: true, message: '请选择职位', trigger: 'blur' }
          ], // 职位
        },
        // 角色
        columns:[
          {type: 'selection',width: 60,align: 'center'},
          { title: "角色名称", key: "roleName" },
					{ title: "描述", key: "description" },
        ],
        data:[],
        total:0,
        pageNum:1
      }
    };
  },
  methods: {
    /***********************表格操作***************************/
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
      this.$refs['form'].resetFields();
    },

    /**
     * @description: 新增函数
     * @param {type} --
     * @return:
     */
    addEditOpen(v,row) {
      this.addEditDialog.show = true;
      this.addEditDialog.type = v;
      getRole({pageNum: 1,pageSize: 10}).then(res=>{
        if(res.data.status === 200) {
          this.addEditDialog.data = res.data.data;
        }
      })
      if(v=='edit'){
        let { id, loginName, userCode, userName, position, organizationId, organizationName  } = row;
      }
    },
    
    /***********************modal方法***************************/
    addEditSave() {
      let type = this.addEditDialog.type, params = {
        ...this.addEditDialog.params
      }
      type == 'add'?
      addUserFun(params).then(res=>{
        let {status, message} = res.data;
        if(status == 200){
          this.$Message.success(message)
          this.initTablbe()
        }
      }):
      editUserFun(params).then(res=>{
        let {status, message} = res.data;
        if(status == 200){
          this.$Message.success(message)
          this.initTablbe()
        }
      });
    },
    onSelectionRole(){

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
    },
    // 删除
    deleteData(data) {
      console.log(data);
    },
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