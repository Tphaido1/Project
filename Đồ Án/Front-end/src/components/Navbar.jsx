import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <a href="#" className={styles.logo}>Forma</a>
      <ul className={styles.links}>
        <li><a href="#work">Work</a></li>
        <li><a href="#process">Process</a></li>
        <li><a href="#pricing">Pricing</a></li>
      </ul>
      <a href="#contact" className={styles.cta}>Get in touch →</a>
    </nav>
  )
}
