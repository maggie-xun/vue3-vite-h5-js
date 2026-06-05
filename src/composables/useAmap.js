import { ref, onMounted, onUnmounted } from 'vue'

const AMAP_KEY = 'c3cc52588795707e75385e9ed40d6517'

let AMapClass = null
let loadPromise = null

// 加载高德地图 JSAPI 脚本（全局单例）
function loadScript() {
  if (AMapClass) return Promise.resolve(AMapClass)
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://webapi.amap.com/maps?v=1.4.15&key=${AMAP_KEY}`
    script.onerror = () => {
      loadPromise = null
      reject(new Error('高德地图脚本加载失败'))
    }
    script.onload = () => {
      let count = 0
      const check = setInterval(() => {
        count++
        if (window.AMap) {
          clearInterval(check)
          AMapClass = window.AMap
          resolve(AMapClass)
        } else if (count > 40) {
          clearInterval(check)
          loadPromise = null
          reject(new Error('AMap 初始化超时（20秒）'))
        }
      }, 500)
    }
    document.head.appendChild(script)
  })

  return loadPromise
}

// Composable: useAmap
export function useAmap(containerRef, mapOptions = {}) {
  const loaded = ref(false)
  const error = ref('')
  let mapInstance = null

  onMounted(async () => {
    try {
      await loadScript()

      const el = containerRef.value
      if (!el) {
        error.value = '地图容器不存在'
        return
      }
      if (el.offsetHeight === 0) {
        el.style.height = '300px'
      }

      mapInstance = new AMapClass.Map(el, {
        zoom: 12,
        center: [116.397428, 39.90923],
        ...mapOptions,
      })

      // 强制 resize 确保图层渲染
      setTimeout(() => mapInstance?.resize(), 200)

      loaded.value = true
    } catch (e) {
      error.value = e.message || '地图加载失败'
      console.error(e)
    }
  })

  onUnmounted(() => {
    mapInstance?.destroy()
    mapInstance = null
  })

  // 获取地图实例（用于添加标记等操作）
  function getMap() {
    return mapInstance
  }

  return { loaded, error, getMap }
}
