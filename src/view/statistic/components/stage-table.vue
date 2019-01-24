<!--
 * @Description: In User Settings Edit
 * @Author: Zero
 * @Date: 2019-01-22 16:41:37
 * @LastEditTime: 2019-01-22 18:11:30
 * @LastEditors: Please set LastEditors
 -->

<template>
  <div class="stage-table clearfix">
    <Select v-model="stage.value" style="width:200px">
      <Option v-for="item in stage.list" :value="item.id" :key="item.id">{{ item.label }}</Option>
    </Select>
    <Table :columns="table.columns" :data="table.data" ></Table>
    <br>
    <Page
      :total="table.total"
      :current.sync="table.pageNum"
      show-sizer
      show-elevator
      show-total
      @on-change="pageChange"
    />
  </div>
</template>

<script>
export default {
  name: "stage-table",
  data() {
    return {
      stage:{
        value:'',
        list:[
          {id:0,label:"需求阶段"},
          {id:1,label:"方案设计极端"},
          {id:2,label:"招标阶段"},
          {id:3,label:"投标阶段"},
          {id:4,label:"项目实施阶段"},
          {id:5,label:"运维阶段"}
        ]
      },
      table: {
        columns: [
          { title: "子阶段", key: "stageName" },
          { title: "阶段打卡人员", key: "punchUsers" },
          { title: "打卡合计", key: "punchCount" },
          { title: "子阶段总耗时", key: "stageCount" }
        ],
        data: [
          {
            stageName: "阶段施工",
            punchUsers: "朱思渊，周洁，尹程程",
            punchCount: 20,
            stageCount: 50
          },
          {
            stageName: "阶段施工",
            punchUsers: "朱思渊，周洁，尹程程",
            punchCount: 20,
            stageCount: 50
          },
          {
            stageName: "阶段施工",
            punchUsers: "朱思渊，周洁，尹程程",
            punchCount: 20,
            stageCount: 50
          },
          {
            stageName: "阶段施工",
            punchUsers: "朱思渊，周洁，尹程程",
            punchCount: 20,
            stageCount: 50
          },
          {
            stageName: "阶段施工",
            punchUsers: "朱思渊，周洁，尹程程",
            punchCount: 20,
            stageCount: 50
          },
          {
            stageName: "阶段施工",
            punchUsers: "朱思渊，周洁，尹程程",
            punchCount: 20,
            stageCount: 50
          },
          {
            stageName: "阶段施工",
            punchUsers: "朱思渊，周洁，尹程程",
            punchCount: 20,
            stageCount: 50
          }
        ],
        total: 0,
        pageNum: 1
      }
    };
  },
  methods: {
    pageChange() {}
  }
};
</script>

<style lang="less">
.stage-table{
    padding: 50px 0;position: relative;
    >.ivu-select{
        position: absolute;right: 0;top: 0px;
    }
    >.ivu-page{
        position: absolute;right: 0;bottom: 10px;
    }
}
</style>


