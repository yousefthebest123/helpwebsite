<template>
  <div class="app">
    <div class="animated-bg"></div>
    
    <!-- Navigation -->
    <NavBar />
    
    <!-- Main Content -->
    <main>
      <NuxtPage />
    </main>
    
    <!-- Footer -->
    <FooterSection />
    
    <!-- Global Toast Notifications -->
    <ToastNotifications />
  </div>
</template>

<script setup>
// App-level setup
useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
