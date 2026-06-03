<template>
  <div class="led-row">
    <div class="led-row__info">
      <div class="led-row__indicator" :class="{ on: led.state }" />
      <span class="led-row__id">{{ ledId }}</span>
      <span class="led-row__pin">pin {{ led.pin }}</span>
    </div>
    <div class="led-row__actions">
      <button
        class="btn-led"
        :class="{ active: !led.state }"
        :disabled="disabled"
        @click="$emit('action', 'off')"
      >off</button>
      <button
        class="btn-led"
        :class="{ active: led.state }"
        :disabled="disabled"
        @click="$emit('action', 'on')"
      >on</button>
      <button
        class="btn-led btn-toggle"
        :disabled="disabled"
        @click="$emit('action', 'toggle')"
        title="Toggle"
      >⇄</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ledId: String,
  led: Object,
  disabled: Boolean
})
defineEmits(['action'])
</script>

<style scoped>
.led-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: var(--c-surface-raised);
  border: 1px solid var(--c-border);
  border-radius: 7px;
}
.led-row__info { display: flex; align-items: center; gap: 8px; }
.led-row__indicator {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--c-surface);
  border: 1px solid var(--c-text-faint);
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
}
.led-row__indicator.on {
  background: var(--c-amber);
  border-color: var(--c-amber);
  box-shadow: 0 0 6px rgba(251,191,36,0.5);
}
.led-row__id { font-size: 12px; color: var(--c-text); font-family: var(--font-mono); }
.led-row__pin { font-size: 10px; color: var(--c-text-faint); font-family: var(--font-mono); }

.led-row__actions { display: flex; gap: 4px; }
.btn-led {
  padding: 3px 9px;
  font-size: 10px;
  border-radius: 5px;
  border: 1px solid var(--c-border-hover);
  background: transparent;
  color: var(--c-text-muted);
  cursor: pointer;
  font-family: var(--font-mono);
  transition: all 0.12s;
}
.btn-led:hover:not(:disabled) {
  color: var(--c-text);
  background: var(--c-surface);
  border-color: var(--c-text-faint);
}
.btn-led.active {
  border-color: rgba(251,191,36,0.4);
  color: var(--c-amber);
  background: rgba(251,191,36,0.1);
}
.btn-led:disabled { opacity: 0.3; cursor: not-allowed; }
.btn-toggle { letter-spacing: -1px; }
</style>
