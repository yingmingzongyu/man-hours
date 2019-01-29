<!--
 * @Author: yincheng
 * @Date: 2019-01-11 14:26:18
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-21 10:58:27
 -->
<template>
  <Form :model="form" ref="form" :label-width="140" :rules="rules">
    <FormItem prop="projectNumber" key="projectNumber" label="项目编号：" v-if="type === 'edit'">
      <Input v-model="form.projectNumber" readonly :style="`width:${formWidth}px`"/>
    </FormItem>
    <FormItem prop="projectAttribution" label="项目归属：" key="projectAttribution">
      <Select v-model="form.projectAttribution" :style="`width:${formWidth}px`">
        <Option value="ZHX" key="ZHX">智恒信</Option>
        <Option value="GX" key="GX">智信共创</Option>
        <Option value="PT" key="PT">平台公司</Option>
      </Select>
    </FormItem>
    <FormItem prop="projectName" label="项目名称：" key="projectName">
      <Input
        v-model="form.projectName"
        placeholder="请填写项目名称"
        :maxlength="16"
        :style="`width:${formWidth}px`"
      />
    </FormItem>
    <FormItem prop="summarize" label="概述：" key="summarize">
      <Input
        v-model="form.summarize"
        type="textarea"
        :rows="4"
        :maxlength="200"
        :style="`width:${formWidth}px`"
      />
    </FormItem>
    <FormItem prop="timeEvaluation" label="项目预估总耗时：" key="timeEvaluation">
      <InputNumber
        :min="0"
        :max="999"
        :precision="0"
        v-model="form.timeEvaluation"
        :style="`width:${formWidth}px`"
      />
    </FormItem>
    <FormItem prop="startTime" label="开始时间：" key="startTime">
      <DatePicker type="date" v-model="form.startTime" :style="`width:${formWidth}px`"/>
    </FormItem>
    <FormItem prop="endTime" label="结束时间：" key="endTime">
      <DatePicker type="date" v-model="form.endTime" :style="`width:${formWidth}px`"/>
    </FormItem>
    <FormItem prop="user" label="项目参与人员：" key="user">
      <Select
        v-model="form.user"
        multiple
        filterable
        remote
        :remote-method="searchUser"
        :loading="searchUserLoading"
        :style="`width:${formWidth}px`"
        :label="selectLabel"
      >
        <Option
          v-for="(option, index) in userList"
          :value="option.id"
          :label="option.userName"
          :key="index"
        >
          <span>{{option.userName}}</span>
          <span style="float:right;color:#ccc;padding-right:14px">工号{{option.userCode}}</span>
        </Option>
      </Select>
    </FormItem>
    <Spin size="large" fix v-if="loading"></Spin>
  </Form>
</template>
<script>
//搜索用户节流
import throttle from "lodash/throttle";
import { querySystemUser } from "@/api/user";
import { projectDetail } from "@/api/project";
import dayjs from "dayjs";
export default {
  props: {
    type: {
      type: String,
      default: "add"
    },
    projectId: {}
  },
  data() {
    return {
      formWidth: 308,
      form: {
        projectNumber: null,
        projectName: null,
        projectAttribution: null,
        summarize: null,
        timeEvaluation: null,
        startTime: null,
        endTime: null,
        user: []
      },
      rules: {
        projectAttribution: [
          {
            required: true,
            message: "项目归属不能为空",
            trigger: "blur"
          }
        ],
        projectName: [
          {
            required: true,
            message: "项目名称不能为空",
            trigger: "blur"
          }
        ],
        user: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              value.length > 0
                ? callback()
                : callback(new Error("项目参与人员不能为空"));
            }
          }
        ],
        startTime: [
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              const { endTime } = this.form;
              if (endTime && value) {
                if (dayjs(endTime).unix() < dayjs(value).unix()) {
                  callback(new Error("开始时间不能大于结束时间"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        ],
        endTime: [
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              const { startTime } = this.form;
              if (startTime && value) {
                if (dayjs(startTime).unix() > dayjs(value).unix()) {
                  callback(new Error("结束时间不能小于开始时间"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }
        ]
      },
      userList: [],
      searchUserLoading: false,
      selectLabel: [],
      userModal: false,
      loading: false
    };
  },
  methods: {
    showUser() {
      this.userModal = true;
    },
    setUser() {
      this.userModal = false;
    },
    searchUser(query) {
      if (this.searchUserLoading) {
        return;
      }
      this.searchUserLoading = true;
      querySystemUser({
        userName: query,
        pageSize: 20
      })
        .then(res => {
          if (res.data.status === 200) {
            this.userList = res.data.data.list;
          }
          this.searchUserLoading = false;
        })
        .catch(error => {
          this.searchUserLoading = false;
        });
    },
    getData(id) {
      this.loading = true;
      projectDetail({
        id
      }).then(res => {
        if (res.data.status === 200) {
          const resData = res.data.data
          console.log(res)
          let formData = {
            projectNumber: resData.project.projectNumber,
            projectAttribution: resData.project.projectAttribution,
            projectName: resData.project.projectName,
            summarize: resData.project.summarize,
            timeEvaluation: resData.project.timeEvaluation,
            startTime: resData.project.startTime,
            endTime: resData.project.endTime,
            user: resData.user
          };
          this.selectLabel = formData.user.map(item => ({
            label: `${item.userName}(工号${item.userCode})`,
            value: item.id
          }));
          //过滤掉userList已经存在的用户
          const moreUserList = formData.user.filter(
            item => formData.user.map(d => d.id).indexOf(item.id) === -1
          );
          this.userList = moreUserList.concat(this.userList);
          formData.user = formData.user.map(item => item.id);
          this.form = formData;
        }
        this.loading = false;
      });
    }
  },
  watch: {
    projectId(newVal, oldVal) {
      this.$refs["form"].resetFields();
      if (!newVal) {
        this.form = {
          projectNumber: null,
          projectAttribution: null,
          summarize: null,
          timeEvaluation: null,
          startTime: null,
          endTime: null,
          user: []
        };
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        });
      }
    }
  },
  mounted() {
    this.searchUser = throttle(this.searchUser, 800, { trailing: true });
    this.searchUser();
  }
};
</script>
<style scoped>
</style>
