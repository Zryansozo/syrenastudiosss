import styles from './ServiceCard.module.css';

export default function ServiceCard({ icon: Icon, title, description, index = 0 }) {
  return (
    <div className={styles.card} style={{ '--i': index }}>
      <div className={styles.iconWrap}>
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{description}</p>
      <div className={styles.number}>{String(index + 1).padStart(2, '0')}</div>
    </div>
  );
}
