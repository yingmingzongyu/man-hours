<!--部门管理-->
<template>
	<split-pane v-model="split.offset" min="200px" max="500px">
		<div slot="left" style="height: 100%; background: #fff; padding-left: 20px; padding-top: 10px;">
			<Tree :data="tree.data" @on-select-change="onSelectChange"></Tree>
		</div>

		<div slot="right" class="department-manage">
			<Card dis-hover>
				<p slot="title">
					当前组织部门信息
				</p>
				<Form ref="form" :model="form.params" inline :label-width="120">
            		<FormItem label="部门编号：">{{this.form.organizationCode}}</FormItem>
            		<FormItem label="部门名称：">{{this.form.organizationName}}</FormItem>
            		<br>
            		<FormItem label="描述：">{{this.form.description}}</FormItem>
          		</Form>
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
	import { getDepartmentTree, getDepartmentTable, addDepartment, editDepartment } from '@/api/system.js'
	import SplitPane from "_c/split-pane";
	export default {
		components: {
			SplitPane
		},
		data() {
			return {
				split: {
					offset: 0.2
				},
				tree: {
        			data: [],
      			},
				form: {
					organizationCode: "",
					organizationName: "",
					description: "",
					id: 0
				},
				table: {
					columns: [
						{ type: 'selection', width: 60, align: 'center' },
						{ title: "部门编号", key: "organizationCode" },
						{ title: "部门名称", key: "organizationName" },
						{ title: "描述", key: "description" },
						{ 
							title: "状态", 
							key: "openFlag",
                        	render: (h, params) => {
								return h("span", {} ,params.row.openFlag  == 1 ? "禁用" : "启用")
							}
						},
						{
							title: "操作",
							key: "address",
							align: "center",
							render: (h, params) => {
								return h("div", [
									h("span", {
	                                   	class: 'operation-btn',
										on: {
											click: () => {
												this.openDialog('edit', params.row);
											}
										}
									},'编辑')
								]);
							}
						}
					],
					data: [],
					total: 0,
					pageNum: 1,
					pageSize: 10
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
						description: '',
						id: ''
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
			// 左侧树
			initTree() {
		    	getDepartmentTree().then(res => {
		    		let list = this.formatTreeList(res.data.data.top);
		    		this.tree.data = [{ id:0, title:'企业部门组织结构', expand: true, children:list }]
		    	})
		   	},
		   	// 格式化树
		   	formatTreeList(list, parentNode = null) {
		   		return list.map( (v) => {
    				let { id, title, organizationCode, description, organizationName } = { id:v.id, title:v.organizationName, organizationCode:v.organizationCode, description:v.description, organizationName:v.organizationName };
					if( v.children && v.children.length > 0 ) {
					    return { id, title, parentNode, children: this.formatTreeList(v.children), organizationCode, description, organizationName };
					} else {
					    return { id, title, parentNode, organizationCode, description, organizationName };
					}
  				})
		   	},
		   	// 点击树节点
		   	onSelectChange(v) {
		   		console.log(v)
		   		
		   		
		   		
		   		if((v.length < 1) || (v[0] && v[0].id == 0)) {
		   			Object.keys(this.form).forEach(key => key != 'id' ? this.form[key] = "" : "");
		   		} else {
		   			Object.assign(this.form, v[0]);
		   		}
		   		this.query();
		   	},
		   	// 表格
		   	query() {
				let params = {
        			parentId: this.form.id,
        			pageNum: this.table.pageNum,
        			pageSize: this.table.pageSize
      			}
      			getDepartmentTable(params).then(res => {
        			let { list, total, pages, pageNum} = res.data.data;
        			this.table.data = list;
        			this.table.total = total;
        			if(pages < pageNum && pages != 0) {
          				this.table.pageNum = pages;
        			}
      			})
			},
			// 翻页
			pageChange(v) {
				this.table.pageNum = v;
				this.query();
			},
			// 页面大小切换
			pageSizeChange(pageSize) {
				this.table.pageSize = pageSize;
				this.query();
			},
			// 删除
			del() {
				console.log(1111111111)
				this.delDialog.show = true;
			},
			// 打开新增编辑弹窗
			openDialog(type, data) {
				this.$refs['addEditDialog'].resetFields();
				this.addEditDialog.show = true;
				this.addEditDialog.type = type;
				if(type == 'edit') {
					Object.assign(this.addEditDialog.form, data);
				} else {
					Object.keys(this.addEditDialog.form).forEach(key => this.addEditDialog.form[key] = '');
				}
			},
			// 提交
			submit() {
				this.$refs['addEditDialog'].validate((valid) => {
                    if(valid) {
                    	if(this.addEditDialog.type == 'add') {
                    		this.add();
                    	} else {
                    		this.edit();
                    	}
                    } 
                })
			},
			// 新增
			add() {
				this.addEditDialog.submitLoading = true;
				let params = {
        			parentId: this.form.id,
        			...this.addEditDialog.form,
      			}
            	addDepartment(params).then(res => {
        			if(res.data.status == 200) {
          				this.$Message.success(res.data.message);
          				this.addEditDialog.show = false;
          				this.initTree();
						this.query();
        			} else {
        				this.$Message.error(res.data.message);
        			}
        			this.addEditDialog.submitLoading = false;  
        		})
			},
			// 编辑
			edit(data) {
				this.addEditDialog.submitLoading = true;
				let params = this.addEditDialog.form
            	editDepartment(this.addEditDialog.form).then(res => {
        			if(res.data.status == 200) {
          				this.$Message.success(res.data.message);
          				this.addEditDialog.show = false;
          				this.initTree();
						this.query();
        			} else {
        				this.$Message.error(res.data.message);
        			}
        			this.addEditDialog.submitLoading = false;  
        		})
			}
		},
		mounted() {
    		this.initTree();
    		this.query();
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