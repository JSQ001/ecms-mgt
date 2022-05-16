<template>
  <div class="article-new">
    <div class="form-box">
      <div class="title">{{ edit ? '修改' : '新增' }}通告</div>
      <Form
        ref="formRef"
        name="custom-validation"
        :rules="rulesRef"
        :model="state.record"
        style="width: 90%"
        @finish="handleSave"
        :label-col="{ style: { width: '100px' } }"
      >
        <Row type="flex">
          <Col :span="24">
            <FormItem label="标题" name="title">
              <Input v-model:value="state.record.title" placeholder="请输入标题" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="发布人" name="publisher">
              <Input v-model:value="state.record.publisher" placeholder="请输入发布人" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="发布时间" name="publishTime">
              <DatePicker
                style="width: 100%"
                v-model:value="state.record.publishTime"
                placeholder="请选择发布时间"
                format="YYYY-MM-DD"
              />
            </FormItem>
          </Col>
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
          <Col :span="24">
            <div class="btnArea">
              <Button
                type="primary"
                html-type="button"
                v-if="state.record.state === undefined || state.record.state !== 1"
                @click="save"
                >保存为草稿
              </Button>
              <Button type="primary" html-type="submit">发布</Button>
              <Button @click="router.back()">返回</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance, computed, toRaw, watch } from 'vue'
import { Form, Input, Row, Col, DatePicker, Button, message } from 'ant-design-vue'
import { commonUpdate, getUploadUrl, commonCreate, getInfoById } from '@/api/common'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { resetUrl, getUrl, getText } from '@/utils'

const route = useRoute()
const router = useRouter()
const edit = ref(false)
const FormItem = Form.Item
const formRef = ref()
const { proxy } = getCurrentInstance()
const { global_config } = window

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
  ]
})

onMounted(() => {
  state.visible = true
  state.editorConfig = {
    initialFrameWidth: null,
    UEDITOR_HOME_URL: '/ecms-mgt/UEditor/', // 访问 UEditor 静态资源的根路径，可参考常见问题1
    serverUrl: getUploadUrl() // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
  }
  getInfo()
})

async function getInfo() {
  try {
    edit.value = false
    if (!route.query.id) return
    edit.value = true
    const { data } = await getInfoById('notices', route.query.id)
    state.record = {
      ...data.data,
      publishTime: dayjs(data.data.publishTime),
      content: data.data.content ? getUrl(data.data.content) : null
    }
  } catch (e) {
    console.log(e)
  }
}

async function save() {
  await proxy.$refs.formRef.validate()
  handleSave({
    ...state.record,
    state: 0
  })
}

async function handleSave(val) {
  try {
    const params = {
      _moduleKey: 'notices',
      ...val,
      content: resetUrl(val.content),
      essential: getText(val.content)
    }
    if (val.state === undefined) {
      params.state = 1
    }
    if (state.record.publishTime) {
      params.publishTime = dayjs(state.record.publishTime).format('YYYY-MM-DD HH:mm:ss')
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
      await router.push('/notice')
    } else {
      message.error('保存失败！')
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped lang="scss">
@import '~@/styles/variables.scss';

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
    text-align: center;
    margin-top: 0.1rem;
    box-sizing: border-box;
    padding-left: 100px;

    button {
      &:nth-child(2),
      &:nth-child(3) {
        margin-left: 0.2rem;
      }
    }
  }
}
</style>
