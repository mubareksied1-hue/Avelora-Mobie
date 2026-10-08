import './Premium.css'

const Premium = () => {
  const plans = [
    { name: 'Weekly', price: '$1', period: 'week' },
    { name: 'Monthly', price: '$15', period: 'month', featured: true },
    { name: 'Yearly', price: '$50', period: 'year' },
  ]

  return (
    <main className="premium-page">
      <section className="premium" aria-labelledby="premium-title">
        <header className="premium__header">
          <p className="premium__eyebrow">Avelora Premium</p>
          <h1 className="premium__title" id="premium-title">Choose your plan</h1>
          <p className="premium__intro">
            Pick the pass that fits your next movie night.
          </p>
        </header>

        <div className="premium__plans">
          {plans.map(({ name, price, period, featured }) => (
            <article
              className={`premium-plan${featured ? ' premium-plan--featured' : ''}`}
              key={name}
            >
              {featured && <p className="premium-plan__badge">Most popular</p>}
              <h2 className="premium-plan__name">{name}</h2>
              <p className="premium-plan__price">
                <span>{price}</span>
                <span className="premium-plan__period">/ {period}</span>
              </p>
              <p className="premium-plan__description">
                {name === 'Weekly'
                  ? 'A week of cinematic escapes.'
                  : name === 'Monthly'
                    ? 'A month of stories worth discovering.'
                    : 'A year of entertainment, your way.'}
              </p>
              <button className="premium-plan__button" type="button">
                Choose {name}
              </button>
            </article>
          ))}
        </div>
        <p className="premium__note">Showcase preview — no payment will be taken.</p>
      </section>
    </main>
  )
}

export default Premium
