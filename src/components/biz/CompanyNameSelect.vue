<template>
  <el-select v-model="svalue" placeholder="全部" filterable clearable>
    <el-option
      v-for="item in options"
      :key="item"
      :label="item"
      :value="item"
    />

  </el-select>
</template>

<script>

import { listCompanyName } from '@/api/base/index'

export default {
  name: 'CompanyNameSelect',
  props: {
    value: {
      type: String,
      default: '全部'
    }
  },
  data() {
    return {
      options: [],
      svalue: this.value
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
      listCompanyName().then(resp => {
        this.options = resp.data
      })
    }
  }
}
</script>
