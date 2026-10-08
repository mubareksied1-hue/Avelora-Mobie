import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/cyclone-svgrepo-com.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSliders, faSun } from '@fortawesome/free-solid-svg-icons'
import './Navbar.css'
import SearchBar from './SearchBar.jsx'

const Navbar = ({
  onSearch,
  theme,
  themeMode,
  schedule,
  onToggleTheme,
  onThemeModeChange,
  onScheduleChange,
}) => {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  const [scheduleDraft, setScheduleDraft] = useState(schedule)
  const [scheduleError, setScheduleError] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const appearanceRef = useRef(null)

  useEffect(() => {
    const closeSettingsOnOutsideClick = (event) => {
      if (!appearanceRef.current?.contains(event.target)) {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeSettingsOnOutsideClick)
    return () => {
      document.removeEventListener('pointerdown', closeSettingsOnOutsideClick)
    }
  }, [])

  const handleScheduleSubmit = (event) => {
    event.preventDefault()
    if (scheduleDraft.lightStart === scheduleDraft.darkStart) {
      setScheduleError('Light and dark must start at different times.')
      return
    }

    setScheduleError('')
    onScheduleChange(scheduleDraft)
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__top">
          <Link className="navbar__brand" to="/" aria-label="Avelora home">
            <img src={logo} alt="" />
            <span>AVELORA</span>
          </Link>

          <div className="navbar__appearance" ref={appearanceRef}>
            <button
              className="navbar__theme"
              type="button"
              aria-label={`Switch to ${nextTheme} mode manually`}
              onClick={onToggleTheme}
            >
              <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
              <span>{nextTheme === 'light' ? 'Light' : 'Dark'}</span>
            </button>
            <button
              className="theme-settings__trigger"
              type="button"
              aria-label="Theme settings"
              aria-expanded={isSettingsOpen}
              aria-controls="theme-settings-panel"
              onClick={() => setIsSettingsOpen((isOpen) => !isOpen)}
            >
              <FontAwesomeIcon icon={faSliders} aria-hidden="true" />
              <span>Settings</span>
            </button>
            <div
              className="theme-settings__panel"
              id="theme-settings-panel"
              role="group"
              aria-label="Theme settings"
              hidden={!isSettingsOpen}
            >
              <h2>Appearance</h2>
              <p className="theme-settings__description">
                Choose a mode or let local time switch it automatically.
              </p>
              <fieldset className="theme-settings__modes">
                <legend>Theme mode</legend>
                {['auto', 'light', 'dark'].map((mode) => (
                  <label key={mode}>
                    <input
                      type="radio"
                      name="theme-mode"
                      value={mode}
                      checked={themeMode === mode}
                      onChange={() => onThemeModeChange(mode)}
                    />
                    <span>{mode === 'auto' ? 'Auto' : mode === 'light' ? 'Light' : 'Dark'}</span>
                  </label>
                ))}
              </fieldset>
              <form className="theme-settings__schedule" onSubmit={handleScheduleSubmit}>
                <p className="theme-settings__schedule-title">Automatic schedule</p>
                <label htmlFor="light-start">Light starts</label>
                <input
                  id="light-start"
                  type="time"
                  value={scheduleDraft.lightStart}
                  onChange={(event) => {
                    setScheduleDraft((current) => ({
                      ...current,
                      lightStart: event.target.value,
                    }))
                    setScheduleError('')
                  }}
                />
                <label htmlFor="dark-start">Dark starts</label>
                <input
                  id="dark-start"
                  type="time"
                  value={scheduleDraft.darkStart}
                  onChange={(event) => {
                    setScheduleDraft((current) => ({
                      ...current,
                      darkStart: event.target.value,
                    }))
                    setScheduleError('')
                  }}
                />
                {scheduleError && <p className="theme-settings__error" role="alert">{scheduleError}</p>}
                <button className="theme-settings__save" type="submit">Save schedule</button>
              </form>
            </div>
          </div>
          <Link className="navbar__premium" to="/premium">
            Premium
          </Link>
        </div>

        <SearchBar onSearch={onSearch} />
      </div>
    </header>
  )
}

export default Navbar
