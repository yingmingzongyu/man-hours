/*
 * @Author: yincheng
 * @Date: 2019-01-23 15:33:41
 * @Last Modified by: yincheng
 * @Last Modified time: 2019-01-24 10:50:17
 */
<template>
  <PersonStatistic :searchUser="true" />
</template>

<script>
import PersonStatistic from '_c/person-statistic';
export default {
  components: {
    PersonStatistic
  },
};
</script>
