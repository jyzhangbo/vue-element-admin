<template>
  <el-cascader v-model="svalue" :options="options" placeholder="请选择" clearable />
</template>
<script>
import { listTaskDevice } from '@/api/base/index'

export default {

  name: 'TaskDeviceSelect',
  props: {
    value: {
      type: Array,
      default: function() {
        []
      }
    },
    taskstate: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      svalue: this.value,
      options: [],
      taskStateIn: this.taskstate
    }
  },
  watch: {
    value(val) {
      this.svalue = val
    },
    svalue(val, oldVal) {
      if (val !== oldVal) {
        this.$emit('input', val)
      }
    }
  },
  created() {
    this.renderCompanyName()
  },
  methods: {
    renderCompanyName() {
      listTaskDevice(this.taskStateIn).then(resp => {
        this.options = resp.data
        this.svalue.push(resp.data[0].value)
        this.svalue.push(resp.data[0].children[0].value)
      })
    }
  }
}

</script>
