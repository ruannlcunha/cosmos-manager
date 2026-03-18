import "./botao-primario.style.css";

export function BotaoPrimario({ children, onClick, className, style, ativo }) {

  return (
    <button onClick={ativo ? onClick : null} style={style} className={`${ativo ? "botao-primario" : "botao-primario-desativado"}${className? ` ${className}` : ""}`}>
      {children}
    </button>
  );
}

BotaoPrimario.defaultProps = {
  ativo: true
};
