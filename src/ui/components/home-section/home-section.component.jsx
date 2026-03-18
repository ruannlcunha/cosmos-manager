import "./home-section.style.css";

export function HomeSection({ titulo, icon, children }) {
  return (
    <section className="home-section">
      <div className="menu-options">
        <h1>
          <img src={icon} alt={`Símbolo de ${titulo}`} />
          {titulo}
        </h1>
        <ul>{children}</ul>
      </div>
    </section>
  );
}
