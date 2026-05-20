import styles from './Work.module.css'

const projects = [
  { id: '01', title: 'Verdant', category: 'Brand Identity', color: '#2D4A3E' },
  { id: '02', title: 'Halcyon', category: 'Visual System', color: '#3A2D4A' },
  { id: '03', title: 'Crest & Co.', category: 'Packaging + Web', color: '#4A3A2D' },
  { id: '04', title: 'Solène', category: 'Art Direction', color: '#2D3A4A' },
]

export default function Work() {
  return (
    <section id="work" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Selected Work</span>
        <h2 className={styles.title}>Projects that moved the needle.</h2>
      </div>

      <div className={styles.grid}>
        {projects.map((p) => (
          <article key={p.id} className={styles.card}>
            <div className={styles.thumb} style={{ background: p.color }}>
              <span className={styles.num}>{p.id}</span>
            </div>
            <div className={styles.info}>
              <h3 className={styles.projectTitle}>{p.title}</h3>
              <p className={styles.category}>{p.category}</p>
            </div>
            <span className={styles.arrow}>→</span>
          </article>
        ))}
      </div>
    </section>
  )
}
