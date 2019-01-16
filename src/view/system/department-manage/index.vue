<!--部门管理-->
<template>
	<split-pane v-model="split.offset">
		<div slot="left" style="height:100%;background:#fff">
		</div>

		<div slot="right" class="department-manage">
			<Card dis-hover>
				<p slot="title">
					<Icon type="ios-search" />查询条件
				</p>
				<Row>
        			<i-col span="6">部门编号：001</i-col>
        			<i-col span="18">部门名称：研发一部</i-col>
    			</Row>
    			<br>
			    <Row>
			        <i-col span="24">描述：研发一部</i-col>
			    </Row>
			    <br>
			</Card>
			<br>
			<Card dis-hover>
				<p slot="title"></p>
				<div slot="extra">
					<div class="btn-group">
						<Button type="primary" @click="del()">删除</Button>
						<Button type="primary" @click="openDialog('add')">新增</Button>
						<Button type="primary">禁用</Button>
						<Button type="primary">启用</Button>
					</div>
				</div>
				<Table :columns="table.columns" :data="table.data"></Table>
				<br>
				<Page :total="table.total" :current.sync="table.pageNum" show-sizer show-elevator @on-change="pageChange" @on-page-size-change="pageSizeChange" />
			</Card>
			
			<!--弹窗-->
			<Modal v-model="addEditDialog.show" :title="addEditDialog.type=='add'?'新增部门':'编辑部门'" :loading="true">
	      		<div slot="footer">
	        		<Button @click="submit" type="info" :loading="addEditDialog.submitLoading">保存</Button>
	      		</div>
	      		<Form ref="addEditDialog" :model="addEditDialog.form" inline :label-width="130" :rules="addEditDialog.ruleValidate">
					<FormItem prop="organizationCode" label="编号：">
						<Input type="text" v-model="addEditDialog.form.organizationCode" placeholder="请输入编号" style="width: 250px" :disabled="addEditDialog.type=='edit'" />
					</FormItem>
					<FormItem prop="organizationName" label="名称：">
						<Input type="text" v-model="addEditDialog.form.organizationName" placeholder="请输入名称" style="width: 250px" />
					</FormItem>
					<FormItem prop="description" label="描述：">
						<Input type="textarea" v-model="addEditDialog.form.description" placeholder="请输入描述" style="width: 250px" />
					</FormItem>
				</Form>
	    	</Modal>
	    	
	    	<Modal v-model="delDialog.show" width="360">
		        <p slot="header" style="color:#f60;text-align:center">
		            <Icon type="information-circled"></Icon>
		            <span>删除确认</span>
		        </p>
		        <div style="text-align:center">
		            <p>是否确认删除？</p>
		        </div>
		        <div slot="footer">
		            <i-button type="error" size="large" long :loading="delDialog.modalLoading" @click="del">删除</i-button>
		        </div>
		    </Modal>
		</div>
	</split-pane>
</template>
<script>
	import SplitPane from "_c/split-pane";
	export default {
		components: {
			SplitPane
		},
		data() {
			return {
				split: {
					offset: 0.2,
					offsetVertical: '250px'
				},
				form: {
					
				},
				table: {
					columns: [
						{ type: 'selection', width: 60, align: 'center' },
						{ title: "部门编号", key: "organizationCode" },
						{ title: "部门名称", key: "organizationName" },
						{ title: "描述", key: "description" },
						{ title: "状态", key: "openFlag" },
						{
							title: "操作",
							key: "address",
							align: "center",
							render: (h, params) => {
								return h("div", [
									h("span", {
										style: {
	                                        color: '#2d8cf0', cursor: 'pointer'
	                                   	},
										on: {
											click: () => {
												this.openDialog('edit',params);
											}
										}
									},'编辑')
								]);
							}
						}
					],
					data: [
						{organizationCode:'001',organizationName:'研发一部',description:'研发一部',openFlag:'启用'},
						{organizationCode:'001',organizationName:'研发一部',description:'研发一部',openFlag:'启用'}
					],
					total: 0,
					pageNum: 1,
					pageSize: 10,
				},
				delDialog: {
					show: false,
					modalLoading: false
				},
				addEditDialog: {
					show: false,
					type: 'add',
					submitLoading: false,
					form: {
						organizationCode: '',
						organizationName: '',
						description: ''
					},
					ruleValidate: {
						organizationCode: [
                        	{ required: true, message: '请输入编号', trigger: 'blur' }
                    	],
                    	organizationName: [
                        	{ required: true, message: '请输入名称', trigger: 'blur' }
                    	],
                    	description: [
                        	{ required: true, message: '请输入描述', trigger: 'blur' }
                    	],
					}
				}
			};
		},
		methods: {

			/**
			 * @description: 重置函数：将searchForm的数据重置
			 * @param {type} 
			 * @return: 
			 */
			reset() {
				this.$refs["form"].resetFields();
			},
			/**
			 * @description: 查询函数：将searchForm的数据与实际搜索数据合并惊醒查询
			 * @param {type} 
			 * @return: 
			 */
			query() {
				this.form.query = {
					...this.form.params,
				};
				this.table.pageNum = 1;
				this.initTablbe();
			},
			/**
			 * @description: 获取表格数据实体函数
			 * @param   
			 * @return: 
			 */
			initTablbe() {
				let params = {
					...this.form.query,
					pageNum: this.table.pageNum,
					pageSize: this.table.pageSize
				}
				console.log(params);
			},
			/**
			 * @description: pageNum变动函数
			 * @param {Number} pageNum
			 * @return: 
			 */
			pageChange() {
				this.initTablbe();
			},
			/**
			 * @description: pageSize变动函数
			 * @param {Number} pageSize
			 * @return: 
			 */
			pageSizeChange(pageSize) {
				this.table.pageSize = pageSize;
				this.initTablbe();
			},
			// 删除
			del() {
				console.log(1111111111)
				this.delDialog.show = true;
			},
			openDialog(type) {
				this.addEditDialog.show = true;
				this.addEditDialog.type = type;
			},
			submit() {
				
			}
		},
		watch: {

		}
	};
</script>

<style lang="less">
	.department-manage {
		.ivu-split-trigger-vertical {
			box-shadow: none !important;
		}
		button {
			margin-top: -5px; margin-left: 4px;
		}
	}
</style>