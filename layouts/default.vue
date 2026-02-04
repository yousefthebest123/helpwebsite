<template>
  <div class="layout-default">
    <div class="animated-bg"></div>
    
    <!-- Navigation -->
    <NavBar />
    
    <!-- Main Content -->
    <main>
      <slot />
    </main>
    
    <!-- Footer -->
    <FooterSection />
    
    <!-- Live Chat Widget -->
    <LiveChatWidget />
    
    <!-- Global Toast Notifications -->
    <ToastNotifications />
  </div>
</template>

<style>
.layout-default {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-default main {
  flex: 1;
}
</style>
