<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <img src="./../../assets/images/login-lg.png" style="position: absolute;left: 30px;top: -85px;" alt="">
      <login-form @on-success-valid="handleSubmit" :loginLoading="loading"></login-form>
    </div>
    <div class="login-bottom">
      技术支持：安徽智恒信科技有限公司
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      loading: false
    };
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(["handleLogin"]),
    handleSubmit({ userName, password }) {
      this.loading = true;
      this.handleLogin({ loginName:userName, password }).then(res => {
        this.loading = false;
        this.$router.push({
          name: this.$config.homeName
        });
      });
    }
  }
};
</script>

<style>
</style>
