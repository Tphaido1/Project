import styles from './Footer.module.css'

export default function Footer() {
  return (
    <>
      <section id="contact" className={styles.cta}>
        <span className={styles.label}>Ready to begin?</span>
        <h2 className={styles.ctaTitle}>
          Let's build something<br /><em>worth talking about.</em>
        </h2>
        <a href="mailto:hello@forma.studio" className={styles.email}>
          hello@forma.studio →
        </a>
      </section>

      <footer className={styles.footer}>
        <span className={styles.logo}>Forma</span>
        <p className={styles.copy}>© 2024 Forma Studio. All rights reserved.</p>
        <div className={styles.socials}>
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
        </div>
      </footer>
    </>
  )
}
