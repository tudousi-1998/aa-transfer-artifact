<template>
  <view class="content">
    <!-- 顶部 -->
    <view class="title">
      <view>全局配置</view>
      <view class="iconfont icon-guanbi"></view>
    </view>
    <view class="list width90">
      <view class="list__title">
        主题色
      </view>
      <view class="list__item">
        <view class="list__item__color">
          <view class="list__item__color__item" v-for="(item, index) in colorList" :key="index"
            :style="{backgroundColor: item.color}" @click="onColorClick(item)">
            <text v-if="thisColor === item.color" class="iconfont icon-dui"
              style="color: white; font-size: 26rpx;"></text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        colorList: [{
            color: '#007aff'
          },
          {
            color: '#19be6b'
          }
        ],
        thisColor: '#007aff'
      }
    },
    methods: {
      onColorClick(item) {
        this.thisColor = item.color
      }
    }
  }
</script>

<style scoped lang="scss">
  .content {
    height: 70vh;
  }

  .title {
    position: relative;
    text-align: center;
    margin-top: 20rpx;
    font-size: 38rpx;
    font-weight: 600;

    .icon-guanbi {
      position: absolute;
      right: 30rpx;
      top: 14rpx;
      font-size: 28rpx;
    }
  }

  .list {
    margin-top: 20rpx;
    font-size: 32rpx;

    &__title {
      color: $u-main-color;
      font-weight: 500;
    }

    &__item {
      margin: 20rpx 0;

      &__color {
        display: flex;

        &__item {
          width: 60rpx;
          height: 60rpx;
          line-height: 60rpx;
          text-align: center;
          margin-right: 20rpx;
          border-radius: 10rpx;
        }
      }
    }
  }
</style>
