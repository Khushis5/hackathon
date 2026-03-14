// Fetch wrapper to automatically include the token
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('accessToken')
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  })

  // Attempt to parse JSON response
  let data
  try {
    data = await response.json()
  } catch (error) {
    data = null
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'API request failed')
  }

  return data
}
