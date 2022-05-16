<template>
  <div class="article-new">
    <div class="form-box">
      <div class="title">{{ edit ? '修改' : '发布' }}文章</div>
      <Form
        ref="formRef"
        name="custom-validation"
        :scrollToFirstError="true"
        :rules="rulesRef"
        :model="state.record"
        style="width: 90%"
        @finish="handleSave"
        :label-col="{ style: { width: '90px' } }"
      >
        <Row type="flex" :gutter="10">
          <Col :span="24">
            <FormItem label="标题" name="title">
              <Input v-model:value="state.record.title" placeholder="请输入标题" />
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem label="副标题" name="subTitle">
              <Input v-model:value="state.record.subTitle" placeholder="请输入副标题" />
            </FormItem>
          </Col>
          <Col :span="24">
            <Row type="flex" :futter="20">
              <Col :span="21" class="cols">
                <Form.Item label="标题图片" name="coverImgUrl">
                  <Input
                    readonly
                    :value="state.record.coverImgUrl ? global_config.BASE_URL + state.record.coverImgUrl : ''"
                    placeholder="请上传文件，不可手动输入"
                  />
                </Form.Item>
                <Tooltip title="清除图片" v-if="state.record.coverImgUrl !== ''">
                  <CloseCircleOutlined class="icons" @click="state.record.coverImgUrl = ''" />
                </Tooltip>
              </Col>
              <Col :span="3" style="text-align: right">
                <Upload
                  action=""
                  accept=".jpg,.png,.jpeg"
                  v-model:file-list="state.record.fileList"
                  list-type="picture"
                  :showUploadList="false"
                  :before-upload="uploads"
                >
                  <Button type="primary" :disabled="loading" :loading="loading">上传图片</Button>
                </Upload>
              </Col>
            </Row>
          </Col>

          <Col :span="9">
            <FormItem label="作者" name="author">
              <Input v-model:value="state.record.author" placeholder="请输入作者" />
            </FormItem>
          </Col>

          <Col :span="8">
            <FormItem label="来源" name="source">
              <Input v-model:value="state.record.source" placeholder="请输入来源" />
            </FormItem>
          </Col>
          <Col :span="7">
            <FormItem label="所属栏目" name="catalogId">
              <TreeSelect
                placeholder="请选择栏目"
                v-model:value="state.record.catalogId"
                show-search
                :dropdownMatchSelectWidth="false"
                filterTreeNode
                treeNodeFilterProp="catalogName"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                allow-clear
                tree-default-expand-all
                :tree-data="columnOptions"
                :fieldNames="{ key: 'id', label: 'catalogName', value: 'id' }"
              />
            </FormItem>
          </Col>

          <Col :span="9" class="wrapperCheckArea">
            <FormItem class="isTop" label="属性">
              <Checkbox v-model:checked="state.record.top">置顶</Checkbox>
              <Checkbox v-model:checked="state.record.recommended">推荐</Checkbox>
              <!--            <Checkbox v-model:checked="state.record.isMajor">大事记</Checkbox>-->
              <Checkbox v-model:checked="state.record.focus" @change="setFocus">焦点图</Checkbox>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem label="发布时间">
              <DatePicker
                style="width: 100%"
                :allowClear="false"
                v-model:value="state.record.publishTime"
                placeholder="请选择发布时间"
                format="YYYY-MM-DD "
              />
            </FormItem>
          </Col>

          <Col :span="6">
            <FormItem label="排序" name="sortOrder">
              <InputNumber v-model:value="state.record.sortOrder" :min="0" :precision="0" placeholder="请输入排序" />
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem label="关键字" name="keyword">
              <Input v-model:value="state.record.keyword" placeholder="请输入关键字" />
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem label="摘要" name="essential">
              <Input.TextArea v-model:value="state.record.essential" placeholder="请输入摘要" />
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
          <div class="btnArea">
            <Button type="primary" @click="showError" html-type="submit">{{ edit ? '保存' : '发布' }}</Button>
            <Button @click="router.back()">返回</Button>
          </div>
        </Row>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance, watch } from 'vue'
import {
  Form,
  Input,
  Upload,
  Tooltip,
  Checkbox,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  Button,
  message,
  TreeSelect
} from 'ant-design-vue'
import { upload, getUploadUrl, getInfoById, commonUpdate, commonCreate } from '@/api/common'
import { CloseCircleOutlined } from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { getUrl, resetUrl } from '@/utils'
import { getColumnTree } from '@/api/column'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const FormItem = Form.Item
const formRef = ref()
const { global_config } = window
const edit = ref(false)
const state = reactive({
  record: {
    publishTime: undefined
  },
  editorConfig: null,
  visible: false
})
const setFocus = ({ target }) => {
  if (!state.record.coverImgUrl && target.checked) {
    message.error('请先上传标题图片')
    state.record.focus = false
    return
  }
}
watch(
  () => state.record,
  () => {
    if (!state.record.coverImgUrl) {
      state.record.focus = false
    }
  },
  {
    deep: true
  }
)

const rulesRef = reactive({
  title: [
    {
      required: true,
      message: '请输入标题'
    }
  ],
  catalogId: [
    {
      required: true,
      message: '请选择栏目'
    }
  ]
})

const columnOptions = ref([])

try {
  // 查询栏目
  const {
    data: { data }
  } = await getColumnTree()
  columnOptions.value = data
} catch (e) {
  console.log(e)
}

onMounted(() => {
  state.visible = true
  state.editorConfig = {
    initialFrameWidth: null,
    lang: 'zh-cn',
    UEDITOR_HOME_URL: '/ecms-mgt/UEditor/', // 访问 UEditor 静态资源的根路径，可参考常见问题1
    //UEDITOR_HOME_URL: '/ecms-mgt/UEditor/', // 访问 UEditor 静态资源的根路径，可参考常见问题1
    serverUrl: getUploadUrl() // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
  }
  getInfo()
})

async function getInfo() {
  try {
    edit.value = false
    if (!route.query.id) {
      state.record.publishTime = dayjs(new Date())
      return
    }
    edit.value = true
    const { data } = await getInfoById('article', route.query.id, {
      createLog: false
    })
    state.record = {
      ...data.data,
      coverImgUrl: data.data.coverImgUrl ? data.data.coverImgUrl : '',
      publishTime: dayjs(data.data.publishTime),
      content: data.data.content ? getUrl(data.data.content) : null
    }
  } catch (e) {
    console.log(e)
  }
}

const uploads = (file) => {
  const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
  const isLt2M = file.size / 1024 / 1024 < 100
  if (!isImg) {
    message.error('请上传图片！')
    return false
  }
  if (!isLt2M) {
    message.error('请上传不大于100M的图片！')
    return false
  }
  state.record.fileList = [file]
  uploadImg()
  return false
}
const uploadImg = async () => {
  loading.value = true
  let data = new FormData()
  data.append('file', state.record.fileList[0])
  const res = await upload(data)
  loading.value = false
  if (res.data.code === 200 && res.data.data.status === undefined) {
    state.record.coverImgUrl = res.data.data.mappingPath
  } else {
    message.error('上传失败，请重试！')
  }
}

function showError() {
  if (!state.record.title) {
    message.error('请输入标题！')
    return
  }
  if (!state.record.catalogId) {
    message.error('请选择栏目！')
    return
  }
}

async function handleSave(val) {
  try {
    const params = {
      _moduleKey: 'article',
      ...val,
      top: state.record.top,
      recommended: state.record.recommended,
      focus: state.record.focus,
      content: resetUrl(val.content)
    }
    if (state.record.publishTime) {
      params.publishTime = dayjs(state.record.publishTime).format('YYYY-MM-DD HH:mm:ss')
    }
    if (state.record.coverImgUrl) {
      params.coverImgUrl = state.record.coverImgUrl
    }
    if (!route.query.copy) {
      if (state.record.id) {
        params.id = state.record.id
      }
    }
    let method = params.id ? commonUpdate : commonCreate
    const {
      data: { data, code },
      status
    } = await method(params)
    if (status === 200 && code === 200 && data) {
      message.success('保存成功！')
      await router.push('/info/publish')
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
.icons {
  font-size: 16px;
  position: absolute;
  right: 5px;
  color: #999;
  display: none;
  top: 8px;
}

.cols:hover .icons {
  display: block;
}

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
      &:nth-child(2) {
        margin-left: 0.2rem;
      }
    }
  }
}
</style>
