<template>
  <div class="select-icon">
    <Input
      @click="visible = true"
      @blur="handleInputBlur"
      :value="props.modelValue"
      autocomplete="off"
      :placeholder="props.placeholder"
    />
    <div @mouseover="inContent = true" @mouseleave="inContent = false" ref="content" class="wrapperContent">
      <div v-if="visible" class="content">
        <i v-for="item in list" :key="item" @click="handleSelect(item)" :class="`icon iconfont icon-${item}`" />
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { Input } from 'ant-design-vue'
import { ref, watch } from 'vue'
import { animateCSS } from '@/utils'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  placeholder: {
    type: String,
    default: '选择图标'
  },
  modelValue: {
    type: String
    //required: true
  }
})

const list = [
  'shouye',
  'lanmuguanli',
  'xinxiguanli',
  'xinxifabu',
  'tonggaoguanli',
  'xinxishenhe',
  'xinxitongji',
  'xinxicaiji',
  'xinxifabu',
  'tonggaoguanli',
  'xinxishenhe',
  'dashijiguanli',
  'tonggaoguanli',
  'xitongshezhi',
  'yonghuguanli',
  'jiaoseguanli',
  'quanxianguanli',
  'xinxitongji'
]

const content = ref()

const visible = ref(false)
const inContent = ref(false)

watch(visible, (val) => {
  if (val) {
    animateCSS(content.value, 'flipInX')
  }
})

function handleSelect(val: any) {
  visible.value = false
  emit('update:modelValue', val)
}

function handleInputBlur() {
  if (inContent.value) {
    return
  }
  visible.value = false
}
</script>

<style lang="scss" scoped>
.select-icon {
  .wrapperContent {
    width: 100%;
    .content {
      background: white;
      padding: 0.1rem;
      margin-top: 0.04rem;
      box-shadow: 0 2px 12px #0000004d !important;

      display: flex;
      flex-wrap: wrap;
      overflow-y: scroll;

      i {
        cursor: pointer;
        font-size: 0.2rem;
        padding: 0.01rem 0.06rem;
        display: flex;
        justify-content: center;
        margin: 0 0.04rem;
        width: calc((100% - 0.88rem) / 12);

        &:nth-child(12n) {
          margin-right: 0;
        }
        &:nth-child(12n + 1) {
          margin-left: 0;
        }

        &:hover {
          background: #a51b1b;
          color: white;
        }
      }
    }
  }
}
</style>
