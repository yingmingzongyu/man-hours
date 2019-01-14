<!--
 * @Author: yincheng
 * @Date: 2019-01-11 14:26:18
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-14 16:40:37
 -->
<template>
  <Form :model="form" ref="form" :label-width="140" :rules="rules">
    <FormItem prop="projectAttribution" label="项目归属：">
      <Select v-model="form.projectAttribution" :style="`width:${formWidth}px`">
        <Option value="ZHX" key="ZHX">智恒信</Option>
        <Option value="GX" key="GX">智信共创</Option>
        <Option value="PT" key="PT">平台公司</Option>
      </Select>
    </FormItem>
    <FormItem prop="projectName" label="项目名称：">
      <Input v-model="form.projectName" placeholder="请填写项目名称" :style="`width:${formWidth}px`"/>
    </FormItem>
    <FormItem prop="summarize" label="概述：">
      <Input v-model="form.summarize" type="textarea" :rows="4" :style="`width:${formWidth}px`"/>
    </FormItem>
    <FormItem prop="timeEvaluation" label="项目预估总耗时：">
      <InputNumber :min="0" v-model="form.timeEvaluation" :style="`width:${formWidth}px`"/>
    </FormItem>
    <FormItem prop="startTime" label="开始时间：">
      <DatePicker type="date" v-model="form.startTime" :style="`width:${formWidth}px`"/>
    </FormItem>
    <FormItem prop="endTime" label="结束时间：">
      <DatePicker type="date" v-model="form.endTime" :style="`width:${formWidth}px`"/>
    </FormItem>
    <FormItem prop="participants" label="项目参与人员：">
      <Select
        v-model="form.participants"
        multiple
        filterable
        remote
        :remote-method="searchUser"
        :loading="searchUserLoading"
        :style="`width:${formWidth}px`"
      >
        <Option v-for="(option, index) in userList" :value="option.id" :key="index">
          <span>{{option.userName}}(工号{{option.userCode}})</span>
        </Option>
      </Select>
    </FormItem>
    <Modal v-model="userModal" title="选择人员" :width="640">
      <div slot="footer">
        <Button type="info" @click="setUser">提交</Button>
      </div>
      <SelectUser ref="select-user"/>
    </Modal>
  </Form>
</template>
<script>
//搜索用户节流
import throttle from "lodash/throttle";
import SelectUser from "../select-user";
import { querySystemUser } from "@/api/user";
export default {
  components: {
    SelectUser
  },
  data() {
    return {
      formWidth: 308,
      form: {
        projectAttribution: null,
        summarize: null,
        timeEvaluation: null,
        startTime: null,
        endTime: null,
        participants: []
      },
      rules: {
        projectAttribution: [
          {
            required: true,
            message: "项目归属不能为空",
            trigger: "change"
          }
        ],
        projectName: [
          {
            required: true,
            message: "项目名称不能为空",
            trigger: "blur"
          }
        ],
        participants: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              value.length > 0
                ? callback()
                : callback(new Error("项目参与人员不能为空"));
            }
          }
        ]
      },
      userList: [],
      searchUserLoading: false,
      userModal: false
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
