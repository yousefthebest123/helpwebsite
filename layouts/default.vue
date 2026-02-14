<template>
  <div class="layout-default">
    <!-- Animated Background -->
    <div class="bg-effects" aria-hidden="true">
      <div class="aurora-gradient aurora-1"></div>
      <div class="aurora-gradient aurora-2"></div>
      <div class="aurora-gradient aurora-3"></div>
      <div class="grid-overlay"></div>
      <div class="noise-overlay"></div>
    </div>

    <NavBar />

    <main class="main-content">
      <NuxtPage />
    </main>

    <FooterSection />
    <LiveChatWidget />
    <ToastNotifications />
  </div>
</template>

<script setup>
import { useSettings } from '~/composables/useSettings'

// Apply saved theme on layout mount
const { applyTheme } = useSettings()
onMounted(() => {
  applyTheme()
})
</script>

<style scoped>
.layout-default {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

/* Background Effects */
.bg-effects {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.aurora-gradient {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.4;
}

.aurora-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--aurora-1, rgba(124, 58, 237, 0.35)), transparent 70%);
  top: -200px;
  left: -100px;
  animation: floatSphere 20s ease-in-out infinite;
}

.aurora-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--aurora-2, rgba(6, 182, 212, 0.25)), transparent 70%);
  top: 40%;
  right: -150px;
  animation: floatSphere 25s ease-in-out infinite reverse;
}

.aurora-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--aurora-3, rgba(236, 72, 153, 0.2)), transparent 70%);
  bottom: -100px;
  left: 30%;
  animation: floatSphere 30s ease-in-out infinite;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-tint, rgba(124, 58, 237, 0.03)) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-tint, rgba(124, 58, 237, 0.03)) 1px, transparent 1px);
  background-size: 60px 60px;
}

.noise-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.015;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
}

@keyframes floatSphere {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -40px) scale(1.05); }
  50% { transform: translate(-20px, 20px) scale(0.95); }
  75% { transform: translate(40px, 30px) scale(1.03); }
}
</style>
