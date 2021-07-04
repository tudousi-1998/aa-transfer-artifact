<template>
  <view class="main">
    <nav-bar :bgColor="['#2979ff','#a0cfff']" bgColorAngle="90" fontColor="#FFF" title="统计">
      <view slot="left">
        <text class="iconfont icon-arrow-right" style="color: white; font-size: 30rpx; margin-left: 30rpx;"
          @click="onBackClick"></text>
      </view>
    </nav-bar>
    <!-- 主体 -->
    <view style="height: 20rpx;"></view>
    <view class="width90 font-weight-700 title">共需转账 {{ aaList.length }} 次</view>
    <view style="height: 20rpx;"></view>
    <view class="width90" style="padding-left: 30rpx;">
      <u-time-line>
        <u-time-line-item v-for="(item, index) in aaList" :key="index" :nodeTop="15">
          <template v-slot:node>
            <view class="cj-node">
            </view>
          </template>
          <template v-slot:content>
            <view class="cj-order">
              <view class="cj-order__desc font-weight-700">{{ item.sendUser }}</view>
              <view class="cj-order__connect">转给</view>
              <view class="cj-order__desc font-weight-700">{{ item.getUser }}</view>
              <view class="cj-order__desc font-weight-700">{{ item.money }}</view>
            </view>
          </template>
        </u-time-line-item>
      </u-time-line>
    </view>
    <view class="cj-line"></view>
    <view class="width90 font-weight-700 title">公共项目人均消费 {{ averMoney }} 元</view>
    <view class="cj-line"></view>
    <view class="width90 font-weight-700 title">个人消费排行图</view>
    <view class="charts-box">
      <qiun-data-charts type="column" :chartData="chartData" background="none" :ontouch="true" :opts="chartConfig" />
    </view>
    <!-- 其他 -->
    <u-popup v-model="navbarPopShow" mode="bottom" border-radius="14">
      <cj-navbar-config></cj-navbar-config>
    </u-popup>

  </view>
</template>

<script>
  import CjNavbarConfig from '../../components/CjNavbarConfig/CjNavbarConfig.vue'
  import qiunDataCharts from '../../components/qiun-data-charts/qiun-data-charts.vue'
  import chartConfig from './modules/chartConfig.js'

  export default {
    components: {
      CjNavbarConfig,
      qiunDataCharts
    },
    data() {
      return {
        chartConfig,
        navbarPopShow: false,
        aaList: [],
        averMoney: 0,
        chartData: ''
      }
    },

    methods: {
      onBackClick() {
        // 返回上个页面
        uni.navigateBack()
      },
    },
    onLoad() {
      // 从本地缓存获取数据
      const data = uni.getStorageSync('statResult') || ''
      if (data) {
        this.aaList = data.aaList
        this.averMoney = data.averMoney
        const userMoneyObj = data.userMoneyObj
        const sortUserList = Object.keys(userMoneyObj).sort(function(a, b){
          return userMoneyObj[b] - userMoneyObj[a]
        })
        const chartData = {
          categories: sortUserList,
          series: [{
            name: '消费/元',
            data: sortUserList.map(item => {
              return userMoneyObj[item]
            })
          }]
        }
        setTimeout(() => {
          this.chartData = chartData
        }, 1000)
      } else {
        this.$util.msg('无效数据')
      }
    },
  }
</script>

<style scoped lang="scss">
  .cj-line {
    margin: 30rpx 0;
  }
  
  .charts-box {
    width: 94%;
    margin: 30rpx auto;
    height: 500rpx;
  }

  .font-weight-700 {
    font-weight: 700;
  }

  .title {
    font-size: 38rpx;
  }

  .cj-node {
    width: 14rpx;
    height: 14rpx;
    border-radius: 50%;
    border: 5rpx solid $u-type-primary;
  }

  .cj-order {
    display: flex;
    align-items: center;
    color: $u-main-color;
    font-size: 32rpx;
    text-align: center;

    &__desc {
      width: 150rpx;
    }

    &__connect {
      width: 100rpx;
      color: $u-tips-color;
    }
  }
</style>
