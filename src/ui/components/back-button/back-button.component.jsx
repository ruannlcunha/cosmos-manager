import "./back-button.style.css";
import { useSound } from "../../../hook";
import { useNavigate } from "react-router-dom";

export function BackButton({ navigateTo, onClick }) {
  const navigate = useNavigate();
  const { } = useSound();

  function handleClick() {
    navigateTo ? navigate(navigateTo) : navigate(-1);
  }

  return (
    <button className={"back-button"} onClick={onClick ? onClick : handleClick}>
      Voltar
    </button>
  );
}
