<template>
  <svg :width="width" :height="height" style="background: #f2f2f2">
    <!-- 数据连接成线 -->
    <!--    <polyline :points="points" fill="green"  />-->
    <g>
      <path
        v-for="(item, index) in points"
        :key="index"
        :d="`
                M${item.x},${item.y}
                L${item.x + 52},${item.y === 100 ? 150 : 100}
                L${item.x + 52},${item.y}
                Z`"
      ></path>
    </g>
    <g
      v-for="(item, index) in pointData"
      :key="item.key"
      style="cursor: pointer"
      @mouseover="suspend = true"
      @mouseout="suspend = false"
      @click="handleDetail(item)"
    >
      <circle r="5" :cx="5 + 52 * index" :cy="index % 2 === 0 ? 100 : 150" fill="#000" />
      <text :x="5 + 52 * index" fill="#333" :y="index % 2 === 0 ? 100 : 150">{{ item.title }}</text>
    </g>
  </svg>
</template>

<script setup lang="tsx">
import { ref, computed, onMounted } from 'vue'
const width = 600
const height = 200
const suspend = ref(false)
const pointData = ref([
  { x: 30, y: 52, r: 10, key: 1, title: '新闻1' },
  { x: 60, y: 104, r: 10, key: 2, title: '新闻2' },
  { x: 52 * 2, y: 52, r: 10, key: 3, title: '新闻3' },
  { x: 52 * 3, y: height / 3, r: 10, key: 4, title: '新闻4' },
  { x: 52 * 4, y: height / 6, r: 10, key: 5, title: '新闻5' },
  { x: 52 * 5, y: (height * 2) / 5, r: 10, key: 6, title: '新闻6' },
  { x: 52 * 6, y: (height * 4) / 5, r: 10, key: 7, title: '新闻7' },
  { x: 52 * 6.5, y: (height * 3) / 8, r: 5, key: 8, title: '新闻8' },
  { x: 52 * 7.2, y: (height * 2) / 5, r: 10, key: 9, title: '新闻9' },
  { x: 52 * 8.2, y: (height * 4) / 7, r: 5, key: 10, title: '新闻10' },
  { x: 52 * 9.8, y: height / 4, r: 5, key: 11, title: '新闻11' },
  { x: 52 * 11.3, y: height / 5, r: 5, key: 12, title: '新闻12' },
  { x: 52 * 12, y: height / 4, r: 5, key: 13, title: '新闻13' }
])
function animation() {
  function step() {
    if (!suspend.value) {
      pointData.value.forEach((item) => {
        item.x -= 1
      })
      if (pointData.value[0].x < 0) {
        if (pointData.value[0].key === pointData.value[pointData.value.length - 1].key) {
          if (pointData.value[1].x < 0) {
            pointData.value.shift()
          }
        } else {
          let temp = { ...pointData.value[0] }
          temp.x = width * 1.2
          pointData.value.push(temp)
        }
      }
    }
    window.requestAnimationFrame(step)
  }
  window.requestAnimationFrame(step)
}

onMounted(() => {
  animation()
})
const points = computed(() => {
  let str: any = []
  pointData.value.forEach((item, index) => {
    let nowHeight = 150
    if (index % 2 === 0) {
      nowHeight = 100
    }
    str.push({
      x: 5 + 52 * index,
      y: nowHeight
    })
  })
  return str
})
function handleDetail(item: any) {}
</script>

<style scoped></style>
