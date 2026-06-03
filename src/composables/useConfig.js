import { ref } from 'vue'
import jsyaml from 'js-yaml'

const STORAGE_KEY = 'rpi_config_yaml'

const DEFAULT_YAML = `# Configuration des Raspberry Pi
raspberries:
  - id: pi-salon
    name: pi-salon
    host: http://192.168.1.10:5000

  - id: pi-bureau
    name: pi-bureau
    host: http://192.168.1.11:5000

  - id: pi-garage
    name: pi-garage
    host: http://192.168.1.12:5000
`

export function useConfig() {
  const yamlText = ref(localStorage.getItem(STORAGE_KEY) || '')
  const config = ref({ raspberries: [] })
  const parseError = ref(null)

  async function loadFromFile() {
    if (yamlText.value) {
      parseYaml(yamlText.value)
      return
    }
    try {
      const res = await fetch('/config.yaml')
      if (res.ok) {
        yamlText.value = await res.text()
      } else {
        yamlText.value = DEFAULT_YAML
      }
    } catch {
      yamlText.value = DEFAULT_YAML
    }
    parseYaml(yamlText.value)
  }

  function parseYaml(text) {
    try {
      const parsed = jsyaml.load(text)
      if (!parsed?.raspberries || !Array.isArray(parsed.raspberries)) {
        throw new Error("Clé 'raspberries' manquante ou invalide")
      }
      config.value = parsed
      parseError.value = null
      return true
    } catch (e) {
      parseError.value = e.message
      return false
    }
  }

  function applyYaml(text) {
    if (parseYaml(text)) {
      yamlText.value = text
      localStorage.setItem(STORAGE_KEY, text)
      return true
    }
    return false
  }

  function resetToDefault() {
    localStorage.removeItem(STORAGE_KEY)
    yamlText.value = DEFAULT_YAML
    parseYaml(DEFAULT_YAML)
  }

  return { yamlText, config, parseError, loadFromFile, applyYaml, resetToDefault }
}
