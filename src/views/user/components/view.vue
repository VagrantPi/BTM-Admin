<style>
.label {
  margin-bottom: 10px;
}
.block {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

<template>

  <div class="app-container">
    <h1>基本資料</h1>
    <el-row>
      <el-col :span="16">
        <div class="label">姓名：{{ info.name }}</div>
        <div class="label">身分證號：{{ info.id_number }}</div>
        <div class="label">出身年月日：{{ info.birthday }} ({{ calculateAge(info.birthday) }} 歲)</div>
        <div class="label">地址：{{ info.address }}</div>
        <div class="label">職業：{{ info.occupation }}</div>
        <div class="label">手機：{{ info.phone_number }}</div>
        <div class="label">Email：{{ info.email }}</div>
        <div class="label">Customer ID：{{ customer_id }}</div>
      </el-col>
      <el-col :span="8">
        <div class="block">
          <span class="demonstration">自拍照</span>
          <el-image
            style="height: 400px;"
            :src="urls.selfie_img"
            fit="cover"
          />
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="block">
          <span class="demonstration">身分證正面</span>
          <el-image
            :src="urls.id_card_front_img"
            fit="cover"
          />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="block">
          <span class="demonstration">身分證反面</span>
          <el-image
            :src="urls.id_card_back_img"
            fit="cover"
          />
        </div>
      </el-col>
    </el-row>

    <br>
    <br>
    <br>

    <el-tabs type="border-card">
      <el-tab-pane label="用戶備註">
        <NoteTable
          v-if="customer_id && phone"
          :customer-id="customer_id"
          :phone="phone"
          :note-type="1"
        />
      </el-tab-pane>
      <el-tab-pane label="交易紀錄">
        <TxsTable
          :is-detail="true"
        />
      </el-tab-pane>
      <el-tab-pane label="綁定地址">
        <AddressWhiteList />
      </el-tab-pane>
      <el-tab-pane label="審核紀錄">
        <ReviewHistory
          v-if="info && info.applicant_id"
          :applicant-id="info.applicant_id"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCustomerDetail, getSumsubImage } from '@/api/customers'
import waves from '@/directive/waves' // waves directive
import TxsTable from '@/components/Users/txs/index.vue'
import AddressWhiteList from '@/components/Users/addressWhiteList/index.vue'
import ReviewHistory from '@/components/Users/reviewHistory/index.vue'
import NoteTable from '@/components/Users/note/index.vue'

export default {
  name: 'WhitelistView',
  components: { TxsTable, AddressWhiteList, ReviewHistory, NoteTable },
  directives: { waves },
  data() {
    return {
      info: {
        applicant_id: '',
        name: '',
        id_number: '',
        birthday: '',
        address: '',
        occupation: '',
        phone_number: '',
        email: '',
        inspection_id: '',
        id_card_front_img_id: '',
        id_card_back_img_id: '',
        selfie_img_ids: []
      },
      urls: {
        id_card_front_img: '',
        id_card_back_img: '',
        selfie_img: ''
      },
      customer_id: '',
      phone: ''
    }
  },
  created() {
    const { query } = this.$route
    this.customer_id = query.customerID
    this.phone = query.phone
    this.getInfo()
  },
  methods: {
    async getInfo() {
      const response = await getCustomerDetail(this.customer_id, this.$store.getters.token)
      this.info = response.data
      // id_card_front_img_id
      const frontImgResponse = await getSumsubImage({ inspection_id: this.info.inspection_id, image_id: this.info.id_card_front_img_id }, this.$store.getters.token)
      const frontImgBlob = new Blob([frontImgResponse.data], { type: 'image/jpeg' })
      this.urls.id_card_front_img = URL.createObjectURL(frontImgBlob)
      // id_card_back_img_id
      const backImgResponse = await getSumsubImage({ inspection_id: this.info.inspection_id, image_id: this.info.id_card_back_img_id }, this.$store.getters.token)
      const backImgBlob = new Blob([backImgResponse.data], { type: 'image/jpeg' })
      this.urls.id_card_back_img = URL.createObjectURL(backImgBlob)
      // selfie_img_ids
      const selfieImgId = this.info.selfie_img_ids.length > 0 ? this.info.selfie_img_ids[0] : ''
      const selfieImgResponse = await getSumsubImage({ inspection_id: this.info.inspection_id, image_id: selfieImgId }, this.$store.getters.token)
      const selfieImgBlob = new Blob([selfieImgResponse.data], { type: 'image/jpeg' })
      this.urls.selfie_img = URL.createObjectURL(selfieImgBlob)
    },
    calculateAge(birthDateStr) {
      // 檢查輸入格式
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDateStr)) {
        return 0
      }

      // 將字串轉換為日期對象
      const birthDate = new Date(birthDateStr)

      // 檢查日期是否有效
      if (isNaN(birthDate.getTime())) {
        throw new Error('無效的日期')
      }

      // 獲取當前日期
      const today = new Date()

      // 計算年齡差異
      let age = today.getFullYear() - birthDate.getFullYear()

      // 檢查今年的生日是否已經過了
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age-- // 如果今年生日還沒到，年齡減1
      }

      return age
    }
  }
}
</script>
