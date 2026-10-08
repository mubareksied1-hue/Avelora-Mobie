import { Link } from 'react-router-dom'
import logo from '../assets/cyclone-svgrepo-com.svg'
import './Footer.css'

const currentYear = new Date().getFullYear()

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'X', href: 'https://x.com/' },
]

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <section className="site-footer__cta" aria-labelledby="footer-cta-title">
          <div className="site-footer__cta-copy">
            <p className="site-footer__eyebrow">Your next favorite is out there</p>
            <h2 id="footer-cta-title">Discover your next story.</h2>
            <p>Find a new world to get lost in, one watch at a time.</p>
          </div>
          <Link className="site-footer__cta-button" to="/">
            Explore movies <span aria-hidden="true">→</span>
          </Link>
        </section>

        <div className="site-footer__main">
          <div className="site-footer__brand">
            <Link className="site-footer__brand-link" to="/" aria-label="Avelora home">
              <img src={logo} alt="" />
              <span>AVELORA</span>
            </Link>
            <p>
              A home for unforgettable stories and the next great thing to watch.
            </p>
          </div>

          <nav className="site-footer__links" aria-label="Explore">
            <h3>Explore</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/premium">Premium</Link></li>
            </ul>
          </nav>

          <nav className="site-footer__links" aria-label="Connect">
            <h3>Connect</h3>
            <p className="site-footer__social-note">
              General platform links · official profiles coming soon
            </p>
            <ul>
              {socialLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer">
                    {label}<span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="site-footer__legal">
          <p>© {currentYear} AVELORA. All rights reserved.</p>
          <p>Made for the love of stories.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
