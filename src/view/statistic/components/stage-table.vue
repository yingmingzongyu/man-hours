<!--
 * @Description: In User Settings Edit
 * @Author: Zero
 * @Date: 2019-01-22 16:41:37
 * @LastEditTime: 2019-01-22 17:05:13
 * @LastEditors: Please set LastEditors
 -->

<template>
  <div class="stage-table clearfix">
    <DatePicker
      type="daterange"
      show-week-numbers
      placement="bottom-end"
      :options="options"
      placeholder="默认近7日"
    ></DatePicker>
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
      options: {
        shortcuts: [
          {
            text: "近7天",
            value() {
              const end = new Date(), start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "近30天",
            value() {
              const end = new Date(), start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "近90天",
            value() {
              const end = new Date(), start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
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
    >.ivu-date-picker{
        position: absolute;right: 0;top: 0px;
    }
    >.ivu-page{
        position: absolute;right: 0;bottom: 10px;
    }
}
</style>


