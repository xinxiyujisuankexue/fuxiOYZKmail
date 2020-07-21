<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive"><slot name="item-icon">1</slot></div>
    <div v-else><slot name="item-icon-active">1</slot></div>
    <div :style='activeStyle'><slot name="item-text">1</slot></div>
  </div>
</template>
<script>
export default {
  name: 'TabBarItem',
  props: {
    path: String,
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  data(){
    return {
      // isActive: false
    }
  },
  computed: {
    isActive(){
      return this.$route.path.indexOf(this.path) !== -1
    },
    activeStyle(){
      return this.isActive ? {color: this.activeColor} : {}
    }
  },
  methods: {
    itemClick(){
      this.$router.replace(this.path)
    }
  }
}
</script>
<style scoped>
  .tab-bar-item {
    flex: 1;
    height: 49px;
    font-size: 14px;
    text-align: center;
  }
  .tab-bar-item img {
    width: 24px;
    height: 24px;
    margin: 3px 0 2px 0;
    vertical-align: middle;
  }
</style>