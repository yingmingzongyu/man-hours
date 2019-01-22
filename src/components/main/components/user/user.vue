<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvator"/>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem> -->
        <DropdownItem name="personal">个人信息</DropdownItem>
        <DropdownItem name="pwd">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    
    <!--修改密码弹窗-->
    <Modal v-model="changePwd.show" title="修改密码" :loading="true" :mask-closable="false">
  		<div slot="footer">
    		<Button type="info" :loading="changePwd.submitLoading" @click="submit">保存</Button>
  		</div>
  		<Form ref="changePwd" :model="changePwd.form" inline :label-width="150" :rules="changePwd.ruleValidate">
				<FormItem prop="oldPwd" label="原密码：">
					<Input type="text" v-model="changePwd.form.oldPwd" placeholder="请输入原密码" style="width: 250px" />
				</FormItem>
				<FormItem prop="newPwd" label="新密码：">
					<Input type="text" v-model="changePwd.form.newPwd" placeholder="请输入新密码" style="width: 250px" />
				</FormItem>
				<FormItem prop="repeatPwd" label="重复新密码：">
					<Input type="text" v-model="changePwd.form.repeatPwd" placeholder="请重复输入新密码" style="width: 250px" />
				</FormItem>
			</Form>
	</Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data() {
  	return {
  		changePwd: {
  			show: false,
  			submitLoading: false,
  			form: {
  				oldPwd: '',
  				newPwd: '',
  				repeatPwd: '',
  			},
  			ruleValidate: {
  				oldPwd: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
        	],
        	newPwd: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
        	],
        	repeatPwd: [
            { required: true, message: '请重复输入新密码', trigger: 'blur' }
        	],
  			}
  		}
  	};
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    personalInfo () {
      this.$router.push({
        name: 'personalInfo'
      })
    },
    modifyPwd () {
      this.changePwd.show = true;
      this.$refs['changePwd'].resetFields();
    },
    submit() {
    	this.$refs['changePwd'].validate((valid) => {
        if(valid) {
        	
        } 
    	})
    },
    handleClick (name) {
      switch (name) {
      	case 'personal': this.personalInfo()
          break
        case 'pwd': this.modifyPwd()
          break
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    }
  }
}
</script>
