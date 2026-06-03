import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRpiApi } from '@/composables/useRpiApi'

export const useRaspberriesStore = defineStore('raspberries', () => {
  // Map<id, { status, leds, error, lastSeen }>
  const nodes = ref({})

  const onlineCount = computed(() =>
    Object.values(nodes.value).filter(n => n.status === 'online').length
  )

  function initNode(id) {
    if (!nodes.value[id]) {
      nodes.value[id] = { status: 'idle', leds: {}, error: null, lastSeen: null }
    }
  }

  async function fetchPi(pi) {
    initNode(pi.id)
    nodes.value[pi.id].status = 'checking'
    nodes.value[pi.id].error = null

    const api = useRpiApi(pi.host)
    try {
      await api.checkHealth()
      const conf = await api.fetchConf()
      const leds = {}
      for (const [ledId, info] of Object.entries(conf)) {
        if (info.type === 'LED') {
          leds[ledId] = { pin: info.pin, state: false }
        }
      }
      nodes.value[pi.id] = { status: 'online', leds, error: null, lastSeen: new Date() }
    } catch (e) {
      nodes.value[pi.id] = {
        status: 'offline',
        leds: {},
        error: e.name === 'AbortError' ? 'Timeout (>4s)' : e.message,
        lastSeen: nodes.value[pi.id].lastSeen
      }
    }
  }

  async function refreshAll(pis) {
    await Promise.all(pis.map(pi => fetchPi(pi)))
  }

  async function toggleLed(pi, ledId, action) {
    const api = useRpiApi(pi.host)
    try {
      const data = await api.ledAction(ledId, action)
      const node = nodes.value[pi.id]
      if (!node?.leds?.[ledId]) return
      if (data.state !== undefined) {
        node.leds[ledId].state = data.state === 'on' || data.state === true
      } else {
        if (action === 'on') node.leds[ledId].state = true
        else if (action === 'off') node.leds[ledId].state = false
        else node.leds[ledId].state = !node.leds[ledId].state
      }
    } catch (e) {
      nodes.value[pi.id].error = `LED ${ledId} — ${e.message}`
    }
  }

  return { nodes, onlineCount, fetchPi, refreshAll, toggleLed }
})
