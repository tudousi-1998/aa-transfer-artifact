<template>
  <view class="main">
    <nav-bar :bgColor="['#2979ff','#a0cfff']" bgColorAngle="90" fontColor="#FFF" title="aa转账神器">
    </nav-bar>
    <view class="content fill">
      <!-- 表格 -->
      <view class="cj-table">
        <!-- 表头 -->
        <view class="width90" style="height: 80rpx;">
          <view class="flex row cj-table__head">
            <view class="cj-index">ID</view>
            <view class="fill main-word">
              <view class="cj-payuser">付款人</view>
              <view class="cj-paymoney">付款金额</view>
              <view class="cj-contractor">承担人</view>
            </view>
            <view class="cj-del">
              删除
            </view>
          </view>
        </view>
        <!-- 主体列表 -->
        <view class="cj-table__main">
          <scroll-view class="main-scroll" scroll-y="true">
            <view class="width90">
              <view class="flex row cj-table__main__item" v-for="(item, index) in infoList" :key="index">
                <view class="cj-index">
                  {{ index+1 }}
                </view>
                <view class="fill main-word">
                  <view class="cj-payuser" @click="onPayUserClick(item, index)">
                    <text v-if="item.payUser">{{ item.payUser }}</text>
                    <text v-else class="text4">请选择</text>
                  </view>
                  <view class="cj-paymoney">
                    <input type="number" v-model="infoList[index].money" placeholder="请输入"
                      placeholder-style="color: #c0c4cc; font-size: 32rpx" />
                  </view>
                  <view class="cj-contractor" @click="onConUserClick(item, index)">
                    <text v-if="item.conUser.length === 0" class="text4">请选择</text>
                    <text v-else-if="item.conUser.length === userList.length">全部</text>
                    <text v-else>{{ item.conUser.length }}人</text>
                  </view>
                </view>
                <view class="cj-del">
                  <text class="iconfont icon-guanbi" @click="onShowMoreClick(item, index)"></text>
                </view>
              </view>
            </view>
            <!-- 新增按钮 -->
            <view class="width90 add-btn">
              <u-button type="primary" @click="onAddClick" throttle-time="0">新增</u-button>
            </view>
          </scroll-view>
        </view>
      </view>
      <!-- 计算按钮 -->
      <view class="width90 res-btn">
        <u-button type="default" @click="onResetClick">重置</u-button>
        <view style="width: 10rpx;"></view>
        <u-button type="primary" @click="onOk" style="width: 100%; flex:1;">计算</u-button>
      </view>
    </view>
    <!-- 其他 -->
    <u-popup v-model="navbarPopShow" mode="bottom" border-radius="14">
      <cj-navbar-config></cj-navbar-config>
    </u-popup>
    <!-- 付款人 -->
    <u-popup v-model="uPopShow" mode="bottom" border-radius="14">
      <view class="upop-content">
        <!-- 顶部 -->
        <view class="upop-content__title width90">
          <view>{{ uPopTitle }}</view>
          <view class="iconfont icon-guanbi" @click="uPopShow = false"></view>
        </view>
        <view class="upop-content__action width90">
          <u-button type="primary" throttle-time="0" @click="onDeleteAllUserClick">清空人员</u-button>
          <u-button v-if="!openDelete" type="primary" throttle-time="0" @click="onDeleteUserClick(true)">删除人员</u-button>
          <u-button v-else type="error" throttle-time="0" @click="onDeleteUserClick(false)">完成删除</u-button>
          <u-button type="primary" throttle-time="0" @click="onAddUserClick">添加人员</u-button>
        </view>
        <view class="text4" style="margin-left: 40rpx; margin-top: 5rpx; font-size: 26rpx;">删除/清空人员都将会重置账单数据，请合理使用
        </view>
        <view class="upop-content__choose width90">
          <view style="font-weight: 600;">
            <text>已选：</text>
            <text>{{ checkedUser }}</text>
          </view>
          <view v-if="uPopTitle === '选择/编辑承担人'" :class="allChecked ? 'upop-content__choose__checked' : ''"
            @click="onAllCheckedClick">
            全选
          </view>
        </view>
        <scroll-view class="upop-content__scroll" scroll-y="true">
          <!-- 人员列表 -->
          <view class="upop-content__list width90">
            <view class="upop-content__list__btn" v-for="(item, index) in userList" :key="index"
              @click="onUserClick(item)">
              {{ item.name }}
              <view v-if="item.checked" class="upop-content__list__btn__checked">
                <view class="iconfont icon-dui" style="color: white; font-size: 20rpx;"></view>
              </view>
              <view v-if="openDelete" class="upop-content__list__btn__delete" @click.stop="onUserDelClick(item, index)">
                <view class="iconfont icon-shanchu" style="color: white; font-size: 34rpx;"></view>
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="upop-content__sure width90">
          <u-button type="primary" throttle-time="0" @click="onSelectOk" :disabled="checkedUser === '无'">确定</u-button>
        </view>
      </view>
    </u-popup>
    <!-- modal -->
    <u-modal v-model="modalShow" :content="modalContent" :title="modalTitle" show-cancel-button @confirm="modalConfirm"
      @cancel="modalCancel">
      <view v-if="modalTitle === '添加人员'" class="width90">
        <view style="height: 50rpx;"></view>
        <u-field v-model="newUserName" label="姓名" maxlength="8" :focus="addFocus" placeholder="请输入姓名(4字内)">
        </u-field>
        <view style="height: 50rpx;"></view>
      </view>
      <view v-else style="">
        <view style="height: 50rpx;"></view>
        <view class="modal-content">
          {{ modalContent }}
        </view>
        <view style="height: 50rpx;"></view>
      </view>
    </u-modal>
  </view>
</template>

<script>
  import CjNavbarConfig from '@/components/CjNavbarConfig/CjNavbarConfig.vue'

  export default {
    components: {
      CjNavbarConfig
    },
    data() {
      return {
        modalShow: false,
        modalContent: '',
        modalTitle: '提示',
        modalParams: {},
        userList: this.$store.state.user.userList.map(item => {
          return {
            name: item,
            checked: false
          }
        }),
        infoList: [{
          payUser: '',
          money: '',
          conUser: this.$store.state.user.userList.map(item => {
            return item
          }),
          checked: false
        }],
        navbarPopShow: false,
        uPopShow: false,
        uPopTitle: '选择/编辑付款人',
        newUserName: '',
        openDelete: false, // 开启删除
        thisIndex: 0, // 当前选中的元素在数组的下标值
        addFocus: false
      }
    },
    onLoad() {

    },
    methods: {
      reset() {
        // 重置数据
        this.userList = this.$store.state.user.userList.map(item => {
          return {
            name: item,
            checked: false
          }
        })
        this.infoList = [{
          payUser: '',
          money: '',
          conUser: this.$store.state.user.userList.map(item => {
            return item
          }),
          checked: false
        }]
      },
      onAddClick() {
        // 新增
        this.infoList.push({
          payUser: '',
          money: '',
          conUser: this.userList.map(item => {
            return item.name
          }),
          checked: false
        })
      },
      onShowMoreClick(item, index) {
        // 删除某一行
        this.infoList.splice(index, 1)
      },
      onPayUserClick(item, index) {
        // 点击付款人
        this.uPopTitle = '选择/编辑付款人'
        this.thisIndex = index
        const payUser = this.infoList[index].payUser
        this.userList.forEach(item => {
          if (item.name === payUser) {
            item.checked = true
          } else {
            item.checked = false
          }
        })
        this.uPopShow = true
      },
      onConUserClick(item, index) {
        // 点击承担人
        this.uPopTitle = '选择/编辑承担人'
        this.thisIndex = index
        const conUser = this.infoList[index].conUser
        this.userList.forEach(item => {
          if (conUser.indexOf(item.name) !== -1) {
            item.checked = true
          } else {
            item.checked = false
          }
        })
        this.uPopShow = true
      },
      onAddUserClick() {
        // 点击添加人员
        this.modalTitle = '添加人员'
        this.modalShow = true
        this.addFocus = true
      },
      onDeleteUserClick(value) {
        // 点击删除人员
        this.openDelete = value
      },
      onUserDelClick(item, index) {
        // 点击单个用户删除
        this.modalTitle = '删除人员'
        this.modalContent = '确认删除用户“' + item.name + '”吗？'
        this.modalParams = {
          id: index
        }
        this.modalShow = true
      },
      onDeleteAllUserClick() {
        // 点击清空人员
        this.modalTitle = '清空人员'
        this.modalContent = '确认清空人员吗？'
        this.modalShow = true
      },
      onUserClick(item) {
        // 点击单个人员事件，如果是付款人，单选；如果是承担人，多选
        if (this.uPopTitle === '选择/编辑付款人') {
          this.userList.forEach(user => {
            user.checked = false
          })
          item.checked = true
        } else {
          // 承担人，多选
          item.checked = !item.checked
        }
      },
      onAllCheckedClick() {
        // 点击全选
        if (this.allChecked) {
          this.userList.forEach(item => {
            item.checked = false
          })
        } else {
          this.userList.forEach(item => {
            item.checked = true
          })
        }
      },
      onSelectOk() {
        // 点击选择人员的确定
        if (this.uPopTitle === '选择/编辑付款人') {
          // 付款人确定
          this.infoList[this.thisIndex].payUser = this.userList.filter(item => {
            return item.checked
          })[0].name
          this.uPopShow = false
        } else {
          // 承担人确认
          this.infoList[this.thisIndex].conUser = this.userList.filter(item => {
            return item.checked
          }).map(item => {
            return item.name
          })
          this.uPopShow = false
          this.openDelete = false
        }
      },
      modalCancel() {
        if (this.modalTitle === '添加人员') {
          this.addFocus = false
        }
      },
      modalConfirm() {
        if (this.modalTitle === '添加人员') {
          if (this.newUserName) {
            if (this.userList.map(item => {
                return item.name
              }).indexOf(this.newUserName) !== -1) {
              this.newUserName = ''
              this.$util.msg('失败：该人员已存在')
            } else {
              // infoList中已经是全部的保持还是全部
              const userListLen = this.userList.length
              this.infoList.forEach(item => {
                if (userListLen === item.conUser.length) {
                  item.conUser.splice(0, 0, this.newUserName)
                }
              })
              this.userList.splice(0, 0, {
                name: this.newUserName,
                checked: false
              })
              this.newUserName = ''
              this.$store.commit('SET_USERLIST', this.userList.map(item => {
                return item.name
              }))
              this.$util.msg('添加成功')
              this.addFocus = false
            }
          } else {
            this.$util.msg('失败：人员姓名不可为空')
          }
        } else if (this.modalTitle === '清空人员') {
          this.userList = []
          this.$store.commit('SET_USERLIST', [])
          this.reset()
        } else if (this.modalTitle === '删除人员') {
          this.userList.splice(this.modalParams.id, 1)
          this.$store.commit('SET_USERLIST', this.userList.map(item => {
            return item.name
          }))
          this.reset()
        } else if (this.modalTitle === '重置确认') {
          this.reset()
        }
      },
      onResetClick() {
        // 点击重置按钮
        this.modalTitle = '重置确认'
        this.modalContent = '确认要重置数据吗？'
        this.modalShow = true
      },
      onOk() {
        const infoList = this.infoList
        for (let i of infoList) {
          if (!i.money || !i.payUser) {
            this.$util.msg('请将数据补充完整')
            return
          }
        }
        // 计算出1对1的每条数据
        const allList = []
        infoList.forEach(item => {
          const itemMoney = Number(item.money) / parseInt(item.conUser.length)
          item.conUser.forEach(once => {
            if (once !== item.payUser) {
              allList.push({
                payUser: item.payUser,
                money: itemMoney,
                conUser: once
              })
            }
          })
        })
        // 算出每个人手中现有的钱，默认为0，最终结果为0，付的多为负，付的少为正
        const allObj = {}
        allList.forEach(item => {
          allObj[item.payUser] = (allObj[item.payUser] || 0) - item.money
          allObj[item.conUser] = (allObj[item.conUser] || 0) + item.money
        })
        // 把正和负区分开并排序
        const getList = []
        const sendList = []
        for (let i in allObj) {
          if (allObj[i] > 0) {
            sendList.push({
              name: i,
              money: Math.abs(allObj[i])
            })
          } else if (allObj[i] < 0) {
            getList.push({
              name: i,
              money: Math.abs(allObj[i])
            })
          }
        }
        getList.sort(function(a, b) {
          return a.money - b.money
        })
        sendList.sort(function(a, b) {
          return a.money - b.money
        })
        // 依次转账列表
        const aaList = []
        // 算法1：总体次数最少 同时转给一个人，一个人再去转
        sendList.forEach(item => {
          aaList.push({
            sendUser: item.name,
            getUser: getList[0].name,
            money: item.money.toFixed(1)
          })
        })
        getList.slice(1).forEach(item => {
          aaList.push({
            sendUser: getList[0].name,
            getUser: item.name,
            money: item.money.toFixed(1)
          })
        })
        console.log('转账列表', aaList)
        // 全部平均消费
        const averList = []
        const userListLen = this.userList.length
        infoList.forEach(item => {
          if (item.conUser.length === userListLen) {
            averList.push(item.money)
          }
        })
        let averMoney = 0
        if (averList.length > 0) {
          averMoney = (averList.reduce((a, b) => {
            return Number(a) + Number(b)
          }) / userListLen).toFixed(1)
        }
        console.log('公共项目平均个人消费金额', averMoney)
        // 个人消费数据
        const conList = [] // 承担人列表
        infoList.forEach(item => {
          const itemMoney = Number(item.money) / parseInt(item.conUser.length)
          item.conUser.forEach(once => {
            conList.push({
              money: itemMoney,
              conUser: once
            })
          })
        })
        const userMoneyObj = {} // 每个人的消费
        conList.forEach(item => {
          userMoneyObj[item.conUser] = (userMoneyObj[item.conUser] || 0) + item.money
        })
        for (let i in userMoneyObj) {
          userMoneyObj[i] = userMoneyObj[i].toFixed(1)
        }
        console.log('个人消费数据', userMoneyObj)
        // 借助本地缓存传输数据
        const statResult = {
          aaList,
          conList,
          averMoney,
          userMoneyObj
        }
        uni.showLoading({
          title: '计算中'
        })
        uni.setStorageSync('statResult', statResult)
        setTimeout(() => {
          uni.hideLoading()
          uni.navigateTo({
            url: './Stat'
          })
        }, 500)
      }
    },
    computed: {
      checkedUser() {
        // 已选：{{ x }}
        const list = this.userList.filter(item => {
          return item.checked
        })
        if (list.length === 0) {
          return "无"
        } else if (list.length === 1) {
          return list[0].name
        } else {
          return list.length.toString() + '人'
        }
      },
      allChecked() {
        // 是否全选
        for (let i in this.userList) {
          if (!this.userList[i].checked) {
            return false
          }
        }
        return true
      }
    }
  }
</script>

<style scoped lang="scss">
  .main {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .cj-table {
    flex: 1;
    font-size: 32rpx;
    display: flex;
    flex-direction: column;
    width: 100%;

    &__head {
      width: 100%;
      background-color: $u-border-color;
      padding: 5rpx 0;
      line-height: 60rpx;
      height: 60rpx;
      font-weight: 600;
    }

    .main-scroll {
      height: 100%;
    }

    &__main {
      flex: 1;
      height: 0;

      &__item {
        width: 100%;
        padding: 5rpx 0;
        height: 60rpx;
        line-height: 60rpx;
        border-bottom: 1rpx solid $u-border-color;
      }
    }

    .cj-index {
      width: 80rpx;
      text-align: center;
    }

    .cj-del {
      width: 100rpx;
      text-align: center;
    }

    .main-word {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      justify-content: space-between;
      align-items: center;
    }
  }

  .add-btn {
    margin: 30rpx auto;

    /deep/ .u-btn--primary {
      color: $u-main-color;
      background-color: white;
      border: 1rpx $u-main-color dotted;
    }

    /deep/ .u-primary-hover {
      background-color: $u-tips-color !important;
    }
  }

  .res-btn {
    height: 100rpx;
    margin: 50rpx auto;
    display: flex;
  }

  .upop-content {
    height: 900rpx;

    &__title {
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

    &__action {
      margin-top: 60rpx;
      display: flex;
      justify-content: space-between;

      /deep/ .u-btn--primary {
        color: $u-main-color;
        background-color: $u-border-color;
      }
    }

    &__choose {
      font-size: 32rpx;
      margin-top: 60rpx;
      display: flex;
      justify-content: space-between;

      &__checked {
        color: $u-type-primary;
      }
    }

    &__scroll {
      margin-top: 30rpx;
      height: 400rpx;
    }

    &__list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      &__btn {
        position: relative;
        width: 116rpx;
        margin-bottom: 15rpx;
        height: 76rpx;
        line-height: 76rpx;
        text-align: center;
        padding: 0 40rpx;
        color: $u-main-color;
        border: 1rpx solid $u-type-primary;
        border-radius: 15rpx;
        white-space: nowrap;
        overflow: hidden;

        &__checked {
          position: absolute;
          top: 0;
          right: 0;
          width: 40rpx;
          height: 20rpx;
          background-color: $u-type-primary;
          border-bottom-left-radius: 8rpx;
          border-bottom-right-radius: 5rpx;
          border-top-left-radius: 5rpx;
          color: white;
          text-align: center;
          line-height: 20rpx;
        }

        &__delete {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background-color: rgba($color: #000000, $alpha: 0.5);
        }
      }

      &:after {
        content: '';
        width: 200rpx;
      }
    }

    &__sure {
      margin-top: 30rpx;
    }
  }

  .modal-content {
    text-align: center;
    color: $u-tips-color;
    font-size: 30rpx;
  }
</style>
