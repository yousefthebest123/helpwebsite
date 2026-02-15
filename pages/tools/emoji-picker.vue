<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>😀</span> Emoji Picker</h1>
        <p>Browse, search, and copy thousands of emojis. Click any emoji to copy it to your clipboard.</p>
      </div>

      <!-- Search & Copy Bar -->
      <div class="top-bar glass">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input v-model="search" type="text" class="search-input" placeholder="Search emojis..." />
          <span v-if="search" class="clear-btn" @click="search = ''">×</span>
        </div>
        <div class="copied-toast" v-if="copiedEmoji">
          {{ copiedEmoji }} Copied!
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="category-tabs">
        <button v-for="cat in categories" :key="cat.id" 
          class="cat-tab" 
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
          :title="cat.name"
        >
          {{ cat.icon }}
        </button>
      </div>

      <!-- Skin Tone Selector -->
      <div class="skin-tones glass">
        <span class="skin-label">Skin Tone:</span>
        <button v-for="tone in skinTones" :key="tone.mod" 
          class="tone-btn" 
          :class="{ active: skinTone === tone.mod }"
          @click="skinTone = tone.mod"
        >{{ tone.sample }}</button>
      </div>

      <!-- Recently Used -->
      <div class="recent-section" v-if="recentEmojis.length > 0 && !search && activeCategory === 'all'">
        <h3>🕐 Recently Used</h3>
        <div class="emoji-grid recent">
          <button v-for="emoji in recentEmojis" :key="emoji" class="emoji-btn" @click="copyEmoji(emoji)">
            {{ emoji }}
          </button>
        </div>
      </div>

      <!-- Emoji Grid -->
      <div class="emoji-section" v-for="group in filteredGroups" :key="group.name">
        <h3>{{ group.icon }} {{ group.name }}</h3>
        <div class="emoji-grid">
          <button v-for="emoji in group.emojis" :key="emoji" class="emoji-btn" @click="copyEmoji(emoji)" :title="emoji">
            {{ emoji }}
          </button>
        </div>
      </div>

      <div class="empty-state" v-if="filteredGroups.length === 0">
        <span class="empty-icon">🤷</span>
        <p>No emojis found for "{{ search }}"</p>
      </div>

      <!-- Emoji Combos -->
      <div class="combos-section glass">
        <h3>🔥 Popular Combos</h3>
        <div class="combos-grid">
          <button v-for="combo in combos" :key="combo.emojis" class="combo-btn" @click="copyEmoji(combo.emojis)">
            <span class="combo-emojis">{{ combo.emojis }}</span>
            <span class="combo-name">{{ combo.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Emoji Picker — QuickHelp.lol' })

const search = ref('')
const activeCategory = ref('all')
const skinTone = ref('')
const copiedEmoji = ref('')
const recentEmojis = ref([])

const skinTones = [
  { mod: '', sample: '👋' },
  { mod: '🏻', sample: '👋🏻' },
  { mod: '🏼', sample: '👋🏼' },
  { mod: '🏽', sample: '👋🏽' },
  { mod: '🏾', sample: '👋🏾' },
  { mod: '🏿', sample: '👋🏿' },
]

const categories = [
  { id: 'all', name: 'All', icon: '⭐' },
  { id: 'smileys', name: 'Smileys', icon: '😀' },
  { id: 'people', name: 'People', icon: '👋' },
  { id: 'animals', name: 'Animals', icon: '🐱' },
  { id: 'food', name: 'Food', icon: '🍕' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'activities', name: 'Activities', icon: '⚽' },
  { id: 'objects', name: 'Objects', icon: '💡' },
  { id: 'symbols', name: 'Symbols', icon: '❤️' },
  { id: 'flags', name: 'Flags', icon: '🏳️' },
]

const emojiGroups = [
  {
    name: 'Smileys & Emotion',
    id: 'smileys',
    icon: '😀',
    emojis: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','🫤','😟','🙁','☹️','😮','😯','😲','😳','🥺','🥹','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖','😺','😸','😹','😻','😼','😽','🙀','😿','😾']
  },
  {
    name: 'People & Gestures',
    id: 'people',
    icon: '👋',
    emojis: ['👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁️','👅','👄','🫦','👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵','🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇','🤦','🤷','👮','🕵️','💂','🥷','👷','🫅','🤴','👸','👳','👲','🧕','🤵','👰','🤰','🫃','🫄','🤱','👼','🎅','🤶','🦸','🦹','🧙','🧚','🧛','🧜','🧝','🧞','🧟','🧌','💆','💇','🚶','🧍','🧎','🏃','💃','🕺','🕴️','👯','🧖','🧗','🤸','⛹️','🏋️','🚴','🚵','🤼','🤽','🤾','🤺','⛷️','🏂','🏌️','🏄','🚣','🏊','🤿','🧘']
  },
  {
    name: 'Animals & Nature',
    id: 'animals',
    icon: '🐱',
    emojis: ['🐱','🐶','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️','🕸️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🪼','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🫏','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🪶','🐓','🦃','🦤','🦚','🦜','🦢','🪿','🦩','🕊️','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿️','🦔','🐾','🐉','🐲','🌵','🎄','🌲','🌳','🌴','🪵','🌱','🌿','☘️','🍀','🎍','🪴','🎋','🍃','🍂','🍁','🍄','🌾','💐','🌷','🌹','🥀','🪻','🌺','🌸','🌼','🌻','🌞','🌝','🌛','🌜','🌚','🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔','🌙','🌎','🌍','🌏','🪐','💫','⭐','🌟','✨','⚡','☄️','💥','🔥','🌪️','🌈','☀️','🌤️','⛅','🌥️','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','❄️','☃️','⛄','🌬️','💨','💧','💦','🫧','☔','☂️','🌊','🌫️']
  },
  {
    name: 'Food & Drink',
    id: 'food',
    icon: '🍕',
    emojis: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🫛','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🫒','🧄','🧅','🫚','🥔','🍠','🫘','🥐','🥖','🍞','🥨','🥯','🧇','🥞','🧈','🍳','🥚','🧀','🥩','🍖','🍗','🥓','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🫘','🍯','🥛','🫗','🍼','🫖','☕','🍵','🧃','🥤','🧋','🫙','🍶','🍺','🍻','🥂','🍷','🫗','🥃','🍸','🍹','🧉','🍾','🧊','🥄','🍴','🍽️','🥢','🧂']
  },
  {
    name: 'Travel & Places',
    id: 'travel',
    icon: '✈️',
    emojis: ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍️','🛵','🛺','🚲','🛴','🛹','🛼','🚏','🛣️','🛤️','⛽','🛞','🚨','🚥','🚦','🛑','🚧','⚓','🛟','⛵','🛶','🚤','🛳️','⛴️','🚢','✈️','🛩️','🛫','🛬','🪂','💺','🚁','🚟','🚠','🚡','🛰️','🚀','🛸','🏠','🏡','🏘️','🏚️','🏗️','🏭','🏢','🏬','🏣','🏤','🏥','🏦','🏨','🏪','🏫','🏩','💒','🏛️','⛪','🕌','🛕','🕍','⛩️','🕋','⛲','⛺','🌁','🌃','🏙️','🌄','🌅','🌆','🌇','🌉','♨️','🎠','🛝','🎡','🎢','💈','🎪','🚂','🚃','🚄','🚅','🚆','🚇','🚈','🚉','🚊','🚝','🚞','🚋','🚌','🗼','🗽','🗾','🏯','🏰','🌐','🗺️','🧭','🏔️','⛰️','🌋','🗻','🏕️','🏖️','🏜️','🏝️','🏞️']
  },
  {
    name: 'Activities',
    id: 'activities',
    icon: '⚽',
    emojis: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','⛸️','🥌','🎿','⛷️','🏂','🪂','🏋️','🤼','🤸','🤺','⛹️','🤾','🏌️','🏇','🧘','🏄','🏊','🤽','🚣','🧗','🚵','🚴','🏆','🥇','🥈','🥉','🏅','🎖️','🏵️','🎗️','🎫','🎟️','🎪','🤹','🎭','🩰','🎨','🎬','🎤','🎧','🎼','🎸','🎹','🪗','🥁','🪘','🎺','🎷','🪈','🎻','🎲','♟️','🎯','🎳','🎮','🕹️','🧩','🪅','🪩','🪆']
  },
  {
    name: 'Objects',
    id: 'objects',
    icon: '💡',
    emojis: ['⌚','📱','📲','💻','⌨️','🖥️','🖨️','🖱️','🖲️','🕹️','🗜️','💽','💾','💿','📀','📼','📷','📸','📹','🎥','📽️','🎞️','📞','☎️','📟','📠','📺','📻','🎙️','🎚️','🎛️','🧭','⏱️','⏲️','⏰','🕰️','⌛','⏳','📡','🔋','🪫','🔌','💡','🔦','🕯️','🪔','🧯','🛢️','🛍️','💰','💴','💵','💶','💷','🪙','💸','💳','💎','⚖️','🪜','🧰','🪛','🔧','🔨','⚒️','🛠️','⛏️','🪚','🔩','⚙️','🪤','🧱','⛓️','🧲','🔫','💣','🧨','🪓','🔪','🗡️','⚔️','🛡️','🚬','⚰️','🪦','⚱️','🏺','🔮','📿','🧿','🪬','💈','⚗️','🔭','🔬','🕳️','🩹','🩺','🩻','🩼','💊','💉','🩸','🧬','🦠','🧫','🧪','🌡️','🧹','🪠','🧺','🧻','🚽','🚰','🚿','🛁','🛀','🪥','🪒','🧴','🧷','🧹','🧺','🔑','🗝️','🚪','🪑','🛋️','🛏️','🛌','🧸','🪆','🖼️','🪞','🪟','🛒','🎁','🎈','🎏','🎀','🪄','🪅','🎊','🎉','🎎','🏮','🎐','🧧','✉️','📩','📨','📧','💌','📥','📤','📦','🏷️','🪧','📪','📫','📬','📭','📮','📯','📜','📃','📄','📑','🧾','📊','📈','📉','🗒️','🗓️','📆','📅','🗑️','📇','🗃️','🗳️','🗄️','📋','📁','📂','🗂️','🗞️','📰','📓','📔','📒','📕','📗','📘','📙','📚','📖','🔖','🧷','🔗','📎','🖇️','📐','📏','🧮','📌','📍','✂️','🖊️','🖋️','✒️','🖌️','🖍️','📝','✏️','🔍','🔎','🔏','🔐','🔒','🔓']
  },
  {
    name: 'Symbols',
    id: 'symbols',
    icon: '❤️',
    emojis: ['❤️','🩷','🧡','💛','💚','🩵','💙','💜','🖤','🩶','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','🪯','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗','❕','❓','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸','🔱','⚜️','🔰','♻️','✅','🈯','💹','❇️','✳️','❎','🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿','🅿️','🛗','🈳','🈂️','🛂','🛃','🛄','🛅','🚹','🚺','🚼','⚧️','🚻','🚮','🎦','📶','🈁','🔣','ℹ️','🔤','🔡','🔠','🆖','🆗','🆙','🆒','🆕','🆓','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','🔢','#️⃣','*️⃣','⏏️','▶️','⏸️','⏯️','⏹️','⏺️','⏭️','⏮️','⏩','⏪','⏫','⏬','◀️','🔼','🔽','➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↕️','↔️','↪️','↩️','⤴️','⤵️','🔀','🔁','🔂','🔄','🔃','🎵','🎶','➕','➖','➗','✖️','🟰','♾️','💲','💱','™️','©️','®️','〰️','➰','➿','🔚','🔙','🔛','🔝','🔜','✔️','☑️','🔘','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔺','🔻','🔸','🔹','🔶','🔷','🔳','🔲','▪️','▫️','◾','◽','◼️','◻️','🟥','🟧','🟨','🟩','🟦','🟪','⬛','⬜','🟫','🔈','🔇','🔉','🔊','🔔','🔕','📣','📢','💬','💭','🗯️','♠️','♣️','♥️','♦️','🃏','🎴','🀄','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛']
  },
  {
    name: 'Flags',
    id: 'flags',
    icon: '🏳️',
    emojis: ['🏳️','🏴','🏴‍☠️','🏁','🚩','🎌','🇺🇸','🇬🇧','🇨🇦','🇦🇺','🇫🇷','🇩🇪','🇮🇹','🇪🇸','🇯🇵','🇰🇷','🇨🇳','🇮🇳','🇧🇷','🇲🇽','🇷🇺','🇿🇦','🇳🇬','🇪🇬','🇹🇷','🇸🇦','🇦🇪','🇦🇷','🇨🇱','🇨🇴','🇵🇪','🇻🇪','🇵🇭','🇹🇭','🇻🇳','🇮🇩','🇲🇾','🇸🇬','🇵🇰','🇧🇩','🇳🇵','🇱🇰','🇰🇪','🇬🇭','🇪🇹','🇺🇦','🇵🇱','🇳🇱','🇧🇪','🇸🇪','🇳🇴','🇩🇰','🇫🇮','🇮🇪','🇨🇭','🇦🇹','🇵🇹','🇬🇷','🇨🇿','🇷🇴','🇭🇺','🇮🇱','🇯🇴','🇮🇶','🇰🇼','🇶🇦','🇧🇭','🇴🇲','🇾🇪','🇱🇧','🏳️‍🌈','🏳️‍⚧️']
  },
]

const combos = [
  { name: 'Love', emojis: '❤️🥰😍💕' },
  { name: 'Celebration', emojis: '🎉🥳🎊✨' },
  { name: 'Good vibes', emojis: '✨🌟💫⭐' },
  { name: 'Thinking', emojis: '🤔💭🧐❓' },
  { name: 'Sad', emojis: '😢💔😭😞' },
  { name: 'Fire', emojis: '🔥💯😤⚡' },
  { name: 'Nature', emojis: '🌿🌸🦋🌈' },
  { name: 'Foodie', emojis: '🍕🍔🌮🍟' },
  { name: 'Coding', emojis: '💻⚡🐛🚀' },
  { name: 'Music', emojis: '🎵🎶🎸🎤' },
  { name: 'Fitness', emojis: '💪🏃‍♂️🏋️‍♂️🥇' },
  { name: 'Sleep', emojis: '😴💤🌙🛏️' },
]

const filteredGroups = computed(() => {
  let groups = emojiGroups
  
  if (activeCategory.value !== 'all') {
    groups = groups.filter(g => g.id === activeCategory.value)
  }

  if (search.value) {
    const q = search.value.toLowerCase()
    groups = groups.map(g => ({
      ...g,
      emojis: g.emojis.filter(e => {
        // Simple search: match category name or just include all
        return g.name.toLowerCase().includes(q) || e.includes(q)
      })
    })).filter(g => g.emojis.length > 0)
  }

  return groups
})

const copyEmoji = async (emoji) => {
  try {
    await navigator.clipboard.writeText(emoji)
    copiedEmoji.value = emoji
    setTimeout(() => copiedEmoji.value = '', 2000)

    // Add to recent
    recentEmojis.value = [emoji, ...recentEmojis.value.filter(e => e !== emoji)].slice(0, 24)
    localStorage.setItem('quickhelp-emoji-recent', JSON.stringify(recentEmojis.value))
  } catch {}
}

onMounted(() => {
  const saved = localStorage.getItem('quickhelp-emoji-recent')
  if (saved) try { recentEmojis.value = JSON.parse(saved) } catch {}
})
</script>

<style scoped>
.tool-page { min-height: 100vh; padding: 120px 0 80px; }
.container { max-width: 900px; margin: 0 auto; padding: 0 24px; }

.tool-header { margin-bottom: 32px; }
.back-link { color: var(--text-muted); font-size: 14px; display: inline-block; margin-bottom: 16px; transition: color 0.2s; }
.back-link:hover { color: var(--primary-light); }
.tool-header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.tool-header h1 span { margin-right: 12px; }
.tool-header p { font-size: 18px; color: var(--text-muted); line-height: 1.7; }

.top-bar { display: flex; align-items: center; gap: 16px; padding: 12px 16px; margin-bottom: 20px; }

.search-wrap {
  display: flex; align-items: center; flex: 1; gap: 8px;
  background: var(--surface); border-radius: var(--radius-md);
  padding: 8px 14px;
}

.search-icon { font-size: 16px; }
.search-input { flex: 1; background: none; border: none; color: white; font-size: 14px; outline: none; }
.search-input::placeholder { color: var(--text-dim); }
.clear-btn { cursor: pointer; color: var(--text-dim); font-size: 18px; }
.clear-btn:hover { color: white; }

.copied-toast {
  padding: 8px 16px; background: var(--primary); border-radius: var(--radius-full);
  font-size: 14px; font-weight: 600; color: white;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }

.category-tabs {
  display: flex; gap: 4px; margin-bottom: 16px;
  overflow-x: auto; padding-bottom: 4px;
}

.cat-tab {
  width: 44px; height: 44px; border-radius: 12px;
  background: var(--surface); border: 2px solid transparent;
  cursor: pointer; font-size: 20px; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.cat-tab.active { border-color: var(--primary); background: rgba(124,58,237,0.15); }
.cat-tab:hover:not(.active) { background: var(--surface-light); }

.skin-tones { display: flex; align-items: center; gap: 8px; padding: 8px 16px; margin-bottom: 24px; width: fit-content; }
.skin-label { font-size: 13px; color: var(--text-muted); }

.tone-btn {
  width: 36px; height: 36px; border-radius: 8px;
  background: transparent; border: 2px solid transparent;
  cursor: pointer; font-size: 22px; transition: all 0.2s;
}

.tone-btn.active { border-color: var(--primary); background: rgba(124,58,237,0.1); }

.emoji-section { margin-bottom: 32px; }
.emoji-section h3, .recent-section h3 { font-size: 16px; color: var(--text-muted); margin-bottom: 12px; }

.recent-section { margin-bottom: 32px; }

.emoji-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(44px, 1fr)); gap: 4px;
}

.emoji-grid.recent { grid-template-columns: repeat(auto-fill, minmax(44px, 1fr)); }

.emoji-btn {
  width: 44px; height: 44px; border-radius: 10px;
  background: transparent; border: none;
  cursor: pointer; font-size: 26px; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center;
}

.emoji-btn:hover { background: var(--surface-light); transform: scale(1.25); }

.empty-state { text-align: center; padding: 48px; color: var(--text-muted); }
.empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }

.combos-section { padding: 24px; margin-top: 32px; }
.combos-section h3 { font-size: 18px; margin-bottom: 16px; }

.combos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }

.combo-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 14px; background: var(--surface); border: 1px solid var(--border-light);
  border-radius: 12px; cursor: pointer; transition: all 0.2s;
}

.combo-btn:hover { border-color: var(--primary); background: var(--surface-light); }
.combo-emojis { font-size: 24px; letter-spacing: 2px; }
.combo-name { font-size: 12px; color: var(--text-muted); }

@media (max-width: 600px) {
  .tool-header h1 { font-size: 28px; }
  .emoji-grid { grid-template-columns: repeat(auto-fill, minmax(38px, 1fr)); }
  .emoji-btn { width: 38px; height: 38px; font-size: 22px; }
  .combos-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
