<template>
  <div class="layout-admin">
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
  background: linear-gradient(135deg, #030712 0%, #0a1628 50%, #030712 100%);
}

.layout-admin main {
  min-height: 100vh;
}
</style>
