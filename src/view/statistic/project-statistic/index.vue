<!--项目工时统计-->
<template>
	<div class="project-statistic">
		<Card dis-hover>
			<p slot="title">
				<Icon type="ios-search" />查询条件
			</p>
			<Form ref="form" :model="form" inline :label-width="120">
				<FormItem prop="date" label="统计时间：">
					<DatePicker v-model="form.date" type="daterange" :options="dateOptions" style="width: 200px" placeholder="请选择时间"></DatePicker>
				</FormItem>
				<FormItem prop="projectNumber" label="项目编号：">
					<Input v-model="form.projectNumber" placeholder="请输入项目编号" style="width: 200px" />
				</FormItem>
				<FormItem prop="projectName" label="项目名称：">
					<Input v-model="form.projectName" placeholder="请输入项目名称" style="width: 200px" />
				</FormItem>
				<FormItem prop="businessType" label="业务类型：">
					<Select v-model="form.businessType" style="width:200px">
						<Option v-for="item in businessTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</FormItem>
				<FormItem prop="labelName" label="标签：">
					<Input type="text" v-model="form.labelName" readonly placeholder="请选择标签" style="width: 200px" icon="md-apps" @on-click="openLabel" />
				</FormItem>
				<FormItem prop="projectAttribution" label="项目归属：">
					<Select v-model="form.projectAttribution" style="width:200px">
						<Option v-for="item in projectAttributionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</FormItem>
			</Form>
		</Card>
		<br>
		<Card dis-hover>
			<p slot="title"></p>
			<div slot="extra">
				<div class="btn-group">
					<Button type="primary" @click="reset">重置</Button>
					<Button type="primary" @click="search">查询</Button>
					<Button type="primary">导出Excel</Button>
				</div>
			</div>
			<Table :columns="table.columns" :data="table.data" :loading="table.loading">
				<template slot-scope="{ row }" slot="action">
					<!--<Button type="text" size="small" icon="ios-search" @click="goToDetail(row.id)"></Button>-->
					<span class="operation-btn" @click="goToDetail(row.id)">统计详情</span>
				</template>
			</Table>
			<br>
			<Page show-total :total="table.total" :current.sync="params.pageNum" show-sizer show-elevator @on-change="pageChange" @on-page-size-change="pageSizeChange" />
		</Card>

		<label-check ref="labelCheck" @selectLabelHandler="selectLabelHandler" :defaultSelect="form.labelList"></label-check>
	</div>
</template>

<script>
	import labelCheck from "../components/label-check.vue";
	import { syncValue, deepCopy, formatTime } from '@/libs/util.js';
	import { getProjectHourStatistics } from "@/api/statistic";
	export default {
		components: {
			labelCheck
		},
		data() {
			return {
				dateOptions: {
					shortcuts: [{
							text: "最近7天",
							value() {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								return [start, end];
							}
						},
						{
							text: "最近30天",
							value() {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
								return [start, end];
							}
						},
						{
							text: "最近90天",
							value() {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
								return [start, end];
							}
						}
					]
				},
				businessTypeList: [
					{ value: '', label: '请选择' },
					{ value: 1, label: '智能化项目' },
					{ value: 2, label: '系统集成项目' },
					{ value: 3, label: '多媒体项目' },
					{ value: 4, label: '运维服务项目' },
					{ value: 5, label: '软件项目' },
					{ value: 6, label: '软件产品' },
					{ value: 7, label: '内部培训' },
					{ value: 8, label: '外部培训' },
				],
				projectAttributionList: [
					{ value: '', label: '请选择' },
					{ value: 'ZH', label: '智恒信' },
					{ value: 'GX', label: '智信共创' },
					{ value: 'PT', label: '平台公司' },
				],
				form: {
					date: [], 				// 统计时间
					projectNumber: "", 		// 项目编号
					projectName: "", 		// 项目名称
					businessType: "", 		// 业务类型
					projectAttribution: "", // 项目归属
					labelId: "", 			// 标签id
					labelName: "", 			// 标签名称
					labelList: [],			// 标签列表
				},
				params: {
					startTime: "",
					endTime: "",
					projectNumber: "",
					projectName: "",
					businessType: "",
					projectAttribution: "",
					labelId: "",
					pageNum: 1,
					pageSize: 10
				},
				table: {
					columns: [
						{ title: "项目编号", key: "projectNumber" },
						{ title: "项目名称", key: "projectName" },
						{
							title: "业务类型",
							key: "businessType",
							render: (h, params) => {
								let businessType = '';
								switch(params.row.businessType) {
									case 1:
										businessType = '智能化项目'; break;
									case 2:
										businessType = '系统集成项目'; break;
									case 3:
										businessType = '多媒体项目'; break;
									case 4:
										businessType = '运维服务项目'; break;
									case 5:
										businessType = '软件项目'; break;
									case 6:
										businessType = '软件产品'; break;
									case 7:
										businessType = '内部培训'; break;
									case 8:
										businessType = '外部培训'; break;
								}
								return h("span", null, businessType)
							}
						},
						{ title: "项目创建时间", key: "createtime" },
						{ title: "项目总耗时(h)", key: "elapsedTotal" },
						{ title: "项目参与人数", key: "participantsNumber" },
						{ title: "操作", key: "action", slot: "action", align: "center" }
					],
					data: [{
							id: 1,
							projectNumber: "001",
							projectName: "ITSM",
							businessType: 2,
							createtime: "2019-01-23",
							elapsedTotal: 20,
							participantsNumber: 5
						},
						{
							id: 2,
							projectNumber: "001",
							projectName: "ITSM",
							businessType: 2,
							createtime: "2019-01-23",
							elapsedTotal: 20,
							participantsNumber: 5
						}
					],
					total: 0,
					loading: false
				},
			};
		},
		mounted() {
			this.query();
		},
		methods: {
			query() {
				let param = deepCopy(this.params);
				for(let item in param) {
					if(!param[item]) {
						delete param[item];
					}
				}
				console.log(param);
//				this.table.loading = true;
//				getProjectHourStatistics(param).then(res => {
//    				if(res.data.status == 200) {
//    					this.table.data = res.data.data.list;
//      				this.table.total = res.data.data.total;
//    				} else {
//    					this.table.data = [];
//      				this.table.total = 0;
//    				}
//    				this.table.loading = false;
//    			})
			},
			pageChange(v) {
				this.params.pageNum = v;
				this.query();
			},
			pageSizeChange(v) {
				this.params.pageSize = v;
				this.query();
			},
			// 查询
			search() {
				syncValue(this.params, this.form);
				this.params.startTime = formatTime(this.form.date[0]);
				this.params.endTime = formatTime(this.form.date[1]);
				this.params.pageNum = 1;
				this.query();
			},
			// 重置
			reset() {
				this.$refs["form"].resetFields();
				this.form.labelList = [];
				this.form.labelId = "";
			},
			// 打开标签弹窗
			openLabel() {
				const self = this;
				setTimeout(function() {
					self.$refs.labelCheck.open();
				},100)
			},
			// 选择标签弹窗回调
			selectLabelHandler(data) {
				this.form.labelList = data;
				this.form.labelId = "";
				this.form.labelName = "";
				let ids = []; 
				let names = [];
				data.forEach(function(item) {
					ids.push(item.id);
					names.push(item.labelName);
					if(item["_checked"]) {
						delete item["_checked"]
					}
				})
				this.form.labelId = ids.toString();
				this.form.labelName = names.toString();
			},
			// 打开详情
			goToDetail(id) {
				this.$router.push({ name: "detail", params: {id: id} });
			}
		}
	};
</script>

<style lang="less">
	.project-statistic {
		.btn-group {
			button {
				margin-top: -6px;
				margin-left: 4px;
			}
		}
	}
</style>