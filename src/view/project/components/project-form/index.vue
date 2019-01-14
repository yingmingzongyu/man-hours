<!--
 * @Author: yincheng
 * @Date: 2019-01-11 14:26:18
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-14 09:21:29
 -->
<template>
  <Form :model="form" ref="form" :label-width="140" :rules="rules">
    <FormItem prop="projectAttribution" label="项目归属：">
      <Select v-model="form.projectAttribution">
        <Option value="ZHX" key="ZHX">智恒信</Option>
        <Option value="GX" key="GX">智信共创</Option>
        <Option value="PT" key="PT">平台公司</Option>
      </Select>
    </FormItem>
    <FormItem prop="projectName" label="项目名称：">
      <Input v-model="form.projectName" placeholder="请填写项目名称"/>
    </FormItem>
    <FormItem prop="summarize" label="概述：">
      <Input v-model="form.summarize" type="textarea" :rows="4"/>
    </FormItem>
    <FormItem prop="timeEvaluation" label="项目预估总耗时：">
      <InputNumber :min="0" v-model="form.timeEvaluation"/>
    </FormItem>
    <FormItem prop="startTime" label="开始时间：">
      <DatePicker type="date" v-model="form.startTime" :format="dateFormat"/>
    </FormItem>
    <FormItem prop="endTime" label="结束时间：">
      <DatePicker type="date" v-model="form.endTime" :format="dateFormat"/>
    </FormItem>
    <FormItem prop="participants" label="项目参与人员：">
      <Input v-model="form.participants" placeholder="请填写项目参与人员"/>
    </FormItem>
  </Form>
</template>
<script>
export default {
  data() {
    return {
      form: {
        projectAttribution: null,
        summarize: null,
        timeEvaluation: null,
        startTime: null,
        endTime: null,
        participants: null
      },
      rules: {
        projectAttribution:[
          {
            required: true,
            message: '项目归属不能为空',
            trigger: 'change'
          }
        ],
        projectName:[
          {
            required: true,
            message: '项目名称不能为空',
            trigger: 'blur'
          }
        ],
        participants: [
          {
            required: true,
            message: '项目参与人员不能为空',
            trigger: 'blur'
          }
        ]
      },
      dateFormat: "yyyy-MM-dd"
    };
  }
};
</script>
<style scoped>
</style>
