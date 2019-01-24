<template>
  <Modal v-model="visible" title="选择部门" :loading="true" class-name="organize-modal" @on-visible-change="onVisibleChange">
      <div slot="footer">
        <Button @click="submit()" type="info" :loading="submitLoading">保存</Button>
      </div>
      <Tree :data="list" @on-select-change="onSelectChange" :render="render"></Tree>
    </Modal>
</template>

<script>
import {
  getDepartmentTree
} from "@/api/system";
import {
  formatTreeList
} from '@/libs/util.js';
export default {
  name: "orginize-tree",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'radio'
    }
  },
  data() {
    return {
      visible:this.value,
      list:[],
      selectId:'',
      selectNode:{},
      submitLoading: false,
    }
  },
  methods: {
    getTreeData(){
      getDepartmentTree().then(res => {
        let list = formatTreeList(res.data.data.top[0].children,{ id:0, title:'组织树', expand: true},{
          id:"id",
          title:"organizationName"
        })

        this.list = [{ id:0, title:'组织树', expand: true, children:list }]
        console.log(list);
        
      })
    },
    submit(){
      this.$emit('submit',this.selectNode)
      this.$emit('input',false)
    },
    onSelectChange(visible){
      // this.$emit('input',visible);
    },
    onVisibleChange(visible){
      this.$emit('input',visible);
    },
    render(h, { root, node, data }) {
      const self = this;
      if(data.id == 0){
        return h('span', null, data.title) 
      }else{
        return h('span', null, [
          h('Radio', {
            attrs:{
              value:self.selectId==data.id,
              label:data.id
            },
            on:{
              input:(v)=>{ 
                self.selectId = data.id
                self.selectNode = data
              }
            }
          },data.title)
        ])
      }
    }
  },
  watch:{
    value(cur, old){
      this.visible = cur;
      this.selectId = this.data || 0;
    },
    data(cur, old){
      this.selectId = cur;
    }
  },
  mounted() {
    this.selectId = this.data || 0;
    this.getTreeData();
  },
};
</script>

<style lang="less">


</style>


