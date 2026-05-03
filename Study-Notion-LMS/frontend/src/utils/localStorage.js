export const getStoredValue = (key, fallback = null) => {
  const value = localStorage.getItem(key)

  if (value === null || value === undefined) {
    return fallback
  }

  try {
    return JSON.parse(value)
  } catch (error) {
    return fallback
  }
}

export const getStoredToken = () => {
  const value = localStorage.getItem("token")

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}
