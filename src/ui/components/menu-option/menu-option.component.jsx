import { useNavigate } from "react-router-dom";
import { useSound } from "../../../hook";
import "./menu-option.style.css";

export function MenuOption({ icon, text, navigateTo, onClick, onEnter, onLeave }) {
  const { playClick, playHover } = useSound();
  const navigate = useNavigate();

  function handleClick() {
    playClick(2);
    onClick ? onClick() : null;
    navigateTo ? navigate(navigateTo) : null;
  }

  function handleEnter() {
    onEnter ? onEnter() : null;
    playHover(1);
  }

  return (
    <li className="menu-option" onMouseEnter={handleEnter} onMouseLeave={onLeave} onClick={handleClick}>
      <img src={icon} alt={`Símbolo de ${text}`} />
      {text}
    </li>
  );
}
