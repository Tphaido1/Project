import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.tag}>Design Studio — Est. 2024</div>

      <h1 className={styles.headline}>
        We craft brands<br />
        <em>worth remembering.</em>
      </h1>

      <p className={styles.sub}>
        Strategic identity design for founders, startups,<br />
        and companies ready to mean something.
      </p>

      <div className={styles.actions}>
        <a href="#work" className={styles.primary}>See our work</a>
        <a href="#process" className={styles.secondary}>How it works</a>
      </div>

      <div className={styles.marqueeWrapper} aria-hidden="true">
        <div className={styles.marquee}>
          {Array(3).fill(['Brand Identity', 'Visual Systems', 'Motion Design', 'Art Direction', 'Web Design', 'Packaging']).flat().map((item, i) => (
            <span key={i} className={styles.marqueeItem}>{item} <span className={styles.dot}>◆</span></span>
          ))}
        </div>
      </div>
    </section>
  )
}
