<!--选择多人弹窗-->
<template>
	<Modal v-model="show" title="选择多人" :loading="true" width="640px">
  		<div slot="footer">
    		<Button @click="submit" type="info">保存</Button>
  		</div>
  		<Card dis-hover>
			<p slot="title">
				<Icon type="ios-search" />查询条件
			</p>
			<Form ref="form" :model="form" inline :label-width="90" style="margin: 10px 0 -15px 0;">
        		<FormItem prop="loginName" label="登录ID：">
					<Input type="text" v-model="form.loginName" placeholder="请输入登录ID" />
				</FormItem>
				<FormItem prop="userName" label="用户名：">
					<Input type="text" v-model="form.userName" placeholder="请输入用户名" />
				</FormItem>
      		</Form>
		</Card>
		<br>
		<Card dis-hover>
			<p slot="title"></p>
			<div slot="extra">
				<div class="btn-group">
					<Button type="primary" @click="query">查询</Button>
				</div>
			</div>
			<Table height="200" :columns="table.columns" :data="table.data" @on-selection-change="onSelectionChange"></Table>
			<br>
			<Page :total="table.total" :current.sync="table.pageNum" show-sizer show-elevator @on-change="pageChange" @on-page-size-change="pageSizeChange" />
		</Card>
	</Modal>
</template>

<script>
	import { querySystemUser } from "@/api/user.js";
	export default {
//		props:{
//	        show: {
//	            type: Boolean
//	        }
//	    },
		data() {
            return {
            	show: false,
            	form: {
            		userName: "",
            		loginName: "",
            	},
            	table: {
            		columns: [
            			{ type: 'selection', width: 60, align: 'center' },
						{ title: "工号", key: "userCode" },
						{ title: "登录ID", key: "loginName" },
						{ title: "用户名", key: "userName" },
            		],
            		data: [],
            		total: 0,
            		pageSize: 10,
            		pageNum: 1,
            		selection: []
            	}
            }
      	},
      	mounted() {
            this.query();
    	},
    	methods: {
    		open() {
    			this.show = true;
    		},
    		// 查询
    		query() {
    			let data = {
					...this.form,
					pageNum: this.table.pageNum,
					pageSize: this.table.pageSize
				};
				querySystemUser(data).then(res => {
        			if(res.data.status === 200) {
          				this.table.data = res.data.data.list;
          				this.table.total = res.data.data.total;
        			} else {
        				this.table.data = [];
          				this.table.total = 0;
        			}
      			})
    		},
    		// 翻页
			pageChange(v) {
				this.table.pageNum = v;
				this.query();
			},
			// 页面大小切换
			pageSizeChange(v) {
				this.table.pageSize = v;
				this.query();
			},
    		// 表格勾选数据
    		onSelectionChange(selection) {
    			this.table.selection = selection.map(v=> v);
    		},
    		// 保存
    		submit() {
    			this.$emit('selectPersonHandler',this.table.selection);
    			this.show = false;
    		}
    	}
	}
</script>

<style scoped>
	button {
		margin-top: -5px; margin-left: 4px;
	}
</style>