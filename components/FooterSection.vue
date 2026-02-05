<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <NuxtLink to="/" class="footer-logo">
            <span class="logo-icon">⚡</span>
            <span>Quick<span class="gradient-text">Help</span></span>
          </NuxtLink>
          <p class="footer-desc">
            Your all-in-one hub for quick help with anything - from mental health 
            support to productivity tools and learning resources.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Discord">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-links-grid">
          <div class="footer-section">
            <h4>Tools</h4>
            <NuxtLink to="/tools/converter">Unit Converter</NuxtLink>
            <NuxtLink to="/tools/timer">Focus Timer</NuxtLink>
            <NuxtLink to="/tools/password">Password Generator</NuxtLink>
            <NuxtLink to="/tools/qr">QR Code Maker</NuxtLink>
            <NuxtLink to="/tools/json">JSON Formatter</NuxtLink>
            <NuxtLink to="/tools/hash-generator">Hash Generator</NuxtLink>
          </div>
          <div class="footer-section">
            <h4>More Tools</h4>
            <NuxtLink to="/tools/uuid-generator">UUID Generator</NuxtLink>
            <NuxtLink to="/tools/base64-image">Image to Base64</NuxtLink>
            <NuxtLink to="/tools/lorem-ipsum">Lorem Ipsum</NuxtLink>
            <NuxtLink to="/tools/link-shortener">Link Shortener</NuxtLink>
            <NuxtLink to="/tools/word-counter">Word Counter</NuxtLink>
            <NuxtLink to="/tools/tip-calculator">Tip Calculator</NuxtLink>
          </div>
          <div class="footer-section">
            <h4>Resources</h4>
            <NuxtLink to="/mental-health">Mental Health</NuxtLink>
            <NuxtLink to="/learning">Learning Hub</NuxtLink>
            <NuxtLink to="/support">Support Center</NuxtLink>
            <NuxtLink to="/about">About Us</NuxtLink>
          </div>
          <div class="footer-section">
            <h4>Account</h4>
            <NuxtLink to="/auth/login">Login / Signup</NuxtLink>
            <NuxtLink to="/staff/login">Staff Portal</NuxtLink>
            <NuxtLink to="/privacy">Privacy Policy</NuxtLink>
            <NuxtLink to="/terms">Terms of Service</NuxtLink>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 QuickHelp.lol - All rights reserved. Made with 💜 for everyone who needs a little help.</p>
        <div class="footer-badges">
          <span class="badge badge-primary">Free Forever</span>
          <span class="badge badge-success">No Ads</span>
          <span class="badge badge-warning">Privacy First</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--surface);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 100px;
  padding: 80px 0 40px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  margin-bottom: 60px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
}

.logo-icon {
  font-size: 28px;
}

.footer-desc {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 24px;
  max-width: 320px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--surface-light);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.footer-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-section a {
  display: block;
  padding: 8px 0;
  font-size: 14px;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.2s ease;
}

.footer-section a:hover {
  color: white;
  transform: translateX(4px);
}

.footer-bottom {
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-bottom p {
  font-size: 14px;
  color: var(--text-muted);
}

.footer-badges {
  display: flex;
  gap: 8px;
}

@media (max-width: 900px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .footer-links-grid {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
