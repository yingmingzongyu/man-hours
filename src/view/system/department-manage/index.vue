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
            		<FormItem label="部门编号：">{{ this.form.organizationCode }}</FormItem>
            		<FormItem label="部门名称：">{{ this.form.organizationName }}</FormItem>
            		<br>
            		<FormItem label="描述：">{{ this.form.description }}</FormItem>
          		</Form>
			</Card>
			<br>
			<Card dis-hover>
				<p slot="title"></p>
				<div slot="extra">
					<div class="btn-group">
						<Button type="primary" @click="del">删除</Button>
						<Button type="primary" @click="openDialog('add')">新增</Button>
						<Button type="primary" @click="changeOpenFlag(1)">禁用</Button>
						<Button type="primary" @click="changeOpenFlag(0)">启用</Button>
					</div>
				</div>
				<Table :columns="table.columns" :data="table.data" @on-selection-change="onSelectionChange"></Table>
				<br>
				<Page show-total :total="table.total" :current.sync="table.pageNum" show-sizer show-elevator @on-change="pageChange" @on-page-size-change="pageSizeChange" />
			</Card>
			
			<!--新增、编辑弹窗-->
			<Modal v-model="addEditDialog.show" :title="addEditDialog.type=='add'?'新增部门':'编辑部门'" :loading="true" class-name="department-dialog" draggable>
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
		</div>
	</split-pane>
</template>

<script>
	import { getDepartmentTree, getDepartmentTable, addDepartment, editDepartment, delDepartment, changeDepartmentFlag } from '@/api/system.js';
	import SplitPane from "_c/split-pane";
	import { syncValue, deepCopy } from '@/libs/util.js';
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
      			// 当前部门信息
				form: {
					organizationCode: "",
					organizationName: "",
					description: "",
					id: 0,
					openFlag: ''
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
					pageSize: 10,
					selection: []
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
				},
			};
		},
		mounted() {
    		this.initTree('init');
    		/*
    		 * tips:
    		 * 1、字段验证不全
    		 * 2、树一共几级？？
    		 * 3、父节点禁用，子节点全部禁用，且子节点无法进行任何操作
    		 * 4、父节点启用，子节点禁用，可以对该子节点进行删除、编辑操作
    		 */
  		},
		methods: {
			// 左侧树
			initTree(type) {
		    	getDepartmentTree().then(res => {
		    		if(res.data.status == 200) {
		    			this.tree.data = this.formatTreeList(res.data.data.top);
		    			if(type == 'init') {
		    				// 初始化时，停留在最大的节点
		    				syncValue(this.form, this.tree.data[0]);
		    				console.log(this.tree.data)
		    				this.query();
		    			} else if(type == 1) {
		    				// 各种操作时，停留在当前节点，并且当前页置为1
		    				this.table.pageNum = 1;
		    				this.query();
		    			} else {
		    				// 各种操作时，停留在当前节点
		    				this.query();
		    			}
		    		} else {
		    			this.tree.data = [];
		    			Object.keys(this.form).forEach(key => this.form[key] = '');
		    		}
		    	})
		   	},
		   	// 格式化树
		   	formatTreeList(list) {
		   		return list.map( (v) => {
    				let { id, title, organizationCode, description, organizationName, openFlag } = { 
    					id: v.id, 
    					title: v.organizationName, 
    					organizationCode: v.organizationCode, 
    					description: v.description, 
    					organizationName: v.organizationName,
    					openFlag: v.openFlag
    				};
					if( v.children && v.children.length > 0 ) {
					    return { id, title, children: this.formatTreeList(v.children), organizationCode, description, organizationName, openFlag, expand: true };
					} else {
					    return { id, title, organizationCode, description, organizationName, openFlag, expand: true, };
					}
  				})
		   	},
		   	// 点击树节点
		   	onSelectChange(nodelist, node) {
		   		syncValue(this.form, node);
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
      				if(res.data.status == 200) {
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
			pageSizeChange(pageSize) {
				this.table.pageSize = pageSize;
				this.query();
			},
			// 表格勾选
			onSelectionChange(selection) {
				this.table.selection = selection.map(v => v.id);
			},
			// 删除
			del() {
				if(this.form.openFlag == 1) {
                    this.$Message.info("父节点已被禁用，禁止操作");
                    return false;
                }
				if(this.table.selection.length < 1) {
					this.$Message.info("请至少选择一条数据");
					return;
				}
				this.$Modal.confirm({
                    title: '确认对话框标题',
                    content: '<p>确认删除这些数据吗？</p>',
                    loading: true,
                    onOk: () => {
                    	let params = {
                    		parentId: this.form.id,
                    		ids: this.table.selection.toString()
                    	}
                        delDepartment(params).then(res => {
                        	this.$Modal.remove();
		        			if(res.data.status == 200) {
		          				this.$Message.success(res.data.message);
		          				this.initTree();
		        			} else {
		        				this.$Message.error(res.data.message);
		        			}
		        		})
                    }
               	});
			},
			// 禁用、启用
			changeOpenFlag(type) {
				if(this.form.openFlag == 1) {
                    this.$Message.info("父节点已被禁用，禁止操作");
                    return false;
                }
				if(this.table.selection.length < 1) {
					this.$Message.info("请至少选择一条数据");
					return;
				}
				let tip = type == 1 ? '禁用' : '启用';
				this.$Modal.confirm({
                    title: '确认对话框标题',
                    content: '<p>确认'+tip+'这些部门及其子分类吗？</p>',
                    loading: true,
                    onOk: () => {
                    	let params = {
                    		openFlag: type,
                    		ids: this.table.selection.toString()
                    	}
                        changeDepartmentFlag(params).then(res => {
                        	this.$Modal.remove();
		        			if(res.data.status == 200) {
		          				this.$Message.success(res.data.message);
								this.query();
		        			} else {
		        				this.$Message.error(res.data.message);
		        			}
		        		})
                    }
               	});
			},
			// 打开新增编辑弹窗
			openDialog(type, data) {
				if(this.form.openFlag == 1) {
                    this.$Message.info("父节点已被禁用，禁止操作");
                    return false;
                }
				this.$refs['addEditDialog'].resetFields();
				this.addEditDialog.show = true;
				this.addEditDialog.type = type;
				if(type == 'edit') {
					syncValue(this.addEditDialog.form, data);
				} else {
					Object.keys(this.addEditDialog.form).forEach(key => this.addEditDialog.form[key] = '');
				}
			},
			// 提交
			submit() {
				this.$refs['addEditDialog'].validate((valid) => {
                    if(valid) {
                    	this.addEditDialog.type == 'add' ? this.add() : this.edit();
                    } 
                })
			},
			// 新增
			add() {
				let params = deepCopy(this.addEditDialog.form);
				params['parentId'] = this.form.id;
				delete params['id'];
				this.addEditDialog.submitLoading = true;
            	addDepartment(params).then(res => {
            		this.addEditDialog.submitLoading = false;  
        			if(res.data.status == 200) {
          				this.$Message.success(res.data.message);
          				this.addEditDialog.show = false;
          				this.initTree(1);
        			} else {
        				this.$Message.error(res.data.message);
        			}
        		})
			},
			// 编辑
			edit(data) {
				let params = deepCopy(this.addEditDialog.form);
				delete params['organizationCode'];
				this.addEditDialog.submitLoading = true;
            	editDepartment(params).then(res => {
            		this.addEditDialog.submitLoading = false;  
        			if(res.data.status == 200) {
          				this.$Message.success(res.data.message);
          				this.addEditDialog.show = false;
          				this.initTree();
        			} else {
        				this.$Message.error(res.data.message);
        			}
        		})
			}
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
	.department-dialog {
		textarea.ivu-input {
			height: 210px; resize: none;
		}
	}
</style>