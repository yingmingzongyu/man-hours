<!--
 * @Author: yincheng
 * @Date: 2019-01-10 13:02:31
 * @LastEditors: yincheng
 * @LastEditTime: 2019-01-15 10:50:55
 -->
<template>
  <div>
    <ManageContent
      :tableData="tableData"
      :tableLoading="tableLoading"
      @query="getData"
      @submitProject="submitProject"
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
      this.params = params;
      this.tableLoading = true;
      getProject(params)
        .then(res => {
          if (res.data.status === 200) {
            this.tableData = res.data.data;
          }
          this.tableLoading = false;
        })
        .catch(error => {
          this.tableLoading = false;
        });
    },
    submitProject(data, callback) {
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
