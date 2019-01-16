<!--
 * @Author: yincheng
 * @Date: 2019-01-10 17:58:57
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-16 17:35:20
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
    <Modal v-model="modal" :title="(projectType ==='add' ? '新增':'编辑')+'项目'">
      <div slot="footer">
        <Button @click="submit" type="info" :loading="submitLoading">提交</Button>
      </div>
      <ProjectFrom ref="project-form" :type="projectType" :projectId="editProjectId"/>
    </Modal>
    <Modal v-model="phaseVisible" title="配置阶段可用性">
      <div slot="footer">
        <Button @click="submitPhase" type="info" :loading="submitPhaseLoading">提交</Button>
      </div>
      <Tree :data="treeData" show-checkbox></Tree>
      <Spin size="large" fix v-if="treeLoading"></Spin>
    </Modal>
  </div>
</template>
<script>
import dayjs from "dayjs";
import ProjectFrom from "../project-form";
import { addLabel, delLabel, getPhase, bindPhase } from "@/api/project";
export default {
  props: {
    tableLoading: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Object,
      required: true,
      default: () => ({})
    },
    phaseDisable: {
      type: Boolean,
      default: false
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
          key: "projectAttribution",
          render: (h, params) => {
            const data = params.row.projectAttribution;
            let projectAttribution = "";
            switch (data) {
              case "ZHX":
                projectAttribution = "智恒信";
                break;
              case "GX":
                projectAttribution = "智信共创";
                break;
              case "PT":
                projectAttribution = "平台公司";
                break;
              default:
                break;
            }
            return h("span", {}, projectAttribution);
          }
        },
        {
          title: "创建人",
          key: "createUser"
        },
        {
          title: "标签",
          key: "labelName",
          tooltip: true
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
            const DropdownItems = params.row.labelList.map(item =>
              h(
                "DropdownItem",
                {
                  props: {
                    name: item.labelId
                  },
                  style: {
                    textAlign: "left"
                  }
                },
                [
                  item.labelName,
                  h("Icon", {
                    props: {
                      type: "ios-trash-outline",
                      size: 20
                    },
                    style: {
                      float: "right"
                    },
                    on: {
                      click: () => {
                        this.delTag({
                          id: item.labelId,
                          projectId: params.row.id
                        });
                      }
                    }
                  })
                ]
              )
            );
            DropdownItems.push(
              h(
                "DropdownItem",
                {
                  props: {
                    divided: true,
                    name: "add"
                  }
                },
                [
                  h("Icon", {
                    props: {
                      type: "md-add"
                    }
                  }),
                  "新建标签并标记"
                ]
              )
            );
            return h("div", [
              h("Button", {
                props: {
                  type: "text",
                  size: "small",
                  icon: "ios-search"
                },
                on: {
                  click: () => {
                    this.projectType = "edit";
                    this.editProjectId = params.row.id;
                    this.modal = true;
                    // this.show(params.index);
                  }
                }
              }),
              h("Button", {
                props: {
                  type: "text",
                  size: "small",
                  icon: "ios-search",
                  disabled: this.phaseDisable
                },
                on: {
                  click: () => {
                    this.treeLoading = true;
                    this.editProjectId = params.row.id;
                    this.phaseVisible = true;
                    this.treeData = [];
                    const ids = params.row.phaseId
                      .split(",")
                      .map(item => Number(item));
                    this.treeData = this.mapPhaseData(this.phaseData, ids);
                    this.treeLoading = false;
                  }
                }
              }),
              h(
                "Dropdown",
                {
                  props: {
                    trigger: "click"
                  },
                  on: {
                    "on-click": name => {
                      switch (name) {
                        case "add":
                          this.shwoAddTag(params);
                          break;
                        default:
                          console.log("default");
                          break;
                      }
                    }
                  }
                },
                [
                  h("Button", {
                    props: {
                      type: "text",
                      size: "small",
                      icon: "ios-pricetag-outline"
                    }
                  }),
                  h(
                    "DropdownMenu",
                    {
                      slot: "list"
                    },
                    DropdownItems
                  )
                ]
              )
            ]);
          }
        }
      ],
      modal: false,
      projectType: "",
      submitLoading: false,
      pageNum: this.tableData.pageNum,
      pageSize: this.tableData.pageSize,
      tagVal: "",
      tagList: [],
      editProjectId: null,
      phaseVisible: false,
      phaseData: [],
      treeData: [],
      treeLoading: false,
      submitPhaseLoading: false
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
      data.startTime = this.formatTime(data.createTime[0]);
      data.endTime = this.formatTime(data.createTime[1]);
      delete data.createTime;
      this.$emit("query", data);
    },
    //显示add
    showAdd() {
      this.projectType = "add";
      this.editProjectId = null;
      this.modal = true;
    },
    //add
    submit() {
      this.submitLoading = true;
      this.$refs["project-form"].$refs["form"].validate(valid => {
        console.log(valid);
        if (valid) {
          let formData = { ...this.$refs["project-form"].form };
          formData.user = formData.user.toString();
          formData.startTime = this.formatTime(formData.startTime);
          formData.endTime = this.formatTime(formData.endTime);
          this.$emit("submitProject", formData, () => {
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
    },
    formatTime(date, type = "YYYY-MM-DD") {
      if (date instanceof Date) {
        return dayjs(date).format(type);
      } else {
        return null;
      }
    },
    delTag(data) {
      delLabel(data).then(res => {
        if (res.data.status === 200) {
          this.$Message.success(res.data.message);
          this.query();
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    addTag(projectId) {
      if (this.tagVal.length === 0) {
        this.$Message.error("标签内容不能为空");
        return;
      }
      console.log(projectId);
      addLabel({
        projectId,
        labelName: this.tagVal
      }).then(res => {
        if (res.data.status === 200) {
          this.$Message.success(res.data.message);
          this.query();
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    shwoAddTag(data) {
      this.tagVal = "";
      this.$Modal.confirm({
        title: "添加标签",
        onOk: () => {
          this.addTag(data.row.id);
        },
        render: h => {
          return h("Input", {
            props: {
              value: this.tagVal,
              autofocus: true,
              placeholder: "请输入标签名..."
            },
            style: {
              marginTop: "15px"
            },
            on: {
              input: val => {
                this.tagVal = val;
              }
            }
          });
        }
      });
    },
    mapPhaseData(data, ids) {
      return data.map(item => {
        let itemData = {
          expand: true,
          title: item.phaseName,
          id: item.id,
          checked: ids.indexOf(item.id) === -1 ? false : true
        };
        if (item.childList) {
          itemData.children = this.mapPhaseData(item.childList, ids);
        }
        return itemData;
      });
    },
    mapPhaseId(data) {
      return data.map(item => {
        let arr = [];
        if (item.checked) {
          arr.push(item.id);
        }
        if (item.children) {
          arr.push(this.mapPhaseId(item.children));
        }
        return arr;
      });
    },
    submitPhase() {
      this.submitPhaseLoading = true;
      const phaseId = this.mapPhaseId(this.treeData).toString();
      bindPhase({
        projectId: this.editProjectId,
        phaseId
      }).then(res => {
        if (res.data.status === 200) {
          this.phaseVisible = false;
          this.$Message.success("保存成功");
        } else {
          this.$Message.error(res.data.message);
        }
        this.submitPhaseLoading = false;
      });
    }
  },
  watch: {
    modal(newVal) {
      //重置表单状态
      if (!this.editProjectId) {
        this.$refs["project-form"].$refs["form"].resetFields();
      }
    }
  },
  created() {
    getPhase().then(res => {
      if (res.data.status === 200) {
        this.phaseData = res.data.data;
      } else {
        this.$Message.error(res.data.message);
      }
    });
  }
};
</script>
<style scoped>
button {
  margin-top: -5px;
  margin-left: 4px;
}
</style>
