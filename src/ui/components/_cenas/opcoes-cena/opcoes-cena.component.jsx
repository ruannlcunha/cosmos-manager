import "./opcoes-cena.style.css";
import { ICONS } from "../../../../constants/images";
import { useNavigate } from "react-router-dom";
import { useSound } from "../../../../hook";

export function OpcoesCena({ campanhaId, zoom, setZoom, hudAtivo, setHudAtivo, style }) {
  const navigate = useNavigate();
  const { playHover } = useSound()

  function _aumentarZoom(zoom, setZoom) {
    zoom !== 100 ? setZoom(zoom + 10) : null;
  }

  function _diminuirZoom(zoom, setZoom) {
    zoom !== 50 ? setZoom(zoom - 10) : null;
  }

  function handleHUD() {
    hudAtivo ? setHudAtivo(false) : setHudAtivo(true);
  }

  function handleEscape() {
    navigate(`/campanha/${campanhaId}?menu=4`);
  }

  function handleDiminuirZoom() {
    _diminuirZoom(zoom, setZoom);
  }

  function handleAumentarZoom() {
    _aumentarZoom(zoom, setZoom);
  }

  return (
    <div className="opcoes-cena" style={style}>

      {campanhaId ? <button onClick={handleEscape} style={{ backgroundImage: `url(${ICONS.ESCAPE.src})` }}></button>: null}

      <button
        onMouseEnter={() => playHover(1)}
        onClick={handleHUD}
        style={{
          backgroundImage: `url(${hudAtivo ? ICONS.HUD.src : ICONS.HUD_OFF.src})`
        }}
      ></button>
      {zoom ?
        <>
          <button
            onMouseEnter={() => playHover(1)}
            style={{ backgroundImage: `url(${ICONS.ZOOM_OUT.src})` }}
            onClick={zoom > 50 ? handleDiminuirZoom : null}
            className={zoom <= 50 ? "opcao-bloqueada" : null}
          ></button>

          <h3>{zoom}%</h3>

          <button
            onMouseEnter={() => playHover(1)}
            style={{ backgroundImage: `url(${ICONS.ZOOM_IN.src})` }}
            onClick={zoom < 100 ? handleAumentarZoom : null}
            className={zoom >= 100 ? "opcao-bloqueada" : null}
          ></button>
        </>
      : null}
    </div>
  );
}
