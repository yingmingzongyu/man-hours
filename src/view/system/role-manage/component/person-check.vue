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
			<Table height="200" ref="multipleTable" :columns="table.columns" :data="table.data" @on-selection-change="onSelectionChange"></Table>
			<br>
			<Page show-total :page-size-opts="[5,10]" :total="table.total" :current.sync="table.pageNum" show-sizer show-elevator @on-change="pageChange" @on-page-size-change="pageSizeChange" />
		</Card>
	</Modal>
</template>

<script>
	import { querySystemUser } from "@/api/user.js";
	export default {
		props:[ 'defaultSelect' ],
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
            	},
            	selectedAll: [],
            }
      	},
      	mounted() {
            this.init();
    	},
    	methods: {
    		init() {
    			this.selectedAll[0] = this.defaultSelect;
    			this.query('init');
    		},
    		// 打开弹窗
    		open() {
    			this.show = true;
    		},
    		// 查询
    		query(v) {
    			v !== 'init' && this.mergeCheckedData();
    			
    			let data = {
					...this.form,
					pageNum: this.table.pageNum,
					pageSize: this.table.pageSize
				};
				querySystemUser(data).then(res => {
        			if(res.data.status === 200) {
        				this.table.data = res.data.data.list;
						this.table.total = res.data.data.total;
						this.selectedAll[1] = [];
						this.selectedAll[2] = [];
						this.selectedAll[0].forEach( item1 => {
							var flag = true;
							this.table.data.forEach( item2 => {
								if(item1.id == item2.id) {
									flag = false;
									item2['_checked'] = true;
									this.selectedAll[1].push(item2);
//									this.$nextTick( ()=>{
//										this.$refs.multipleTable.toggleRowSelection(item2);
//									});
								}
							});
							flag && this.selectedAll[2].push(item1);
        				});
        			} else {
        				this.table.data = [];
          				this.table.total = 0;
        			}
      			})
    		},
    		// 合并数据
        	mergeCheckedData(){
				this.selectedAll[0] = this.selectedAll[1].concat(this.selectedAll[2]);
				return this.selectedAll[0];
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
    		onSelectionChange(v) {
    			this.selectedAll[1] = v;
    		},
    		// 保存
    		submit() {
    			this.$emit('selectPersonHandler',this.mergeCheckedData());
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