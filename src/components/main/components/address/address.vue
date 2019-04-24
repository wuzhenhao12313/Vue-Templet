<template>
  <div>
    <div :style="{marginRight:'12px'}">
      <Button type="text" :style="{padding: '5px 1px 6px'}" @click="openDrawer">
        <Icon :size="20" type="ios-call"/>
      </Button>
    </div>
    <Drawer title="通讯录" :closable="false" v-model="visible" width="400">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  </div>
</template>

<script>
import './address.less'

export default {
  name: 'Address',
  data () {
    return {
      visible: false
    }
  },
  methods: {
    openDrawer () {
      this.visible = true
    }
  }
}

</script>
