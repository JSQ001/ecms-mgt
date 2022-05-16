<template>
  <div class="content-collection-new">
    <div class="content-collection-new-content">
      <Form ref="formRef" :model="record" label-width="100px" :rules="rulesRef" @finish="handleNext">
        <div class="tips">
          <span class="icon">
            <span class="text">步骤一</span>
            <div class="arrow" />
          </span>
          <span class="tipsTitle">节点基本信息</span>
        </div>

        <div class="content">
          <Row>
            <Col>
              <Row>
                <Form.Item label="节点名称" class="ruleName formItem" name="nodeName">
                  <Input v-model:value="record.nodeName" placeholder="请输入节点名称" />
                </Form.Item>
                <Form.Item label="采集规则类型" class="ruleType formItem" name="ruleType">
                  <Radio.Group v-model:value="record.ruleType">
                    <Radio v-for="item in ruleTypeList" :key="item.id" :value="item.id" :disabled="item.id === 0">
                      {{ item.name }}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Row>
              <Row>
                <Form.Item class="columnId formItem" label="入库栏目" name="catalogId">
                  <TreeSelect
                    placeholder="请选择栏目"
                    v-model:value="record.catalogId"
                    show-search
                    filterTreeNode
                    treeNodeFilterProp="catalogName"
                    style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    allow-clear
                    :dropdownMatchSelectWidth="false"
                    tree-default-expand-all
                    :tree-data="columnOptions"
                    :fieldNames="{
                      key: 'id',
                      label: 'catalogName',
                      value: 'id'
                    }"
                  />
                </Form.Item>
                <Form.Item class="autoCollectTime formItem" label="定时采集" name="autoCollectTime">
                  <TimePicker
                    :disabled="!record.isAuto"
                    :locale="locale"
                    v-model:value="record.autoCollectTime"
                    placeholder="请选择定时采集时间"
                  />
                </Form.Item>
                <Form.Item name="isAuto">
                  <Checkbox v-model:checked="record.isAuto" class="autoCollectTime-check">自动</Checkbox>
                </Form.Item>
              </Row>
              <Row>
                <Form.Item label="采集地址" class="collectUrl formItem" name="collectUrl">
                  <Input v-model:value="record.collectUrl" placeholder="请输入采集地址" />
                </Form.Item>
              </Row>
            </Col>
            <Col>
              <Form.Item class="remarks" label="备注" name="remarks">
                <Input.TextArea :rows="5" v-model:value="record.remarks" placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <Divider />

        <div class="tips step2">
          <span class="icon">
            <span class="text">步骤二</span>
            <div class="arrow" />
          </span>
          <span class="tipsTitle">采集页列表规则</span>
        </div>
        <div class="content2">
          <Form.Item class="tipsItem" label="列表页链接规则" name="linksRule">
            <Input v-model:value="record.linksRule" placeholder="请输入XPath规则" />
          </Form.Item>
        </div>
        <Divider />
        <div class="tips step3">
          <span class="icon">
            <span class="text">步骤三</span>
            <div class="arrow" />
          </span>
          <span class="tipsTitle">采集內容页规则</span>
        </div>
        <div class="content3">
          <Row>
            <Form.Item class="tipsItem" label="标题规则" name="titleRule">
              <Input v-model:value="record.titleRule" placeholder="请输入标题XPath规则" />
            </Form.Item>
            <Form.Item class="tipsItem" label="副标题规则" name="sourceRule">
              <Input v-model:value="record.subTitleRule" placeholder="请输入副标题XPath规则" />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item class="tipsItem" label="正文内容规则" name="contentRule">
              <Input.TextArea autoSize v-model:value="record.contentRule" placeholder="请输入正文XPath规则" />
            </Form.Item>
            <Form.Item class="tipsItem" label="发布时间规则" name="pubTimeRule">
              <Input v-model:value="record.pubTimeRule" placeholder="请输入发布时间XPath规则" />
            </Form.Item>
          </Row>
          <Row>
            <Form.Item class="tipsItem" label="作者规则" name="authorRule">
              <Input v-model:value="record.authorRule" placeholder="请输入作者XPath规则" />
            </Form.Item>
            <Form.Item class="tipsItem" label="摘要规则" name="essentialRule">
              <Input.TextArea autoSize v-model:value="record.essentialRule" placeholder="请输入摘要XPath规则" />
            </Form.Item>
          </Row>
        </div>
        <div class="btnGroup">
          <Button type="default" class="saveBtn" html-type="submit">保存采集节点</Button>
          <Button type="default" html-type="button" @click="router.push('/collection/rule')">返回</Button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script setup>
import {
  Row,
  Col,
  Radio,
  Form,
  Button,
  Divider,
  Checkbox,
  message,
  Input,
  TreeSelect,
  TimePicker
} from 'ant-design-vue'
import { reactive, ref, toRaw, onMounted, watchEffect } from 'vue'
import { commonCreate, commonUpdate, getInfoById } from '@/api/common'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import dayjs from 'dayjs'
import { useRoute, useRouter } from 'vue-router'
import { getDate } from '@/utils'
import { getColumnTree } from '@/api/column'

const useForm = Form.useForm
const router = useRouter()
const route = useRoute()

const ruleTypeList = ref([
  {
    id: 1,
    name: 'xPath'
  },
  {
    id: 0,
    name: '正则表达式'
  }
])
const columnOptions = ref([])
const checked = ref(true)

const record = ref({
  ruleType: 1,
  isAuto: true
})

onMounted(async () => {
  //根据id查询规则信息
  try {
    if (!route.query.id) return
    const {
      data: { data }
    } = await getInfoById('collect-node', route.query.id)
    // 复制操作，删除id、节点名称、入库栏目、采集地址
    if (route.query.copy === 'true') {
      delete data.id
      delete data.name
      delete data.catalogId
      delete data.collectUrl
    }
    record.value = {
      ...data,
      autoCollectTime: data.autoCollectTime ? new dayjs(data.autoCollectTime) : null
    }
  } catch (e) {
    console.log(e)
  }
})

const rulesRef = reactive({
  columnId: [
    {
      required: true,
      message: ''
    }
  ],
  nodeName: [
    {
      required: true,
      message: ''
    }
  ],
  status: [
    {
      required: true,
      message: ''
    }
  ],
  collectUrl: [
    {
      required: true,
      message: ''
    }
  ],
  infoPage: [
    {
      required: true,
      message: ''
    }
  ],
  titleRule: [
    {
      required: true,
      message: '请输入'
    }
  ],
  contentRule: [
    {
      required: true,
      message: '请输入'
    }
  ],
  linksRule: [
    {
      required: true,
      message: ''
    }
  ],
  catalogId: [
    {
      required: true,
      message: ''
    }
  ]
})

watchEffect(() => {
  if (record.value.isAuto) {
    rulesRef.autoCollectTime = [
      {
        required: true,
        message: ''
      }
    ]
  } else {
    delete rulesRef.autoCollectTime
    record.value.autoCollectTime = null
  }
})

// 调用接口获取栏目类型、父节点
try {
  const res = await getColumnTree()
  if (res && res.status === 200) {
    columnOptions.value = res.data.data
  }
} catch (e) {
  console.log(e)
}

async function handleNext(values) {
  const params = {
    ...toRaw(record.value),
    _moduleKey: 'collect-node'
  }
  if (values.autoCollectTime) {
    params.autoCollectTime = getDate(values.autoCollectTime)
  }
  let method = !!params.id ? commonUpdate : commonCreate
  try {
    const {
      status,
      data: { code }
    } = await method(params)
    let success = status === 200 && code === 200
    message[success ? 'success' : 'error'](`保存${success ? '成功' : '失败'}！`)
    return router.push('/collection/rule')
  } catch (e) {
    console.log(e)
  }
}
</script>
<!--suppress CssInvalidPseudoSelector -->
<style scoped lang="scss">
@import '~@/styles/variables.scss';

.content-collection-new {
  .wrapper-breadcrumb {
    .breadTips {
      font-size: 0.14rem;
      margin-right: 0.1rem;
    }

    .breadcrumb {
      display: inline-flex;
      margin-bottom: 0.15rem;

      .breadTips {
        margin-right: 0.1rem;
      }
    }
  }

  .ant-breadcrumb {
    & > span {
      &:nth-child(3) {
        color: $commonBg;
      }
    }
  }

  .content-collection-new-content {
    margin: 0 auto 0;
    background: white;
    padding: 0.4rem 0.2rem 0.2rem 0.2rem;
    position: relative;

    .tabArea {
      .tabItem {
        display: inline-block;
        padding: 0.06rem 0.2rem;
        margin: 0 0.06rem;
        background: #f9e8e5;
        color: #c22400;
        opacity: 0.5;
        font-size: 0.2rem;
        transform: skew(-30deg);

        .title {
          transform: skewX(30deg);
        }
      }

      .active {
        background: #c22400;
        color: white;
        opacity: 1;
      }
    }

    :deep(.ant-form) {
      width: 80%;
      margin: 0 auto;

      .ant-form-item-explain-error {
        display: none;
      }

      .tips {
        .icon {
          position: relative;
          background: #a51b1b;
          color: white;
          padding: 4px 0.04rem 5px 0.15rem;
          font-size: 0.18rem;
          z-index: 1;

          .arrow {
            position: absolute;
            width: 0.255rem;
            height: 0.26rem;
            content: '';
            background: #a51b1b;
            transform: rotate(45deg) skew(-6deg, -6deg);
            right: -0.12rem;
            top: 3px;
            z-index: -1;
          }
        }

        .tipsTitle {
          margin-left: 0.3rem;
          font-size: 0.18rem;
          font-weight: 700;
        }
      }

      .step2 {
        .icon {
          background: rgb(37, 173, 243);

          .arrow {
            background: rgb(37, 173, 243);
          }
        }
      }

      .step3 {
        .icon {
          background: rgb(255, 185, 23);

          .arrow {
            background: rgb(255, 185, 23);
          }
        }
      }

      .content {
        padding: 0.25rem 0 0 0.62rem;
        width: 10.2rem;

        .formItem {
          display: inline-flex;
        }

        .ruleName,
        .columnId {
          width: 3rem;
        }

        .ruleType,
        .autoCollectTime {
          margin-left: 0.6rem;
        }

        .autoCollectTime-check {
          margin-left: 0.1rem;
        }

        .collectUrl {
          width: 6.93rem;
        }

        .remarks {
          width: 2.56rem;

          .ant-form-item-label {
            width: 0.6rem;
          }
        }
      }

      .content2 {
        padding: 0.25rem 0 0 1rem;
        width: 10.2rem;
      }

      .content3 {
        width: 10.2rem;
        padding: 0.25rem 0 0 1rem;

        .tipsItem {
          width: 50%;
        }
      }

      .ant-divider {
        width: 10.02rem;
        margin: 0.2rem;
      }

      .ant-form-item {
        margin-bottom: 0.12rem;
      }

      .ant-form-item-label {
        width: 105px;
        margin-right: 10px;
      }
    }

    .btnGroup {
      margin-top: 0.3rem;
      text-align: center;
    }

    .saveBtn {
      background: #c22400;
      border-radius: 0;
      color: white;
      margin-right: 10px;
      margin-left: 1.6rem;
    }
  }
}
</style>
