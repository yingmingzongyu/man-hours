<!--
 * @Author: yincheng
 * @Date: 2019-01-10 13:02:31
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-16 18:55:36
 -->
<template>
  <div>
    <ManageContent
      :tableData="tableData"
      :tableLoading="tableLoading"
      @query="getData"
      @submitProject="submitProject"
      :phaseDisable="true"
    />
  </div>
</template>
<script>
import ManageContent from "../components/manage-content";
import { getProject, addProject, addLabel, delLabel } from "@/api/project";
import project from "@/api/project";
export default {
  components: {
    ManageContent
  },
  data() {
    return {
      tableLoading: false,
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
    getData(params = {}) {
      //把params储存
      params.projectType = 3;
      params.businessType = 8;
      this.params = params;
      this.tableLoading = true;
      getProject(params).then(res => {
        if (res.data.status === 200) {
          let data = res.data.data;
          data.list = data.list.map(item => {
            item.labelList = item.labelList || []
            item.labelName = item.labelList
              .map(item => item.labelName)
              .join("、");
            return item
          });
          this.tableData = data;
        }
        this.tableLoading = false;
      });
    },
    submitProject(data, callback) {
      data.projectType = 3;
      data.businessType = 8;
      addProject(data).then(res => {
        if (res.data.status === 200) {
          this.$Message.success(res.data.message);
          this.getData(this.params);
          if (typeof callback === "function") {
            callback();
          }
        } else {
          this.$Message.success(res.data.message);
        }
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style scoped>
</style>
