<!--个人信息-->
<template>
	<div class="personal-info">
		<Card shadow>
        	<img class="user-photo" :src="defaultPhoto" alt="">
        	
        	<div class="btn">
        		<Upload action="//jsonplaceholder.typicode.com/posts/" :show-upload-list="false">
	        		<Button type="primary">上传头像</Button>
	    		</Upload>
	        	<Button type="primary">恢复默认头像</Button>
        	</div>
        	
        	<Form ref="form" :model="form" :label-width="90" :rules="ruleValidate">
				<FormItem prop="userName" label="姓名：">
					<Input type="text" v-model="form.userName" placeholder="请输入姓名" style="width: 250px" />
				</FormItem>
				<FormItem label="登录ID：">
					<Input type="text" v-model="form.loginName" style="width: 250px" disabled />
				</FormItem>
				<FormItem label="性别：">
					<RadioGroup v-model="form.sex">
				        <Radio label="男"></Radio>
				        <Radio label="女"></Radio>
    				</RadioGroup>
				</FormItem>
				<FormItem label="手机：">
					<Input type="text" v-model="form.mobile" placeholder="请输入手机号" style="width: 250px" />
				</FormItem>
				<FormItem label="微信：">
					<Input type="text" v-model="form.roleName" placeholder="请输入微信" style="width: 250px" />
				</FormItem>
				<FormItem label="联系电话：">
					<Input type="text" v-model="form.phone" placeholder="请输入联系电话" style="width: 250px" />
				</FormItem>
				<FormItem label="邮箱：">
					<Input type="text" v-model="form.email" placeholder="请输入邮箱" style="width: 250px" />
				</FormItem>
				<FormItem label="钉钉：">
					<Input type="text" v-model="form.roleName" placeholder="请输入钉钉" style="width: 250px" />
				</FormItem>
				<FormItem prop="description" label="描述：">
					<Input type="textarea" v-model="form.description" placeholder="请输入描述" style="width: 250px" />
				</FormItem>
			</Form>
			
			<div class="save-btn">
				<Button type="primary">保存</Button>
			</div>
        </Card>
	</div>
</template>

<script>
	import defaultPhoto from '@/assets/images/default-photo.png'
	export default {
		data() {
			return {
				defaultPhoto,
				form: {
					userName: "",
					loginName: "",
					sex: "",
					mobile: "",
					phone: "",
					email: "",
					description: ""
				},
				ruleValidate: {
					
				}
			}
		},
		mounted() {
    		
  		},
		methods: { 
			
		},
	}
</script>

<style lang="less">
	.personal-info {
		.user-photo {
			display: block; margin: 0 auto; width: 160px; height: 160px; border-radius: 50%;
		}
		.btn {
			text-align: center; margin: 15px 0;
			.ivu-upload {
				display: inline-block; margin-right: 10px;
			}
		}
		.ivu-form {
			width: 340px; margin: 0 auto;
			textarea.ivu-input {
				height: 120px; resize: none;
			}
		}
		.save-btn {
			text-align: center;
		}
	}
</style>