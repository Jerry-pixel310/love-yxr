function ChapterDivider({ id, kicker, title, text }) {
  return (
    <section id={id} className="chapter-divider fade-in-scroll">
      <span className="chapter-kicker">{kicker}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  )
}

export default ChapterDivider
