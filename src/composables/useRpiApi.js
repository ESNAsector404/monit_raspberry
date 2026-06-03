// Composable pour les appels API Raspberry Pi
export function useRpiApi(host) {
  const TIMEOUT_MS = 4000

  async function fetchWithTimeout(url, options = {}) {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(url, { ...options, signal: ctrl.signal })
      clearTimeout(timer)
      return res
    } catch (e) {
      clearTimeout(timer)
      throw e
    }
  }

  async function checkHealth() {
    const res = await fetchWithTimeout(`${host}/health`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return true
  }

  async function fetchConf() {
    const res = await fetchWithTimeout(`${host}/conf`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  }

  async function ledAction(ledId, action) {
    const res = await fetchWithTimeout(`${host}/led/${ledId}/${action}`, {
      method: 'GET'
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json().catch(() => ({}))
  }

  return { checkHealth, fetchConf, ledAction }
}
