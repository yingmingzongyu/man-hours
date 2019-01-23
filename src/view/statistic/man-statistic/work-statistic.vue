/*
 * @Author: yincheng
 * @Date: 2019-01-23 15:33:41
 * @Last Modified by: yincheng
 * @Last Modified time: 2019-01-23 15:39:20
 */
<template>
  <PersonStatistic :searchUser="true" />
</template>

<script>
import PersonStatistic from '_c/person-statistic';
import { ChartPie, ChartBar } from "_c/charts";
export default {
  components: {
    PersonStatistic
  },
};
</script>
