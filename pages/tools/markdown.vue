<template>
  <div class="tool-page">
    <NavBar />
    <div class="page-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>

    <main class="tool-container">
      <header class="tool-header">
        <NuxtLink to="/tools" class="back-btn">← Back to Tools</NuxtLink>
        <div class="badge"><span>📝</span> Writing Tool</div>
        <h1><span class="gradient-text">Markdown Preview</span></h1>
        <p>Write Markdown and see live rendered preview side by side.</p>
      </header>

      <div class="tool-card">
        <!-- Toolbar -->
        <div class="toolbar">
          <div class="tool-group">
            <button @click="insertMarkdown('**', '**')" title="Bold">
              <strong>B</strong>
            </button>
            <button @click="insertMarkdown('*', '*')" title="Italic">
              <em>I</em>
            </button>
            <button @click="insertMarkdown('~~', '~~')" title="Strikethrough">
              <s>S</s>
            </button>
            <button @click="insertMarkdown('`', '`')" title="Inline Code">
              &lt;/&gt;
            </button>
          </div>
          <div class="tool-group">
            <button @click="insertLine('# ')" title="Heading 1">H1</button>
            <button @click="insertLine('## ')" title="Heading 2">H2</button>
            <button @click="insertLine('### ')" title="Heading 3">H3</button>
          </div>
          <div class="tool-group">
            <button @click="insertLine('- ')" title="Bullet List">•</button>
            <button @click="insertLine('1. ')" title="Numbered List">1.</button>
            <button @click="insertLine('> ')" title="Quote">❝</button>
            <button @click="insertLine('---\n')" title="Horizontal Rule">—</button>
          </div>
          <div class="tool-group">
            <button @click="insertMarkdown('[', '](url)')" title="Link">🔗</button>
            <button @click="insertMarkdown('![alt](', ')')" title="Image">🖼️</button>
            <button @click="insertCodeBlock" title="Code Block">```</button>
          </div>
        </div>

        <!-- Editor and Preview -->
        <div class="editor-layout">
          <div class="editor-pane">
            <div class="pane-header">
              <span>📝 Markdown</span>
              <span class="stats">{{ wordCount }} words • {{ charCount }} chars</span>
            </div>
            <textarea
              ref="editorRef"
              v-model="markdown"
              placeholder="Start typing Markdown here..."
              @keydown.tab.prevent="insertTab"
            ></textarea>
          </div>

          <div class="preview-pane">
            <div class="pane-header">
              <span>👁️ Preview</span>
              <button @click="copyHtml" class="copy-btn">📋 Copy HTML</button>
            </div>
            <div class="preview-content" v-html="renderedHtml"></div>
          </div>
        </div>

        <!-- Cheatsheet -->
        <details class="cheatsheet">
          <summary>📚 Markdown Cheatsheet</summary>
          <div class="cheatsheet-grid">
            <div class="cheat-item">
              <code>**bold**</code>
              <span><strong>bold</strong></span>
            </div>
            <div class="cheat-item">
              <code>*italic*</code>
              <span><em>italic</em></span>
            </div>
            <div class="cheat-item">
              <code>~~strikethrough~~</code>
              <span><s>strikethrough</s></span>
            </div>
            <div class="cheat-item">
              <code># Heading 1</code>
              <span>Large heading</span>
            </div>
            <div class="cheat-item">
              <code>[link](url)</code>
              <span><a href="#">link</a></span>
            </div>
            <div class="cheat-item">
              <code>`inline code`</code>
              <span><code>inline code</code></span>
            </div>
            <div class="cheat-item">
              <code>- list item</code>
              <span>• list item</span>
            </div>
            <div class="cheat-item">
              <code>> quote</code>
              <span style="border-left: 2px solid #64748b; padding-left: 8px;">quote</span>
            </div>
          </div>
        </details>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<script setup>
useHead({ title: 'Markdown Preview - QuickHelp.lol' })

const editorRef = ref(null)
const markdown = ref(`# Welcome to Markdown Preview! 🎉

This is a **live preview** editor. Write *Markdown* on the left and see it rendered instantly.

## Features

- **Bold** and *italic* text
- \`Inline code\` and code blocks
- Lists (ordered and unordered)
- [Links](https://quickhelp.lol) and images
- And much more!

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> "Markdown is intended to be as easy-to-read and easy-to-write as possible."
> — John Gruber

---

Try editing this text to see the preview update in real-time!
`)

const wordCount = computed(() => {
  const text = markdown.value.trim()
  if (!text) return 0
  return text.split(/\s+/).length
})

const charCount = computed(() => markdown.value.length)

const renderedHtml = computed(() => {
  return parseMarkdown(markdown.value)
})

const parseMarkdown = (text) => {
  let html = text
    // Escape HTML
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headings
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    // Bold and Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Links and Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%"/>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // Blockquotes
    .replace(/^&gt; (.*)$/gm, '<blockquote>$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr/>')
    // Unordered lists
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*)$/gm, '<li>$1</li>')
    // Wrap consecutive li elements
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
  
  return `<p>${html}</p>`
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-6]>)/g, '$1')
    .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
    .replace(/<p>(<pre>)/g, '$1')
    .replace(/(<\/pre>)<\/p>/g, '$1')
    .replace(/<p>(<ul>)/g, '$1')
    .replace(/(<\/ul>)<\/p>/g, '$1')
    .replace(/<p>(<blockquote>)/g, '$1')
    .replace(/(<\/blockquote>)<\/p>/g, '$1')
    .replace(/<p>(<hr\/>)/g, '$1')
    .replace(/(<hr\/>)<\/p>/g, '$1')
}

const insertMarkdown = (before, after) => {
  const editor = editorRef.value
  if (!editor) return
  
  const start = editor.selectionStart
  const end = editor.selectionEnd
  const selected = markdown.value.substring(start, end)
  
  markdown.value = markdown.value.substring(0, start) + before + selected + after + markdown.value.substring(end)
  
  nextTick(() => {
    editor.focus()
    editor.setSelectionRange(start + before.length, start + before.length + selected.length)
  })
}

const insertLine = (prefix) => {
  const editor = editorRef.value
  if (!editor) return
  
  const start = editor.selectionStart
  const beforeCursor = markdown.value.substring(0, start)
  const lineStart = beforeCursor.lastIndexOf('\n') + 1
  
  markdown.value = markdown.value.substring(0, lineStart) + prefix + markdown.value.substring(lineStart)
  
  nextTick(() => {
    editor.focus()
    editor.setSelectionRange(start + prefix.length, start + prefix.length)
  })
}

const insertCodeBlock = () => {
  insertMarkdown('```\n', '\n```')
}

const insertTab = () => {
  const editor = editorRef.value
  if (!editor) return
  
  const start = editor.selectionStart
  markdown.value = markdown.value.substring(0, start) + '  ' + markdown.value.substring(start)
  
  nextTick(() => {
    editor.focus()
    editor.setSelectionRange(start + 2, start + 2)
  })
}

const copyHtml = () => {
  navigator.clipboard.writeText(renderedHtml.value)
}
</script>

<style scoped>
.tool-page { min-height: 100vh; position: relative; }
.page-bg { position: fixed; inset: 0; z-index: -1; background: #030712; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: float 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent 70%); top: -100px; right: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent 70%); bottom: -100px; left: -100px; animation-delay: -10s; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }

.tool-container { max-width: 1200px; margin: 0 auto; padding: 100px 24px 60px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.back-btn { display: inline-block; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 20px; }
.back-btn:hover { color: #a855f7; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 100px; color: #a855f7; font-size: 13px; margin-bottom: 16px; }
.tool-header h1 { font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.gradient-text { background: linear-gradient(135deg, #a855f7, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tool-header p { color: #64748b; font-size: 18px; }

.tool-card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 24px; padding: 24px; backdrop-filter: blur(20px); }

.toolbar { display: flex; flex-wrap: wrap; gap: 12px; padding: 16px; background: rgba(30, 41, 59, 0.5); border-radius: 14px; margin-bottom: 20px; }
.tool-group { display: flex; gap: 6px; padding-right: 12px; border-right: 1px solid rgba(100, 116, 139, 0.3); }
.tool-group:last-child { border-right: none; padding-right: 0; }
.toolbar button { padding: 8px 12px; font-size: 14px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 8px; color: #e2e8f0; cursor: pointer; transition: all 0.2s; min-width: 36px; }
.toolbar button:hover { border-color: #a855f7; background: rgba(168, 85, 247, 0.15); }

.editor-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
@media (max-width: 900px) { .editor-layout { grid-template-columns: 1fr; } }

.editor-pane, .preview-pane { display: flex; flex-direction: column; }
.pane-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(30, 41, 59, 0.5); border-radius: 12px 12px 0 0; font-size: 14px; color: #e2e8f0; }
.stats { font-size: 12px; color: #64748b; }
.copy-btn { padding: 6px 12px; font-size: 12px; background: rgba(168, 85, 247, 0.2); border: none; border-radius: 6px; color: #a855f7; cursor: pointer; }

textarea { flex: 1; min-height: 400px; padding: 16px; font-size: 14px; font-family: 'Fira Code', monospace; line-height: 1.6; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-top: none; border-radius: 0 0 12px 12px; color: #e2e8f0; resize: vertical; outline: none; }
textarea:focus { border-color: #a855f7; }

.preview-pane .preview-content { flex: 1; min-height: 400px; padding: 16px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(100, 116, 139, 0.3); border-top: none; border-radius: 0 0 12px 12px; overflow-y: auto; color: #e2e8f0; line-height: 1.7; }

/* Markdown Preview Styles */
.preview-content :deep(h1) { font-size: 28px; font-weight: 700; margin: 20px 0 12px; color: #f1f5f9; border-bottom: 1px solid rgba(100, 116, 139, 0.3); padding-bottom: 8px; }
.preview-content :deep(h2) { font-size: 22px; font-weight: 600; margin: 18px 0 10px; color: #f1f5f9; }
.preview-content :deep(h3) { font-size: 18px; font-weight: 600; margin: 16px 0 8px; color: #f1f5f9; }
.preview-content :deep(p) { margin: 12px 0; }
.preview-content :deep(a) { color: #a855f7; text-decoration: none; }
.preview-content :deep(a:hover) { text-decoration: underline; }
.preview-content :deep(code) { background: rgba(168, 85, 247, 0.15); padding: 2px 6px; border-radius: 4px; font-family: 'Fira Code', monospace; font-size: 13px; color: #c4b5fd; }
.preview-content :deep(pre) { background: rgba(30, 41, 59, 0.8); padding: 16px; border-radius: 10px; overflow-x: auto; margin: 16px 0; }
.preview-content :deep(pre code) { background: transparent; padding: 0; color: #e2e8f0; }
.preview-content :deep(blockquote) { border-left: 3px solid #a855f7; padding-left: 16px; margin: 16px 0; color: #94a3b8; font-style: italic; }
.preview-content :deep(ul) { padding-left: 24px; margin: 12px 0; list-style: disc; }
.preview-content :deep(li) { margin: 6px 0; }
.preview-content :deep(hr) { border: none; border-top: 1px solid rgba(100, 116, 139, 0.3); margin: 24px 0; }
.preview-content :deep(strong) { font-weight: 600; color: #f1f5f9; }
.preview-content :deep(del) { color: #64748b; }

.cheatsheet { margin-top: 24px; background: rgba(30, 41, 59, 0.5); border-radius: 14px; }
.cheatsheet summary { padding: 16px 20px; cursor: pointer; color: #e2e8f0; font-weight: 500; }
.cheatsheet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; padding: 0 20px 20px; }
.cheat-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: rgba(15, 23, 42, 0.5); border-radius: 8px; }
.cheat-item code { font-family: 'Fira Code', monospace; font-size: 13px; color: #a855f7; background: transparent; }
.cheat-item span { font-size: 13px; color: #94a3b8; }
.cheat-item a { color: #a855f7; text-decoration: none; }
</style>
