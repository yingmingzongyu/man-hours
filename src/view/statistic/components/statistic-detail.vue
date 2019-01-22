<!--
 * @Description: In User Settings Edit
 * @Author: Zero
 * @Date: 2019-01-22 10:12:21
 * @LastEditTime: 2019-01-22 16:44:45
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="statistic-detail">
    <Card dis-hover>
      <p slot="title"></p>
      <echarsLine></echarsLine>
    </Card>
    <br>
    <Card dis-hover >
      <p slot="title"></p>
      <stageTable></stageTable>
    </Card>
  </div>
</template>

<script>
import echarsLine from './echars-line.vue'
import stageTable from './stage-table.vue'

export default {
  name: "statistic-detail",
  components:{
    echarsLine, stageTable
  },
  data() {
    return {

    }
  },
  methods:{
    pageChange(){

    },
    
  }
};
</script>

