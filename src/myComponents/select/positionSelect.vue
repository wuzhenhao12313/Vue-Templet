<template>
  <treeSelect :value="value" :multiple="multiple" :options="treeList" :placeholder="placeholder" @input="input"/>
</template>

<script>
import { fetchService } from '_libs/fetch'
import { createTreeData } from '_libs/util'
import TreeSelect from './treeSelect'

export default {
  name: 'positionSelect',
  components: { TreeSelect },
  data () {
    return {
      treeList: []
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    multiple: { type: Boolean },
    placeholder: { type: String },
    value: {}
  },
  created () {
    fetchService({
      url: '/Api/Position/Get'
    }).then(data => {
      const { list } = data
      this.treeList = createTreeData(list, 'positionName', 'positionID')
    })
  },
  methods: {
    input (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped>

</style>
