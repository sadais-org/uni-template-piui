<template>
  <pi-popup
    custom-class="pi-h-100P"
    hide-tab-bar
    :show-close-icon="false"
    :value="value"
    @input="handlePopupInput"
  >
    <view class="pi-rela pi-h-100P pi-flex-column-center">
      <view :style="[backIconStyle]" class="pi-flex-column-center" @tap="handleClose">
        <pi-icon name="close" size="48" />
      </view>

      <pi-img
        mode="widthFix"
        width="542"
        :src="$consts.get('STATIC_IMG_URL') + 'denglu_pic_logo.png'"
      />
      <pi-button
        type="primary"
        width="622"
        size="large"
        :custom-style="{ borderRadius: '8rpx', marginTop: '160rpx' }"
        open-type="getPhoneNumber"
        @getphonenumber="handleGetPhone"
      >
        开启授权登录
      </pi-button>
      <view class="pi-gray pi-mg-top-32" @tap="handleClose">
        暂不登录
      </view>
    </view>
  </pi-popup>
</template>

<script>
import WxCode from '@/piui/mixin/wx-code'
import { apiWxPhoneLogin } from '@/api'
import { mapActions } from 'vuex'

const TAG = 'WxAuth'

export default {
  name: TAG,
  mixins: [WxCode],
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    backIconStyle() {
      const systeminfo = this.$pi.system.systemInfo
      const top = systeminfo.statusBarHeight + 'px'
      return {
        position: 'absolute',
        top,
        left: '32rpx',
        width: this.$piConfig.navbar.height,
        height: this.$piConfig.navbar.height
      }
    }
    // systemInfo
  },
  watch: {
    value(val) {
      val && this.getWxLoginCode()
    }
  },
  methods: {
    ...mapActions(['initUserInfo']),
    handlePopupInput(value) {
      this.$emit('input', value)
    },
    handleClose() {
      this.handlePopupInput(false)
    },
    async handleGetPhone(res) {
      // 用户点击获取手机号
      const { errMsg, iv, encryptedData } = res.detail
      if (errMsg !== 'getPhoneNumber:ok') {
        this.getWxLoginCode()
        this.handleClose()
        return
      }
      try {
        await this.codeRefresh() // 刷新code，以保证code未过期
        const { code, data, msg } = await apiWxPhoneLogin(this.code, encryptedData, iv)
        this.getWxLoginCode() // code 只能用一次，接口调用后需要刷新
        if (code !== this.$consts.RET_CODE.SUCCESS) {
          this.handleClose()
          return this.$toast(msg)
        }
        this.$core.auth.saveTokenId(data.accessToken)
        this.initUserInfo()
        this.handleClose()
      } catch (error) {
        console.log(error)
        this.handleClose()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
