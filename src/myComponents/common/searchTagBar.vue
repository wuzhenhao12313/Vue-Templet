<template>
  <div class="searchTagBar" v-show="options.length>0">
    <Icon class="marginRight-5" type="ios-funnel-outline"/>
    <span class="marginRight-5">检索项：</span>
    <Tag class="tag" v-for="tag in options" closable @on-close="clear(tag.key)" :key="tag.key">{{tag.name}}：{{tag.value}}
    </Tag>
    <span class="clearSpan" @click="clear(null)">清除</span>
  </div>
</template>

<script>
export default {
  name: 'searchTagBar',
  props: {
    options: { required: true, type: Array }
  },
  data () {
    return {}
  },
  methods: {
    clear (key) {
      if (key) {
        this.$emit('clear', key)
      } else {
        this.$emit('clear')
      }
    }
  }
}
</script>

<style lang="less">
  .searchTagBar {
    margin-bottom: 5px;
    .marginRight-5 {
      margin-right: 5px;
    }
    .tag {
      border: none;
    }
    & > span {
      color: #999;
      &.clearSpan {
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }

</style>
