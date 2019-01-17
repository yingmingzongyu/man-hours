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
          <Button type="primary" style="float: right;" @click="addHandler()">新增</Button>
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
        @on-page-size-change="pageSizeChange"
      />
    </Card>

    <!--弹窗-->
    <Modal
      v-model="addEditDialog.show" :title="addEditDialog.type=='add'?'新增用户':'编辑用户'" :loading="true">
      <div slot="footer">
        <Button @click="saveSubmit" type="info" :loading="addEditDialog.submitLoading">保存</Button>
      </div>
      <Tabs :value="addEditDialog.tabs">
        <TabPane label="基本信息" name="name1">
          <Form ref="addEditDialogForm" :model="addEditDialog" inline :label-width="130" :rules="addEditDialog.ruleValidate"
          >
            <FormItem prop="roleName" label="角色名称：">
              <Input
                type="text"
                v-model="addEditDialog.form.roleName"
                placeholder="请输入角色名称"
                style="width: 250px"
              />
            </FormItem>
            <FormItem prop="description" label="描述：">
              <Input
                type="textarea"
                v-model="addEditDialog.form.description"
                placeholder="请输入描述"
                style="width: 250px"
              />
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="角色" name="name2" :disabled="addEditDialog.type == 'add'">
          <Tree :data="addEditDialog.treeData" show-checkbox></Tree>
        </TabPane>
      </Tabs>
    </Modal>
  </div>
</template>

<script>
import { 
  getUserTable, addUserFun
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
                        this.openDialog("edit", params);
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
            
          ], // 登录名
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
        }
        
        // 角色
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
    addHandler() {
      this.addEditDialog.show = true;
      this.addEditDialog.type = 'add';
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
    },
    // 删除
    deleteData(data) {
      console.log(data);
    },
    // 新增、编辑
    openDialog(type) {
      this.addEditRole.show = true;
      this.addEditRole.type = type;
      console.log(this.addEditRole.tabs);
      //				this.$refs['addEditRole'].resetFields();
    },
    // 切换tab
    changeView(item) {
      this.editRoleDialog.basicInfo = true ? item == "basicInfo" : false;
      this.editRoleDialog.permissionsSet = true
        ? item == "permissionsSet"
        : false;
      this.editRoleDialog.personManage = true ? item == "personManage" : false;
      this.editRoleDialog.currentView = item;
    },
    saveSubmit() {
      this.$refs["addEditRole"].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    }
  },
  mounted() {
    this.initTablbe();
  }
};
</script>

<style lang="less">
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