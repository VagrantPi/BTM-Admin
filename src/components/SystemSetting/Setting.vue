<style>
.filter-item {
  margin-left: 5px;
}
.highlight-option {
  background: #ffba0073;
}
</style>

<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="app-container" element-loading-background="rgba(0, 0, 0, 0.3)">
    <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
      <el-tab-pane label="公開固定限額" name="first">
        <el-form ref="form1" :inline="true" :rules="rules1" :model="form1" label-position="left" style="margin:30px;">
          <el-form-item label="日限額" prop="daily_limit" :min="0">
            <el-input v-model.number="form1.daily_limit" />
          </el-form-item>

          <el-form-item label="月限額" prop="monthly_limit" :min="0">
            <el-input v-model.number="form1.monthly_limit" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <br>
    <br>
    <br>
    <br>

    <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
      <el-tab-pane label="交易次數限制" name="first">
        <el-form ref="form2" :inline="true" :rules="rules2" :model="form2" label-position="left" style="margin:30px;">
          <el-form-item label="天數" prop="limit_days" :min="0">
            <el-input v-model.number="form2.limit_days" />
          </el-form-item>
          <el-form-item label="次數" prop="limit_times" :min="0">
            <el-input v-model.number="form2.limit_times" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <br>
    <br>
    <br>
    <br>

    <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
      <el-tab-pane label="EDD: Level 1" name="first">
        <el-form ref="form3" :inline="true" :rules="rules3" :model="form3" label-position="left" style="margin:30px;">
          <el-form-item label="交易限額" prop="level1_volumn" :min="0">
            <el-input v-model.number="form3.level1_volumn" />
          </el-form-item>
          <el-form-item label="累積交易金額天數" prop="level1_days" :min="0">
            <el-input v-model.number="form3.level1_days" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <br>
    <br>
    <br>
    <br>

    <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
      <el-tab-pane label="EDD: Level 2" name="first">
        <el-form ref="form4" :inline="true" :rules="rules4" :model="form4" label-position="left" style="margin:30px;">
          <el-form-item label="交易限額" prop="level2_volumn" :min="0">
            <el-input v-model.number="form4.level2_volumn" />
          </el-form-item>
          <el-form-item label="累積交易金額天數" prop="level2_days" :min="0">
            <el-input v-model.number="form4.level2_days" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <br>
    <br>
    <br>
    <br>

    <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
      <el-tab-pane label="變更事由" name="first">
        <el-form ref="form5" :inline="true" :rules="rules5" :model="form5" label-position="left" style="margin:30px;">
          <el-form-item label="目前角色權限" prop="reason">
            <el-select v-model="form5.reason" placeholder="目前角色權限">
              <el-option
                v-for="item in reasons"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <br>
    <br>
    <br>
    <br>

    <el-button type="warning" @click="updateLimit()">
      Update
    </el-button>

    <br>
    <br>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { updateConfigLimit } from '@/api/config'

export default {
  name: 'Setting',
  directives: { waves },
  props: {
    customerType: {
      type: Number,
      required: true
    },
    limitConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      fullscreenLoading: false,
      rules1: {
        daily_limit: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '日限額必須為數字', trigger: 'blur' },
          { type: 'number', message: '數字需大於 0', min: 1 }
        ],
        monthly_limit: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '月限額必須為數字', trigger: 'blur' },
          { type: 'number', message: '數字需大於 0', min: 1 }
        ]
      },
      rules2: {
        limit_days: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '天數必須為數字', trigger: 'blur' },
          { type: 'number', message: '數字需大於 0', min: 1 }
        ],
        limit_times: [
          { required: true, message: '不能為空' },
          { type: 'number', message: '次數必須為數字', trigger: 'blur' },
          { type: 'number', message: '數字需大於 0', min: 1 }
        ]
      },
      rules3: {
        level1_volumn: [
          { required: true, message: '不能為空' },
          { type: 'number', message: 'Level 1 限額必須為數字', trigger: 'blur' },
          { type: 'number', message: '數字需大於 0', min: 1 }
        ],
        level1_days: [
          { required: true, message: '不能為空' },
          { type: 'number', message: 'Level 1 累積交易金額天數必須為數字', trigger: 'blur' },
          { type: 'number', message: '數字需大於 0', min: 1 }
        ]
      },
      rules4: {
        level2_volumn: [
          { required: true, message: '不能為空' },
          { type: 'number', message: 'Level 2 限額必須為數字', trigger: 'blur' },
          { type: 'number', message: '數字需大於 0', min: 1 }
        ],
        level2_days: [
          { required: true, message: '不能為空' },
          { type: 'number', message: 'Level 2 累積交易金額天數必須為數字', trigger: 'blur' },
          { type: 'number', message: '數字需大於 0', min: 1 }
        ]
      },
      rules5: {
        reason: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      form1: {
        daily_limit: 0,
        monthly_limit: 0
      },
      form2: {
        limit_days: 0,
        limit_times: 0
      },
      form3: {
        level1_volumn: 0,
        level1_days: 0
      },
      form4: {
        level2_volumn: 0,
        level2_days: 0
      },
      form5: {
        reason: ''
      },
      activeName: 'first',
      reasons: [
        { name: '風控單位評估' },
        { name: '行銷單位評估' },
        { name: '法務單位評估' },
        { name: '客戶反應優化' },
        { name: '例行性調整' },
        { name: '其他因素' }
      ]
    }
  },
  created() {
    this.form1.daily_limit = Number(this.limitConfig.daily_limit)
    this.form1.monthly_limit = Number(this.limitConfig.monthly_limit)
    // this.form2.limit_days = Number(this.limitConfig.limit_days)
    // this.form2.limit_times = Number(this.limitConfig.limit_times)
    this.form3.level1_volumn = Number(this.limitConfig.level1)
    this.form3.level1_days = Number(this.limitConfig.level1_days)
    this.form4.level2_volumn = Number(this.limitConfig.level2)
    this.form4.level2_days = Number(this.limitConfig.level2_days)
  },
  methods: {
    async updateLimit() {
      try {
        const valid1 = await this.$refs.form1.validate()
        const valid2 = await this.$refs.form2.validate()
        const valid3 = await this.$refs.form3.validate()
        const valid4 = await this.$refs.form4.validate()
        const valid5 = await this.$refs.form5.validate()
        if (valid1 && valid2 && valid3 && valid4 && valid5) {
          this.$alert('確定要更新設定嗎?', '更新設定', {
            type: 'warning',
            confirmButtonText: '确定',
            callback: action => {
              if (action === 'confirm') {
                this.fullscreenLoading = true
                updateConfigLimit(this.$store.getters.token, {
                  role: this.customerType,
                  ...this.form1,
                  ...this.form2,
                  ...this.form3,
                  ...this.form4,
                  ...this.form5
                })
                  .then(() => {
                    this.$message({
                      type: 'success',
                      message: '更新成功'
                    })

                    setTimeout(() => {
                      this.fullscreenLoading = false
                      location.reload()
                    }, 500)
                  })
                  .catch(err => {
                    if (err && err.msg && err.msg.includes('no limit change')) {
                      this.$message({
                        type: 'error',
                        message: '未有限額變更'
                      })
                    }
                  })
              }
            }
          })
        } else {
          this.$message.error('有必填參數未填寫')
        }
      } catch (err) {
        this.$message.error('有必填參數未填寫')
      }
    }
  }
}
</script>
