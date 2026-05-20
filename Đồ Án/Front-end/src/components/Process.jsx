import styles from './Process.module.css'

const steps = [
  { n: '1', title: 'Discovery', body: 'We dig into your business, audience, and competitive landscape. No fluff — just the insights that matter.' },
  { n: '2', title: 'Strategy', body: 'Positioning, messaging, and visual direction grounded in research. The blueprint before a single pixel is placed.' },
  { n: '3', title: 'Design', body: 'Three distinct concepts, fully realized. We present rationale, not just pretty pictures.' },
  { n: '4', title: 'Delivery', body: 'Production files, brand guidelines, and ongoing support. You launch confident and equipped.' },
]

export default function Process() {
  return (
    <section id="process" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.label}>Our Process</span>
          <h2 className={styles.title}>
            Rigorous method.<br /><em>Surprising results.</em>
          </h2>
          <p className={styles.body}>
            Great design doesn't happen by accident. Our four-step process removes guesswork and builds confidence at every stage.
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((s) => (
            <div key={s.n} className={styles.step}>
              <span className={styles.stepNum}>{s.n}</span>
              <div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepBody}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
