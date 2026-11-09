const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
const TOKEN_KEY = 'chemistpro_token'
const USER_KEY = 'chemistpro_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY) || ''
export const getSavedUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
}
export const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const raw = await response.text()
  let data = null
  try { data = raw ? JSON.parse(raw) : null } catch { data = raw }
  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || data?.error || `Request failed (${response.status})`
    throw new Error(message)
  }
  return data
}

export const api = {
  register: payload => request('/Authorization/Register', { method: 'POST', body: JSON.stringify(payload) }),
  login: payload => request('/Authorization/Login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: userName => request('/Authorization/Logout', { method: 'POST', body: JSON.stringify({ userName }) }),
  getDrugs: () => request('/DrugManagement/GetAllDrugs'),
  getDrugCount: () => request('/DrugManagement/GetAmountOfDrugs'),
  searchDrugs: params => request(`/DrugManagement/SearchDrug?${new URLSearchParams(params)}`),
  addDrug: payload => request('/DrugManagement/AddDrug', { method: 'POST', body: JSON.stringify(payload) }),
  updateDrug: payload => request('/DrugManagement/UpdateDrug', { method: 'POST', body: JSON.stringify(payload) }),
  deleteDrug: brandName => request(`/DrugManagement/DeleteDrug?${new URLSearchParams({ brandName })}`, { method: 'DELETE' }),
  sellDrugs: payload => request('/Sales/dispenseDrug', { method: 'POST', body: JSON.stringify(payload) })
}
