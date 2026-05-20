import styles from './Pricing.module.css'

const plans = [
  {
    name: 'Essentials',
    price: '$4,800',
    desc: 'For early-stage founders who need a strong foundation fast.',
    items: ['Logo & mark', 'Color & typography', 'Brand guidelines', '2 revision rounds'],
  },
  {
    name: 'Studio',
    price: '$12,000',
    desc: 'The full system — built to scale with your ambitions.',
    items: ['Everything in Essentials', 'Full visual identity', 'Stationery & templates', 'Website design', '4 revision rounds'],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Ongoing design partnership for growing teams.',
    items: ['Dedicated designer', 'Monthly retainer', 'Priority turnaround', 'Quarterly brand audits'],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Pricing</span>
        <h2 className={styles.title}>Transparent. Simple. Honest.</h2>
      </div>

      <div className={styles.grid}>
        {plans.map((p) => (
          <div key={p.name} className={`${styles.card} ${p.featured ? styles.featured : ''}`}>
            {p.featured && <span className={styles.badge}>Most popular</span>}
            <h3 className={styles.planName}>{p.name}</h3>
            <div className={styles.price}>{p.price}</div>
            <p className={styles.desc}>{p.desc}</p>
            <ul className={styles.items}>
              {p.items.map((item) => (
                <li key={item}><span className={styles.check}>✓</span>{item}</li>
              ))}
            </ul>
            <a href="#contact" className={styles.btn}>
              {p.price === 'Custom' ? 'Talk to us' : 'Get started'}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
