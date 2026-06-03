<template>
  <div class="app">
    <header class="app__header">
      <div class="app__logo">
        <div class="app__logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none"/>
            <circle cx="15" cy="9" r="1.5" fill="currentColor" stroke="none"/>
            <line x1="9" y1="15" x2="15" y2="15" stroke-linecap="round"/>
          </svg>
        </div>
        <div>
          <div class="app__logo-text">raspberry monitor</div>
          <div class="app__logo-sub">dashboard</div>
        </div>
      </div>
      <div class="app__header-right">
        <span class="app__status-bar">
          {{ store.onlineCount }}/{{ config.raspberries?.length || 0 }} en ligne
        </span>
        <button class="app__refresh-btn" :class="{ spinning: refreshing }" @click="handleRefreshAll">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          actualiser
        </button>
      </div>
    </header>

    <main class="app__main">
      <ConfigPanel
        :yaml-text="yamlText"
        :pi-count="config.raspberries?.length || 0"
        :parse-error="parseError"
        @apply="handleApplyConfig"
        @reset="handleResetConfig"
      />

      <div v-if="!config.raspberries?.length" class="app__empty">
        Aucun Raspberry Pi configuré. Modifiez le fichier config.yaml.
      </div>

      <div v-else class="app__grid">
        <PiCard
          v-for="pi in config.raspberries"
          :key="pi.id"
          :pi="pi"
          :node="store.nodes[pi.id] || { status: 'idle', leds: {}, error: null }"
          @led-action="(ledId, action) => store.toggleLed(pi, ledId, action)"
        />
      </div>
    </main>

    <footer class="app__footer">
      <span>raspberry monitor — vue 3 + pinia</span>
      <span>{{ lastUpdate }}</span>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRaspberriesStore } from '@/stores/raspberries'
import { useConfig } from '@/composables/useConfig'
import PiCard from '@/components/PiCard.vue'
import ConfigPanel from '@/components/ConfigPanel.vue'

const store = useRaspberriesStore()
const { yamlText, config, parseError, loadFromFile, applyYaml, resetToDefault } = useConfig()

const refreshing = ref(false)
const lastUpdate = ref('—')

onMounted(async () => {
  await loadFromFile()
  await handleRefreshAll()
})

async function handleRefreshAll() {
  if (!config.value.raspberries?.length) return
  refreshing.value = true
  await store.refreshAll(config.value.raspberries)
  lastUpdate.value = 'mis à jour ' + new Date().toLocaleTimeString('fr-FR')
  refreshing.value = false
}

function handleApplyConfig(text) {
  const ok = applyYaml(text)
  if (ok) handleRefreshAll()
  return ok
}

function handleResetConfig() {
  resetToDefault()
  handleRefreshAll()
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 24px;
  border-bottom: 1px solid var(--c-border);
  position: sticky;
  top: 0;
  background: var(--c-bg);
  z-index: 10;
}
.app__logo { display: flex; align-items: center; gap: 11px; }
.app__logo-icon {
  width: 30px; height: 30px;
  background: rgba(74,222,128,0.1);
  border: 1px solid rgba(74,222,128,0.3);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
}
.app__logo-icon svg { width: 15px; height: 15px; color: #4ade80; }
.app__logo-text { font-size: 14px; font-weight: 600; color: var(--c-text); }
.app__logo-sub { font-size: 9px; color: var(--c-text-faint); letter-spacing: 0.1em; text-transform: uppercase; }

.app__header-right { display: flex; align-items: center; gap: 12px; }
.app__status-bar { font-size: 11px; color: var(--c-text-faint); font-family: var(--font-mono); }
.app__refresh-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  background: transparent;
  border: 1px solid var(--c-border-hover);
  border-radius: 6px;
  color: var(--c-text-muted);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}
.app__refresh-btn:hover { border-color: #60a5fa; color: #60a5fa; }
.app__refresh-btn.spinning svg { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.app__main { flex: 1; padding: 22px 24px; max-width: 1200px; margin: 0 auto; width: 100%; }
.app__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
}
.app__empty {
  text-align: center;
  color: var(--c-text-faint);
  font-size: 13px;
  padding: 40px;
}

.app__footer {
  padding: 14px 24px;
  border-top: 1px solid var(--c-border);
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--c-text-faint);
  font-family: var(--font-mono);
}
</style>
