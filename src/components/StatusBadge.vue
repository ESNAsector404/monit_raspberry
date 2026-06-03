<template>
  <span class="badge" :class="status">
    <span class="badge__dot" />
    {{ labels[status] || status }}
  </span>
</template>

<script setup>
defineProps({ status: String })
const labels = {
  online: 'en ligne',
  offline: 'hors ligne',
  checking: '…',
  idle: '—'
}
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  padding: 3px 9px;
  border-radius: 99px;
  font-family: var(--font-mono);
  border: 1px solid transparent;
}
.badge__dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: currentColor;
}
.badge.online  { background: rgba(74,222,128,0.12); color: #4ade80; border-color: rgba(74,222,128,0.25); }
.badge.offline { background: rgba(248,113,113,0.12); color: #f87171; border-color: rgba(248,113,113,0.25); }
.badge.checking{ background: rgba(251,191,36,0.12);  color: #fbbf24; border-color: rgba(251,191,36,0.25); }
.badge.idle    { background: rgba(100,100,100,0.1); color: #888; border-color: rgba(100,100,100,0.2); }
</style>
