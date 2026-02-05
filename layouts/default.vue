<template>
  <div class="layout-default">
    <!-- Enhanced Animated Background -->
    <div class="animated-bg">
      <div class="gradient-sphere sphere-1"></div>
      <div class="gradient-sphere sphere-2"></div>
      <div class="gradient-sphere sphere-3"></div>
      <div class="grid-overlay"></div>
    </div>
    
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
  background: linear-gradient(135deg, #0a0a1a 0%, #0d1117 50%, #0a0a1a 100%);
}

.layout-default main {
  flex: 1;
  position: relative;
  z-index: 1;
}

/* Enhanced Animated Background */
.animated-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
  animation: floatSphere 25s ease-in-out infinite;
}

.sphere-1 {
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.35), transparent 70%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.sphere-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent 70%);
  top: 40%;
  right: -200px;
  animation-delay: -8s;
}

.sphere-3 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.25), transparent 70%);
  bottom: -150px;
  left: 35%;
  animation-delay: -16s;
}

@keyframes floatSphere {
  0%, 100% { 
    transform: translate(0, 0) scale(1); 
  }
  25% { 
    transform: translate(40px, -40px) scale(1.05); 
  }
  50% { 
    transform: translate(-30px, 30px) scale(0.95); 
  }
  75% { 
    transform: translate(25px, 15px) scale(1.02); 
  }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 80px 80px;
  animation: gridPan 40s linear infinite;
}

@keyframes gridPan {
  0% { background-position: 0 0; }
  100% { background-position: 80px 80px; }
}
</style>
