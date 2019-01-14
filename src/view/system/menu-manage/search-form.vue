<!--
 * @Description: In User Settings Edit
 * @Author: Zero
 * @Date: 2019-01-14 16:47:39
 * @LastEditTime: 2019-01-14 17:12:44
 * @LastEditors: Please set LastEditors
 -->

<template>
  <Card dis-hover>
    <p slot="title">
      <Icon type="ios-search"/>查询条件
    </p>
    <Form ref="form" :model="params" inline :label-width="80">
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
</template>

<script>
export default {
  data() {
    return {
      params:{
        
      }
    }
  }
};
</script>
