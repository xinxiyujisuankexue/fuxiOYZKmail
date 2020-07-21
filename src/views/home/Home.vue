<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物APP</div></nav-bar>
    <tab-control class="tab-control"
                  :titles="['流行','新款','精选']" 
                  @tabClick="tabClick"
                  ref="tabControl1"
                  v-show="isTabFixed"></tab-control>

    <scroll class="content"
            ref="scroll"
            :probeType='3'
            :pull-up-load='true'
            @pullingUp='loadMore'
            @scroll='contentScroll'>
    <home-swiper :banners='banners'></home-swiper>
    <recommend-view :recommends='recommends'></recommend-view>
    <feature-view></feature-view>
    <tab-control :titles="['流行','新款','精选']" 
                  @tabClick="tabClick"
                  ref="tabControl2"></tab-control>
    <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native='backClick' v-show="isShowBackTop"></back-top>
  </div>
</template>
<script>
import HomeSwiper from './child/HomeSwiper'
import RecommendView from './child/RecommendView'
import FeatureView from './child/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'
import TabControl from 'components/content/tabcontrol/TabControl.vue'
import GoodsList from 'components/content/goods/GoodsList.vue'
import BackTop from 'components/content/backtop/BackTop'
import { getHomeMultidata , getHomeGoods } from 'network/home.js'
import {debounce} from 'common/utils.js'
export default {
  name: 'Home',
  data(){
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page:0,list:[]},
        'new': {page:0,list:[]},
        'sell': {page:0,list:[]}
      },
      currentType: 'pop',
      isShowBackTop: false,
      isTabFixed: false,
      tabOffsetTop: 0,
      saveY: 0
    }
  },
  computed: {
    showGoods(){
      return this.goods[this.currentType].list
    }
  },
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,

    NavBar,
    Scroll,
    TabControl,
    GoodsList,
    BackTop
  },
  created() {
    // 1.创建时请求轮播图数据
    this.getHomeMultidata()
    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted(){
    const refresh = debounce(this.$refs.scroll.refresh,50)
    this.$bus.$on('itemImageLoad',()=>{
      refresh()
    })
  },
  // 记下每一次路由跳转时的y坐标，以保证下次回来时坐标不变
  activated() {
    this.$refs.scroll.scrollTo(0,this.saveY,0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY()
  },

  methods: {
    tabClick(index){
      switch(index){
        case 0: 
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    backClick(){
      this.$refs.scroll.scrollTo(0,0,500)
    },
    // 监听滚动的位置
    contentScroll(position){
      // 返回到顶部是否显示
      this.isShowBackTop = (-position.y) > 1000
      // 顶部tab-control是否显示
      this.isTabFixed = (-position.y) > this.$refs.tabControl2.$el.offsetTop
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
    },
    // 网络请求相关代码
    getHomeMultidata(){
      getHomeMultidata().then(res=>{
        // console.log(res);
        this.banners = res.data.data.banner.list;
        this.recommends = res.data.data.recommend.list;
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page + 1;
      getHomeGoods(type,page).then(res => {
        // console.log(res.data.data.list);
        this.goods[type].list.push(...res.data.data.list);  // 把里面的数据一个个取出来放进去 
        this.goods[type].page += 1;

        // 上拉加载更多
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>
<style scoped>
  #home {
    padding-top: 44px;
    /* height: 100vh; */
    height: 3000px;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .content {
    /* height: 300px; */
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }

</style>