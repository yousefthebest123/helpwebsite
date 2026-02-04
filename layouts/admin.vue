<template>
  <div class="layout-admin">
    <div class="animated-bg"></div>
    <div class="cyber-grid"></div>
    
    <!-- Main Content -->
    <main>
      <slot />
    </main>
    
    <!-- Global Toast Notifications -->
    <ToastNotifications />
  </div>
</template>

<style>
.layout-admin {
  min-height: 100vh;
  position: relative;
}

.layout-admin main {
  min-height: 100vh;
}
</style>
