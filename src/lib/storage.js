const SCRIPT_URL_KEY = 'dnd_script_url'
const CACHE_KEY = 'dnd_characters_cache'
const CHAR_CACHE_PREFIX = 'dnd_char_'

// --- Script URL management ---
export function getScriptUrl() {
  return localStorage.getItem(SCRIPT_URL_KEY) || ''
}

export function setScriptUrl(url) {
  localStorage.setItem(SCRIPT_URL_KEY, url)
}

// --- Cache helpers ---
function getCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]')
  } catch {
    return []
  }
}

function setCache(characters) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(characters))
}

export function getCachedCharacters() {
  return getCache()
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY)
  // Clear all individual character caches
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith(CHAR_CACHE_PREFIX)) localStorage.removeItem(k)
  })
}

export function getCachedCharacter(id) {
  try {
    return JSON.parse(localStorage.getItem(CHAR_CACHE_PREFIX + id) || 'null')
  } catch { return null }
}

function setCachedCharacter(id, char) {
  localStorage.setItem(CHAR_CACHE_PREFIX + id, JSON.stringify(char))
}

// --- API calls ---
async function callApi(params) {
  const url = getScriptUrl()
  if (!url) throw new Error('URL del script no configurada')

  const response = await fetch(url + '?' + new URLSearchParams(params), {
    redirect: 'follow',
  })

  const text = await response.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('Respuesta no válida del servidor')
  }

  if (data.error) throw new Error(data.error)
  return data
}

export async function pingServer() {
  return callApi({ action: 'ping' })
}

export async function listCharacters() {
  const data = await callApi({ action: 'list' })
  const characters = data.characters || []
  setCache(characters)
  return characters
}

export async function getCharacter(id) {
  const data = await callApi({ action: 'get', id })
  const char = data.character
  if (char) setCachedCharacter(id, char)
  return char
}

export async function createCharacter(name) {
  const data = await callApi({ action: 'create', name })
  return data.character
}

export async function updateCharacter(id, updates) {
  const data = await callApi({
    action: 'update',
    id,
    data: JSON.stringify(updates),
  })
  return data.character
}

export async function deleteCharacter(id) {
  await callApi({ action: 'delete', id })
}

