<template>
  <div id="home">
    <!--头部开始-->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <!--头部结束-->

    <!--导航栏目占位开始-->
    <tab-control
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />
    <!--导航栏目占位结束-->

    <!--滚动效果开始-->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @scroll="contentScroll"
      @pullingUp="loadMore"
      >
     <!--轮播图开始-->
     <home-swiper :banners="banners" @swiperImgLoad="swiperImgLoad"/>
     <!--轮播图结束-->

     <!--推荐栏目开始-->
     <recommend-view :recommends="recommends"/>
     <!--推荐栏目结束-->

     <!--本周流行开始-->
     <feature-view/>
     <!--本周流行结束-->

     <!--导航栏目开始-->
     <tab-control
       :titles="['流行','新款','精选']"
       @tabClick="tabClick"
       ref="tabControl2"
     />
     <!--导航栏目结束-->

     <!--导航栏目商品开始-->
     <goods-list :goods="showGoods"/>
     <!--导航栏目商品结束-->
    </scroll>
    <!--滚动效果结束-->

    <!--回到顶部开始-->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!--回到顶部结束-->

    </div>
</template>

<script>

  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/backTop/BackTop";

  import {getHomeMultidata, getHomeGoods} from "network/home";
  import {debounce} from "common/utils";

  export default {
    name: "Home",
    components: {
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,

      HomeSwiper,
      RecommendView,
      FeatureView
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata();

      // 2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    mounted() {
      // 1.加载图片防止刷新频繁，防抖动函数处理
      const refresh = debounce(this.$refs.scroll.refresh,100);

      // 2.监听item中图片加载完成
      this.$bus.$on('itemImgLoad', () => {
        refresh();
      })

    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list;
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0);
      this.$refs.scroll.refresh();
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY();
    },
    methods: {
      /**
       * 事件监听相关方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break;
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick() {
        this.$refs.scroll.scrollTo(0,0,500);
      },
      contentScroll(position) {
        // 1.判断backTop是否显示
        this.isShowBackTop = -position.y > 1000;

        // 2.决定tabControl是否吸顶（position：fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType);
      },
      swiperImgLoad() {
        // 3.获取tabControl的offsetTop
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      /**
      * 网络请求相关方法
      */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;

          this.$refs.scroll.finishPullUp();
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;

    overflow: hidden;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

</style>
