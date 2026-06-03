// 高德地图 Key — https://console.amap.com/dev/key/app
const AMAP_KEY = 'c3cc52588795707e75385e9ed40d6517'

let AMapInstance = null
let loadPromise = null

export function loadAMap() {
  if (AMapInstance) return Promise.resolve(AMapInstance)
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    // 使用 1.4.15 版本，不需要安全密钥
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
          AMapInstance = window.AMap
          console.log('✅ 高德地图加载成功')
          resolve(AMapInstance)
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
