<template>
  <div class="config-panel">
    <button class="config-panel__toggle" @click="open = !open">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      config.yaml
      <span class="config-panel__count">{{ piCount }} pi</span>
      <svg
        class="config-panel__chevron"
        :class="{ rotated: open }"
        width="12" height="12"
        viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <transition name="slide">
      <div v-if="open" class="config-panel__body">
        <textarea
          v-model="localYaml"
          class="config-panel__editor"
          spellcheck="false"
          rows="12"
        />
        <div v-if="error" class="config-panel__error">{{ error }}</div>
        <div class="config-panel__footer">
          <button class="btn btn--ghost" @click="handleReset">réinitialiser</button>
          <button class="btn btn--primary" @click="handleApply">appliquer ↗</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  yamlText: String,
  piCount: Number,
  parseError: String
})

const emit = defineEmits(['apply', 'reset'])

const open = ref(false)
const localYaml = ref(props.yamlText)
const error = ref(null)

watch(() => props.yamlText, v => { localYaml.value = v })

function handleApply() {
  error.value = null
  const ok = emit('apply', localYaml.value)
  // parent retourne true/false via callback
}

function handleReset() {
  emit('reset')
  localYaml.value = props.yamlText
}
</script>

<style scoped>
.config-panel {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}
.config-panel__toggle {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  color: var(--c-text-muted);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  letter-spacing: 0.05em;
}
.config-panel__toggle:hover { background: var(--c-surface-raised); color: var(--c-text); }
.config-panel__count {
  margin-left: 4px;
  background: var(--c-surface-raised);
  border: 1px solid var(--c-border);
  color: var(--c-text-faint);
  font-size: 9px;
  padding: 2px 7px;
  border-radius: 99px;
}
.config-panel__chevron { margin-left: auto; transition: transform 0.2s; }
.config-panel__chevron.rotated { transform: rotate(180deg); }

.config-panel__body { border-top: 1px solid var(--c-border); }
.config-panel__editor {
  width: 100%;
  background: var(--c-bg);
  border: none;
  color: #9cdcfe;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.65;
  padding: 14px 16px;
  resize: vertical;
  outline: none;
  display: block;
}
.config-panel__error {
  padding: 8px 16px;
  font-size: 11px;
  color: var(--c-red);
  border-top: 1px solid var(--c-border);
  font-family: var(--font-mono);
}
.config-panel__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid var(--c-border);
}

.btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid var(--c-border-hover);
  background: transparent;
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.13s;
}
.btn--ghost { color: var(--c-text-muted); }
.btn--ghost:hover { color: var(--c-text); background: var(--c-surface-raised); }
.btn--primary { color: #60a5fa; border-color: rgba(96,165,250,0.4); }
.btn--primary:hover { background: rgba(96,165,250,0.1); }

.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
