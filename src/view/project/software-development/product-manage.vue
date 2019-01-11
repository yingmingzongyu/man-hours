<!--
 * @Author: yincheng
 * @Date: 2019-01-10 13:02:31
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-11 18:01:53
 -->
<template>
  <div>
    <ManageContent @query="getData" :tableData="tableData" :tableLoading="tableLoading" @submitForm="submitForm"/>
  </div>
</template>
<script>
import ManageContent from "../components/manage-content";
import { getProject, addProject } from "@/api/project";
export default {
  components: {
    ManageContent
  },
  data() {
    return {
      tableLoading:false,
      tableData: {
        list: [],
        pageNum: 1,
        pageSize: 10,
        pages: 0,
        total: 0
      },
      params: {}
    };
  },
  methods: {
    getData(params={}) {
      //把params储存
      this.params = params
      this.tableLoading = true
      getProject(params).then(res => {
        if (res.data.status === 200) {
          this.tableData = res.data.data;
        }
        this.tableLoading = false
      })
      .catch(error=>{
        this.tableLoading = false
      })
    },
    submitForm(data, close){
      addProject(data)
      .then(res=>{
        if (res.data.status === 200) {
          this.$Message.success(res.data.message)
          this.getData(this.params)
          close()
        }else{
          this.$Message.success(res.data.message)
        }
      })
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style scoped>
</style>
