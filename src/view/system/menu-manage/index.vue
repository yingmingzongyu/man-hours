<!--
 * @Description: In User Settings Edit
 * @Author: Zero
 * @Date: 2019-01-14 14:35:30
 * @LastEditTime: 2019-01-14 17:31:24
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <searchForm ref="searchForm" />
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
      <Table :columns="columns" :data="tableData.list" ></Table>
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
  </div>
</template>
<script>
import searchForm from "./search-form.vue"
import modalComponsents from "./modalComponsents.vue"
export default {
  components: {
    searchForm,
    modalComponsents
  },
  data() {
    return {
      table: {
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
            key: "projectAttribution"
          },
          {
            title: "创建人",
            key: "createUser"
          },
          {
            title: "标签",
            key: "labelName"
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
              return h("div", [
                h("Button", {
                  props: {
                    type: "text",
                    size: "small",
                    icon: "ios-search"
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                }),
                h("Button", {
                  props: {
                    type: "text",
                    size: "small",
                    icon: "ios-search"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                }),
                h("Button", {
                  props: {
                    type: "text",
                    size: "small",
                    icon: "ios-search"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                })
              ]);
            }
          }
        ],
        total:0,
        pageNum:0
      },
      
    };
  },
  methods: {
    //重置
    reset() {
      this.$refs["searchForm"]["form"].resetFields();
    },
    //查询
    query() {
      let data = {
        ...this.form,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      console.log(data);
    },
    //显示add
    showAdd() {
      this.modal = true;
    },
    //add
    submit() {
      this.submitLoading = true;
      this.$refs["form"].$refs["form"].validate(valid => {
        if (valid) {
          this.$emit("submitProject", this.$refs["form"].form, () => {
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
    }
  },
  watch: {
    modal() {
      //重置表单状态
      this.$refs["form"].$refs["form"].resetFields();
    }
  }
};
</script>
<style scoped>
button {
  margin-top: -5px;
  margin-left: 4px;
}
</style>
