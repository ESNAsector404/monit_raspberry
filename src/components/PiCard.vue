<template>
  <div class="pi-card" :class="[node.status]">
    <div class="pi-card__header">
      <div class="pi-card__title">
        <span class="pi-card__name">{{ pi.name }}</span>
        <span class="pi-card__host">{{ pi.host }}</span>
      </div>
      <StatusBadge :status="node.status" />
    </div>

    <div class="pi-card__body">
      <div class="pi-card__section-label">LEDs</div>

      <div v-if="node.status === 'checking'" class="pi-card__skeletons">
        <div v-for="i in 2" :key="i" class="skeleton" />
      </div>

      <div v-else-if="node.status === 'offline'" class="pi-card__empty">
        <span>⚠ inaccessible</span>
        <span v-if="node.lastSeen" class="pi-card__lastseen">
          vu le {{ formatDate(node.lastSeen) }}
        </span>
      </div>

      <div v-else-if="Object.keys(node.leds).length === 0" class="pi-card__empty">
        aucune LED configurée
      </div>

      <div v-else class="pi-card__leds">
        <LedRow
          v-for="(led, ledId) in node.leds"
          :key="ledId"
          :led-id="ledId"
          :led="led"
          :disabled="node.status !== 'online'"
          @action="(action) => $emit('ledAction', ledId, action)"
        />
      </div>

      <div v-if="node.error" class="pi-card__error">{{ node.error }}</div>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue'
import LedRow from './LedRow.vue'

defineProps({
  pi: Object,
  node: Object
})

defineEmits(['ledAction'])

function formatDate(d) {
  return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.pi-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s, opacity 0.2s;
}
.pi-card:hover { border-color: var(--c-border-hover); }
.pi-card.offline { opacity: 0.55; }

.pi-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 16px;
  border-bottom: 1px solid var(--c-border);
}
.pi-card__title { display: flex; flex-direction: column; gap: 2px; }
.pi-card__name { font-size: 13px; font-weight: 600; color: var(--c-text); }
.pi-card__host { font-size: 10px; color: var(--c-text-muted); font-family: var(--font-mono); }

.pi-card__body { padding: 13px 16px; }
.pi-card__section-label {
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-text-faint);
  margin-bottom: 8px;
}
.pi-card__leds { display: flex; flex-direction: column; gap: 5px; }
.pi-card__empty {
  font-size: 11px;
  color: var(--c-text-muted);
  text-align: center;
  padding: 14px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.pi-card__lastseen { font-size: 10px; color: var(--c-text-faint); }
.pi-card__error { font-size: 10px; color: var(--c-red); margin-top: 8px; }
.pi-card__skeletons { display: flex; flex-direction: column; gap: 5px; }

.skeleton {
  height: 34px;
  background: var(--c-surface-raised);
  border-radius: 7px;
  animation: pulse 1.3s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }
</style>
