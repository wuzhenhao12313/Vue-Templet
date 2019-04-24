<template>
  <div>
    <tree-select
      :value="value"
      :multiple="multiple"
      :options="options"
      :placeholder="placeholder"
      @input="input"
    />
  </div>
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'vue-tree-select',
  components: { TreeSelect },
  props: {
    options: { required: true, type: Array },
    multiple: { type: Boolean },
    placeholder: { type: String },
    value: {}
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
