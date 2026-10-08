import { useEffect, useLayoutEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './Components/Footer.jsx'
import Home from './Pages/Home.jsx'
import MovieDetails from './Pages/MovieDetails.jsx'
import Movies from './Pages/Movies.jsx'
import Premium from './Pages/Premium.jsx'

const STORAGE_KEY = 'avelora-theme-preferences'
const DEFAULT_PREFERENCES = {
  mode: 'auto',
  schedule: {
    lightStart: '06:00',
    darkStart: '18:00',
  },
}

const isValidTime = (value) => (
  typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
)

const loadPreferences = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return DEFAULT_PREFERENCES
    }

    const parsed = JSON.parse(saved)
    const validMode = ['auto', 'light', 'dark'].includes(parsed.mode)
    const validSchedule = isValidTime(parsed.schedule?.lightStart)
      && isValidTime(parsed.schedule?.darkStart)
      && parsed.schedule.lightStart !== parsed.schedule.darkStart

    if (validMode && validSchedule) {
      return {
        mode: parsed.mode,
        schedule: {
          lightStart: parsed.schedule.lightStart,
          darkStart: parsed.schedule.darkStart,
        },
      }
    }

    console.warn('Saved AVELORA theme preferences were invalid; using defaults.')
  } catch (error) {
    console.warn('Unable to read saved AVELORA theme preferences.', error)
  }

  return DEFAULT_PREFERENCES
}

const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

const getThemeForSchedule = (schedule, date = new Date()) => {
  const currentMinutes = date.getHours() * 60 + date.getMinutes()
  const lightStart = toMinutes(schedule.lightStart)
  const darkStart = toMinutes(schedule.darkStart)
  const isLightPeriod = lightStart < darkStart
    ? currentMinutes >= lightStart && currentMinutes < darkStart
    : currentMinutes >= lightStart || currentMinutes < darkStart

  return isLightPeriod ? 'light' : 'dark'
}

const getMillisecondsUntilNextBoundary = (schedule, now = new Date()) => {
  const todayBoundaries = [schedule.lightStart, schedule.darkStart].map((time) => {
    const boundary = new Date(now)
    const [hours, minutes] = time.split(':').map(Number)
    boundary.setHours(hours, minutes, 0, 0)

    if (boundary <= now) {
      boundary.setDate(boundary.getDate() + 1)
    }

    return boundary.getTime()
  })

  return Math.min(...todayBoundaries) - now.getTime()
}

function App() {
  const [preferences, setPreferences] = useState(loadPreferences)
  const [clock, setClock] = useState(() => Date.now())
  const theme = preferences.mode === 'auto'
    ? getThemeForSchedule(preferences.schedule, new Date(clock))
    : preferences.mode

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    } catch (error) {
      console.error('Unable to save AVELORA theme preferences.', error)
    }
  }, [preferences])

  useEffect(() => {
    if (preferences.mode !== 'auto') {
      return undefined
    }

    let timeoutId

    const scheduleNextUpdate = () => {
      setClock(Date.now())
      timeoutId = window.setTimeout(
        scheduleNextUpdate,
        getMillisecondsUntilNextBoundary(preferences.schedule),
      )
    }

    const updateWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        window.clearTimeout(timeoutId)
        scheduleNextUpdate()
      }
    }

    timeoutId = window.setTimeout(
      scheduleNextUpdate,
      getMillisecondsUntilNextBoundary(preferences.schedule),
    )
    document.addEventListener('visibilitychange', updateWhenVisible)

    return () => {
      window.clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', updateWhenVisible)
    }
  }, [preferences.mode, preferences.schedule])

  const setThemeMode = (mode) => {
    setPreferences((current) => ({ ...current, mode }))
    if (mode === 'auto') {
      setClock(Date.now())
    }
  }

  const setThemeSchedule = (schedule) => {
    setPreferences((current) => ({ ...current, schedule }))
    setClock(Date.now())
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              theme={theme}
              themeMode={preferences.mode}
              schedule={preferences.schedule}
              onToggleTheme={() => setThemeMode(theme === 'dark' ? 'light' : 'dark')}
              onThemeModeChange={setThemeMode}
              onScheduleChange={setThemeSchedule}
            />
          }
        />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/premium" element={<Premium />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
