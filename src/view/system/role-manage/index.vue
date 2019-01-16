<!--角色管理-->
<template>
	<div class="role-manage">
		<Card dis-hover>
			<p slot="title">
				<Icon type="ios-search" />查询条件
			</p>
			<Form ref="form" :model="form" inline :label-width="80">
				<FormItem prop="labelName" label="角色名称：">
					<Input type="text" v-model="form.roleName" placeholder="请输入角色名称" style="width: 180px" />
				</FormItem>
			</Form>
		</Card>
		<br>
		<Card dis-hover>
			<p slot="title"></p>
			<div slot="extra">
				<div class="btn-group">
					<Button type="primary" @click="query()">查询</Button>
					<Button type="primary" @click="openDialog('add')">新增</Button>
				</div>
			</div>
			<Table :columns="columns" :data="tableData.list" :loading="tableLoading"></Table>
			<br>
			<Page :total="tableData.total" :current.sync="tableData.pageNum" show-sizer show-elevator @on-change="pageChange" @on-page-size-change="pageSizeChange" />
		</Card>
		
		<!--弹窗-->
		<Modal v-model="addEditRole.show" :title="addEditRole.type=='add'?'新增角色':'编辑角色'" :loading="true">
      		<div slot="footer">
        		<Button @click="saveSubmit" type="info" :loading="addEditRole.submitLoading">保存</Button>
      		</div>
      		<Tabs :value="addEditRole.tabs">
        		<TabPane label="基本信息" name="name1">
        			<Form ref="addEditRole" :model="addEditRole" inline :label-width="130" :rules="addEditRole.ruleValidate">
						<FormItem prop="roleName" label="角色名称：">
							<Input type="text" v-model="addEditRole.form.roleName" placeholder="请输入角色名称" style="width: 250px" />
						</FormItem>
						<FormItem prop="description" label="描述：">
							<Input type="textarea" v-model="addEditRole.form.description" placeholder="请输入描述" style="width: 250px" />
						</FormItem>
					</Form>
        		</TabPane>
        		<TabPane label="权限设置" name="name2" :disabled="addEditRole.type == 'add'">
        			 <Tree :data="addEditRole.treeData" show-checkbox></Tree>
        		</TabPane>
        		<TabPane label="人员信息" name="name3" :disabled="addEditRole.type == 'add'">
        			<Button type="primary" style="margin: 0 10px 10px 0;">删除</Button>
					<Button type="primary" style="margin: 0 10px 10px 0;">新增</Button>
					<Table :columns="addEditRole.columns" :data="addEditRole.personList"></Table>
        		</TabPane>
    		</Tabs>
    	</Modal>
	</div>
</template>

<script>
	import { getLabel,deleteLabel } from "@/api/project";
	export default {
		props: {
			tableLoading: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				form: {
					roleName: null
				},
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
                                    style: {
                                        marginRight: '10px', color: '#2d8cf0', cursor: 'pointer'
                                    },
                                    on: {
                  						click: () => {
                                            this.openDialog('edit',params)
                                        }
                                    },
                               }, '编辑'),
								h('Poptip', {
                                    props: {
                                    	confirm: true, title: '你确定要删除吗?'
                                    },
                                    on: {
                                        'on-ok': () => {
                                        	this.deleteData(params)
//                  						vm.$emit('on-delete', params)
//                  						vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  						}
                                    },
                               }, '删除')
							]);
						}
					}
				],
				tableData: {
					list: [
						{roleName: "项目经理", description: "项目管理"},
						{roleName: "项目经理", description: "项目管理"},
					],
					total: 0,
					pageNum: 1,
					pageSize: 10
				},
				// 新增角色
				addEditRole: {
					show: false,
					type: "add",	// 新增还是编辑
					tabs: '',
					submitLoading: false,
					// 基本信息
					form: {
						roleName: "",		// 角色名称
						description: ""		// 描述
					},
					ruleValidate: {
						 roleName: [
                        	{ required: true, message: '请输入角色名称', trigger: 'blur' }
                    	],
					},
					// 权限设置
					treeData: [
                    	{
	                        title: '全选/全取消',
	                        expand: true,
	                        children: [
	                            {
	                                title: '系统管理',
	                                expand: true,
	                                children: [
	                                    {
	                                        title: '部门管理'
	                                    },
	                                    {
	                                        title: '角色管理'
	                                    },
	                                    {
	                                        title: '用户管理'
	                                    },
	                                    {
	                                        title: '菜单管理'
	                                    }
	                                ]
	                            },
	                            {
	                                title: '项目管理',
	                                expand: true,
	                                children: [
	                                    {
	                                        title: '项目施工',
	                                        expand: true,
	                                        children: [
	                                        	{
	                                        		title: '智能化项目管理'
	                                        	},
	                                        	{
	                                        		title: '系统集成项目管理'
	                                        	}
	                                        ]
	                                    },
	                                    {
	                                        title: '软件工程'
	                                    }
	                                ]
	                            }
	                        ]
	                    }
	                ],
	                // 人员信息
	                columns: [
	                	{ type: 'selection', width: 60, align: 'center' },
	                	{ title: "工号", key: "no" },
						{ title: "登录ID", key: "loginId" },
						{ title: "用户名", key: "username" }
	                ],
	                personList: [
	                	{no: "001001", loginId: "admin", username: "admin"},
						{no: "001001", loginId: "admin", username: "admin"},
	                ]
				}
			};
		},
		methods: {
			// 查询
			query() {
				let data = {
					...this.form,
					pageNum: this.tableData.pageNum,
					pageSize: this.tableData.pageSize
				};
				getLabel(data).then(res => {
        			if(res.data.status === 200) {
          				this.tableData.list = res.data.data;
          				this.tableData.total = res.data.total;
        			}
      			})
			},
			pageChange(pageNum) {
				this.tableData.pageNum = pageNum;
				this.query();
			},
			pageSizeChange(pageSize) {
				this.tableData.pageSize = pageSize;
				this.query();
			},
			// 删除
			deleteData(data) {
				console.log(data)
			},
			// 新增、编辑
			openDialog(type) {
				this.addEditRole.show = true;
				this.addEditRole.type = type;
				console.log(this.addEditRole.tabs)
//				this.$refs['addEditRole'].resetFields();
			},
			// 切换tab
			changeView(item) {
				this.editRoleDialog.basicInfo = true ? item == "basicInfo" : false;
				this.editRoleDialog.permissionsSet = true ? item == "permissionsSet" : false;
				this.editRoleDialog.personManage = true ? item == "personManage" : false;
				this.editRoleDialog.currentView = item;
			},		
			saveSubmit() {
				this.$refs['addEditRole'].validate((valid) => {
                    if(valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
			},
		},
		watch: {
			
		}
	};
</script>

<style lang="less">
	.role-manage {
		button {
			margin-top: -5px; margin-left: 4px;
		}
		.ivu-poptip-rel {
			cursor: pointer; color: #2d8cf0;
		}
		.ivu-poptip-confirm .ivu-poptip-footer {
			text-align: center;
		}
		.ivu-poptip-confirm .ivu-poptip-body .ivu-icon {
			left: 20px;
		}
	}
</style>