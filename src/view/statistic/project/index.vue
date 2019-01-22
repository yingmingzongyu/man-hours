<!--项目工时统计-->
<template>
	<div class="project-time">
		<Card dis-hover>
			<p slot="title">
				<Icon type="ios-search" />查询条件
			</p>
			<Form ref="form" :model="form" inline :label-width="80">
				<FormItem prop="labelName" label="统计时间：">
					<Input type="text" v-model="form.roleName" placeholder="请输入角色名称" style="width: 180px" />
				</FormItem>
				<br />
				<FormItem prop="labelName" label="项目名称：">
					<Input type="text" v-model="form.roleName" placeholder="请输入项目名称" style="width: 180px" />
				</FormItem>
				<FormItem prop="labelName" label="项目名称：">
					<Input type="text" v-model="form.roleName" placeholder="请输入项目名称" style="width: 180px" />
				</FormItem>
			</Form>
		</Card>
		<br>
		<Card dis-hover>
			<p slot="title"></p>
			<div slot="extra">
				<div class="btn-group">
					<Button type="primary" @click="query">查询</Button>
					<Button type="primary" @click="openDialog('add')">新增</Button>
				</div>
			</div>
			<Table :columns="table.columns" :data="table.data"></Table>
		</Card>
	</div>
</template>

<script>
	import { getRole, delRole, addRole, detailRole, editRole } from "@/api/system.js";
	import { getSlideMenu } from "@/api/routers.js";
	import { syncValue } from '@/libs/util.js';
	import personCheck from "./component/person-check.vue";
	export default {
		components: {
    		personCheck
  		},
		data() {
			return {
				// 查询条件
				form: {
					roleName: ''
				},
				// 表格
				table: {
					columns: [
						{ title: "角色名称", key: "roleName" },
						{ title: "描述", key: "description" },
						{ 
							title: "操作",
							key: "handle",
							align: "center",
							render: (h, params) => {
								return h("div", [
									h('span', {
	                                    class: 'operation-btn',
	                                    on: {
	                  						click: () => {
	                                            this.openDialog('edit',params.row)
	                                        }
	                                    },
	                               	}, '编辑'),
	                               	h('span', {
	                                    class: 'operation-btn',
	                                    on: {
	                  						click: () => {
	                  							this.deleteData(params.row.id)
	                                        }
	                                    },
	                               	}, '删除')
								]);
							}
						}
					],
					data: []
				},
				// 新增
				addDialog: {
					show: false,
					submitLoading: false,
					form: {
						roleName: "",		// 角色名称
						description: ""		// 描述
					},
					ruleValidate: {
						 roleName: [
                        	{ required: true, message: '请输入角色名称', trigger: 'blur' }
                    	],
					}
				},
				// 编辑
				editDialog: {
					show: false,
					submitLoading: false,
					id: '',
					// 基本信息
					form: {
						roleName: "",		// 角色名称
						description: ""		// 描述
					},
					ruleValidate: {
						
					},
					// 权限设置
					treeData: [],
	                // 人员信息
	                columns: [
	                	{ type: 'selection', width: 60, align: 'center' },
	                	{ title: "工号", key: "userCode" },
						{ title: "登录ID", key: "loginName" },
						{ title: "用户名", key: "userName" }
	                ],
	                personList: [],
	                selection: [],
	                personDialogShow: false
				}
			};
		},
		methods: {
			// 查询
			query() {
				let data = {
					roleName: this.form.roleName,
					pageNum: this.table.pageNum,
					pageSize: this.table.pageSize
				};
				getRole(data).then(res => {
        			if(res.data.status === 200) {
          				this.table.data = res.data.data;
        			}
      			})
			},
			// 删除
			deleteData(data) {
				this.$Modal.confirm({
                    title: '确认对话框标题',
                    content: '<p>确认删除这条数据吗？</p>',
                    onOk: () => {
                        delRole({id:data}).then(res => {
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
			// 打开弹窗
			openDialog(type,data) {
				if(type == 'add') {
					this.addDialog.show = true;
					this.$refs['addDialog'].resetFields();
				} else {
					this.editDialog.show = true;
					this.$refs['editDialog'].resetFields();
					this.editDialog.selection = [];
					this.$refs.tabs.activeKey = 'name1';
					this.editDialog.id = data.id;
					this.detail(data.id);
				}
			},
			// 新增
			save() {
				this.$refs['addDialog'].validate((valid) => {
                    if(valid) {
                    	this.addDialog.submitLoading = true;
                    	addRole(this.addDialog.form).then(res => {
                    		this.addDialog.submitLoading = false;
		        			if(res.data.status == 200) {
		        				this.addDialog.show = false;
		          				this.$Message.success(res.data.message);
								this.query();
		        			} else {
		        				this.$Message.error(res.data.message);
		        			}
		        		})
                    }
                })
			},
			// 编辑
			submit() {
				this.$refs['editDialog'].validate((valid) => {
                    if(valid) {
                    	let nodes = this.$refs.tree.getCheckedNodes().map(v => v.id);
                    	let ids = this.editDialog.personList.map(v => v.id);
                    	let params = {
                    		id: this.editDialog.id,
                    		description: this.editDialog.form.description,
                    		resourceIds: nodes.toString(),
                    		userIds: ids.toString()
                    	}
                    	this.editDialog.submitLoading = true;
                    	editRole(params).then(res => {
                    		this.editDialog.submitLoading = false;
		        			if(res.data.status == 200) {
		        				this.editDialog.show = false;
		          				this.$Message.success(res.data.message);
								this.query();
		        			} else {
		        				this.$Message.error(res.data.message);
		        			}
		        		})
                    }
                })
			},
			// 角色详情
			detail(id) {
				detailRole({roleId: id}).then(res => {
            		if(res.data.status == 200) {
            			syncValue(this.editDialog.form, res.data.data.roleList);
            			this.editDialog.personList = res.data.data.userList;
            			let ids = res.data.data.resourceList.length > 0 ? res.data.data.resourceList.map(v=>v.id) : [];
            			this.getTree(ids);
            		} 
        		})
			},
			// 获取权限树
			getTree(ids) {
				getSlideMenu().then(res => {
					if(res.data.status == 200) {
						let list = this.formatTree(res.data.data.top, ids);
						this.editDialog.treeData = [{ id:0, title:'全选/全取消', expand: true, children:list }];
					} else {
						this.editDialog.treeData = [{ id:0, title:'全选/全取消', expand: true, children:[] }];
					}
      			});
			},
			// 格式化树
			formatTree(list, ids) {
		   		return list.map( (v) => {
    				let { id, title, expand, checked } = { id:v.id, title:v.resourceName, expand:true, checked:ids.indexOf(v.id)>=0?true:false };
					if( v.children && v.children.length > 0 ) {
					    return { id, title, expand, children: this.formatTree(v.children,ids), checked };
					} else {
					    return { id, title, expand, checked };
					}
  				})
		   	},
		   	// 表格勾选
			onSelectionChange(selection) {
				this.editDialog.selection = selection.map(v=> v.id);
			},
		   	// 删除人员
		   	deletePerson() {
		   		if(this.editDialog.selection.length < 1) {
					this.$Message.info("请至少选择一条数据");
					return;
				}
		   		this.editDialog.personList = this.editDialog.personList.filter(v => this.editDialog.selection.indexOf(v.id)<0);
		   	},
		   	// 打开人员弹窗
			openPeopleDialog() {
				const self = this;
				this.editDialog.personDialogShow = true;
				setTimeout(function() {
					self.$refs.personCheck.open();
				},100)
//				this.$refs.personCheck.open();
			},
			// 选择人员弹窗回调
			selectPersonHandler(data) {
				data.forEach(function(item) {
					if(item["_checked"]) {
						delete item["_checked"]
					}
				})
				this.editDialog.personList = data;
			}
		},
		mounted() {
    		this.query();
  		}
	};
</script>

<style lang="less">
	.project-time {
		button {
			margin-top: -5px; margin-left: 4px;
		}
	}
</style>