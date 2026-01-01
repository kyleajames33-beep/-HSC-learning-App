/**
 * Device detection helpers to support progressive enhancement.
 */

export const isMobileDevice = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )

export const isTablet = () => {
  const ua = navigator.userAgent.toLowerCase()
  return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/.test(ua)
}

export const isTouchDevice = () =>
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0

export const isLowEndDevice = () => {
  if (!navigator.hardwareConcurrency) return false
  return navigator.hardwareConcurrency <= 2
}

export const getDeviceMemory = () => {
  if ('deviceMemory' in navigator) {
    return navigator.deviceMemory
  }
  return null
}

export const isLowMemoryDevice = () => {
  const memory = getDeviceMemory()
  if (memory === null) return false
  return memory < 4
}

export const getPerformanceProfile = () => {
  const cores = navigator.hardwareConcurrency || 4
  const memory = getDeviceMemory() || 4

  if (cores >= 4 && memory >= 4) return 'high'
  if (cores <= 2 || memory < 2) return 'low'
  return 'medium'
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isInPowerSavingMode = async () => {
  if ('getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery()
      return battery.level < 0.2 && !battery.charging
    } catch {
      return false
    }
  }
  return false
}

export const getConnectionSpeed = () => {
  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection

  if (connection && connection.effectiveType) {
    switch (connection.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'slow'
      case '3g':
        return 'medium'
      case '4g':
      default:
        return 'fast'
    }
  }

  return 'medium'
}

export const supportsDragAndDrop = () => {
  const div = document.createElement('div')
  return 'draggable' in div || ('ondragstart' in div && 'ondrop' in div)
}

export const getRecommendedParticleCount = () => {
  const profile = getPerformanceProfile()
  const reduced = prefersReducedMotion()

  if (reduced) return 0
  if (profile === 'high') return 150
  if (profile === 'medium') return 75
  if (profile === 'low') return 30
  return 50
}

export const shouldUseSimplifiedAnimations = () =>
  isLowEndDevice() ||
  isLowMemoryDevice() ||
  prefersReducedMotion() ||
  getConnectionSpeed() === 'slow'

export const getDeviceInfo = () => ({
  isMobile: isMobileDevice(),
  isTablet: isTablet(),
  isTouch: isTouchDevice(),
  isLowEnd: isLowEndDevice(),
  performanceProfile: getPerformanceProfile(),
  prefersReducedMotion: prefersReducedMotion(),
  connectionSpeed: getConnectionSpeed(),
  supportsDragDrop: supportsDragAndDrop(),
  recommendedParticles: getRecommendedParticleCount(),
  useSimplifiedAnimations: shouldUseSimplifiedAnimations(),
  cores: navigator.hardwareConcurrency || 'unknown',
  memory: getDeviceMemory() || 'unknown',
})

export const logDeviceInfo = () => {
  const info = getDeviceInfo()
  console.log('Device info', info)
  return info
}

export default {
  isMobileDevice,
  isTablet,
  isTouchDevice,
  isLowEndDevice,
  getDeviceMemory,
  isLowMemoryDevice,
  getPerformanceProfile,
  prefersReducedMotion,
  isInPowerSavingMode,
  getConnectionSpeed,
  supportsDragAndDrop,
  getRecommendedParticleCount,
  shouldUseSimplifiedAnimations,
  getDeviceInfo,
  logDeviceInfo,
}
