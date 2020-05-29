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
    }
  },
  data() {
    return {
      svalue: this.value,
      options: []
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
  mounted() {
    this.renderCompanyName()
  },
  methods: {
    renderCompanyName() {
      listTaskDevice().then(resp => {
        this.options = resp.data
      })
    }
  }
}

</script>
