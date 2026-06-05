<script setup>
import { ref, watch } from 'vue'
import { showToast } from 'vant'
import { useAmap } from '@/composables/useAmap.js'

// ========== 高德地图 ==========
const mapContainer = ref(null)
const { loaded: mapReady, error: mapError, getMap } = useAmap(mapContainer, {
  zoom: 12,
  center: [116.397428, 39.90923],
})

// 地图就绪后添加标记点
watch(mapReady, (ready) => {
  if (ready) {
    const map = getMap()
    const AMap = window.AMap
    const marker = new AMap.Marker({
      position: [116.397428, 39.90923],
      title: '北京',
    })
    map.add(marker)
  }
})

// ========== Vant 无限加载列表 ==========
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

// 生成模拟数据
function generateData(start, count) {
  const data = []
  for (let i = start; i < start + count; i++) {
    data.push({
      id: i,
      title: `位置 ${i + 1}`,
      desc: `坐标: ${(116.3 + Math.random() * 0.3).toFixed(4)}, ${(39.8 + Math.random() * 0.3).toFixed(4)}`,
      tag: i % 3 === 0 ? '热门' : i % 3 === 1 ? '推荐' : '新晋',
    })
  }
  return data
}

function onLoad() {
  loading.value = true
  setTimeout(() => {
    if (refreshing.value) {
      list.value = []
      refreshing.value = false
    }
    const newData = generateData(list.value.length, 10)
    list.value.push(...newData)
    loading.value = false
    if (list.value.length >= 50) {
      finished.value = true
    }
  }, 1000)
}

function onRefresh() {
  finished.value = false
  refreshing.value = true
  onLoad()
}

function onCellClick(item) {
  showToast(`选中: ${item.title}`)
}
</script>

<template>
  <div class="about-page">
    <!-- 上半部分: 高德地图 300px -->
    <div class="map-wrapper">
      <div v-if="mapError" class="map-placeholder">
        <p>🗺️ {{ mapError }}</p>
      </div>
      <div v-else-if="!mapReady" class="map-placeholder">
        <p>⏳ 地图加载中...</p>
      </div>
      <div ref="mapContainer" class="map-container" :class="{ hidden: !mapReady }"></div>
    </div>

    <!-- 下半部分: Vant 无限加载列表 -->
    <div class="list-wrapper">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="— 没有更多了 —"
          @load="onLoad"
        >
          <van-cell
            v-for="item in list"
            :key="item.id"
            :title="item.title"
            :label="item.desc"
            is-link
            @click="onCellClick(item)"
          >
            <template #value>
              <van-tag :type="item.tag === '热门' ? 'danger' : item.tag === '推荐' ? 'primary' : 'warning'" size="small">
                {{ item.tag }}
              </van-tag>
            </template>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #f7f8fa;
}

.map-wrapper {
  position: relative;
  flex-shrink: 0;
  height: 300px;
}

.map-container {
  width: 100%;
  height: 100%;
}
.map-container.hidden {
  display: none;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #e8ecf1;
  color: #666;
  font-size: 28px;
}
.map-placeholder span {
  margin-top: 8px;
  font-size: 24px;
  color: #999;
}

.list-wrapper {
  flex: 1;
  overflow-y: auto;
}
</style>
