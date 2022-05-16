<template>
  <div class="article-new">
    <div class="form-box">
      <div class="title">{{ edit ? '修改' : '新增' }}大事记</div>
      <Form
        ref="formRef"
        name="custom-validation"
        :rules="rulesRef"
        :model="state.record"
        style="width: 90%"
        @finish="handleSave"
        :label-col="{ style: { width: '100px' } }"
      >
        <Row type="flex" :gutter="10">
          <Col :span="24">
            <FormItem label="标题" name="title">
              <Input v-model:value="state.record.title" placeholder="请输入标题" />
            </FormItem>
          </Col>
          <Col :span="10">
            <FormItem label="发生时间" name="eventTime">
              <DatePicker
                :disabled-date="disabledDate"
                style="width: 100%"
                v-model:value="state.record.eventTime"
                placeholder="请选择发生时间"
                format="YYYY-MM-DD"
              />
            </FormItem>
          </Col>

          <!--        <Col :span="12">-->
          <!--          <FormItem label="附件" name="columnId">-->
          <!--            <Input placeholder="请输入"/>-->
          <!--          </FormItem>-->
          <!--        </Col>-->
          <Col :span="24">
            <FormItem label="内容" name="content">
              <div v-if="state.visible">
                <vue-ueditor-wrap
                  v-model="state.record.content"
                  :config="state.editorConfig"
                  editor-id="editor-demo-01"
                  style="width: 100%"
                />
              </div>
            </FormItem>
          </Col>
          <div class="btnArea">
            <Button type="primary" html-type="submit">{{ edit ? '保存' : '发布' }}</Button>
            <Button @click="router.back()">返回</Button>
          </div>
        </Row>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { Form, Input, Row, Col, DatePicker, Button, message } from 'ant-design-vue'
import { getInfoById, commonUpdate, commonCreate, getUploadUrl } from '@/api/common'
import { resetUrl, getUrl, getText } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const FormItem = Form.Item
const formRef = ref()
const loading = ref(false)
const { global_config } = window
const edit = ref(false)
const state = reactive({
  record: {},
  editorConfig: {},
  visible: false
})

const rulesRef = reactive({
  title: [
    {
      required: true,
      message: ''
    }
  ],
  eventTime: [
    {
      required: true,
      message: ''
    }
  ]
})

onMounted(() => {
  state.visible = true
  state.editorConfig = {
    initialFrameWidth: null,
    UEDITOR_HOME_URL: '/ecms-mgt/UEditor/', // 访问 UEditor 静态资源的根路径，可参考常见问题1
    //UEDITOR_HOME_URL: '/ecms-mgt/UEditor/', // 访问 UEditor 静态资源的根路径，可参考常见问题1
    serverUrl: getUploadUrl()
  }
  getInfo()
})
const disabledDate = (current) => {
  return current && current < dayjs('2011-12-31').endOf('day')
}

async function getInfo() {
  try {
    edit.value = false
    if (!route.query.id) return
    edit.value = true
    const { data } = await getInfoById('memorials', route.query.id)
    state.record = {
      ...data.data,
      eventTime: dayjs(data.data.eventTime ? data.data.eventTime : new Date()),
      content: data.data.content ? getUrl(data.data.content) : null
    }
  } catch (e) {
    console.log(e)
  }
}

async function handleSave(val) {
  try {
    const params = {
      _moduleKey: 'memorials',
      ...val,
      content: resetUrl(val.content),
      essential: getText(val.content)
    }
    if (state.record.eventTime) {
      params.eventTime = dayjs(state.record.eventTime).format('YYYY-MM-DD HH:mm:ss')
    }

    if (state.record.id) {
      params.id = state.record.id
    }

    let method = params.id ? commonUpdate : commonCreate
    const {
      data: { data, code },
      status
    } = await method(params)
    if (status === 200 && code === 200 && data) {
      message.success('保存成功！')
      await router.push('/memorial')
    } else {
      message.error('保存失败！')
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped lang="scss">
#editor-demo-01 {
  width: 100%;
  min-height: 2.4rem;
}

:deep(#edui1_iframeholder) {
  min-height: 1.8rem;
}

//:deep(#edui1_toolbarbox){
//  display: none;
//}
//:deep(#edui1_bottombar){
//  display: none;
//}
.article-new {
  width: 100%;

  :deep(.ant-form) {
    .wrapperCheckArea {
      .ant-form-item-control-input-content {
        display: flex;
        align-items: center;

        .isMajor {
          margin: 0 0.2rem;
        }

        .isFocus {
          margin: 0;
        }
      }
    }
  }

  .ant-input-number {
    width: 100%;
  }

  .btnArea {
    width: 100%;
    box-sizing: border-box;
    padding-left: 100px;
    text-align: center;
    margin-top: 0.1rem;

    button {
      &:nth-child(2) {
        margin-left: 0.2rem;
      }
    }
  }
}
</style>
