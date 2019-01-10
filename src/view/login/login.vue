<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :loginLoading="loading"></login-form>
        </div>
      </Card>
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
      this.handleLogin({ userName, password }).then(res => {
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
