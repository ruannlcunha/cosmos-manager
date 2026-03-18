import "./header.style.css";
import { HeaderOption, Imagem, ModalConfig } from "../";
import { useSound } from "../../../hook";
import { useEffect, useState } from "react";
import { ICONS, IMAGES } from "../../../constants/images";
import { useNavigate } from "react-router-dom";
import useGlobalUser from "../../../context/user/global-user.context";
import { USER_ROLE } from "../../../constants";

export function Header({ idSelected }) {
  const navigate = useNavigate();
  const { playClick, playHover } = useSound();
  const [configIsOpen, setConfigIsOpen] = useState(false);
  const [user] = useGlobalUser()

  function handleHome() {
    playClick(1);
    navigate("/home");
  }

  function handleConfig() {
    playClick(2);
    setConfigIsOpen(true);
  }

  return (
    <>
      <header className="header">
        <section className="header-top">
          <Imagem data={IMAGES.TITLE} className={"header-logo"}/>

          <ul>
            <HeaderOption key={1} navigateTo={"/home/personagens"} isSelected={idSelected === 1 ? true : false} symbol={ICONS.PERSONAGENS} text={"Personagens"} />
            <HeaderOption key={2} navigateTo={"/home/campanhas"} isSelected={idSelected === 2 ? true : false} symbol={ICONS.CAMPANHA} text={"Campanhas"} />
            {user.role === USER_ROLE.ADM ?
            <HeaderOption key={3} navigateTo={"/home/adm"} isSelected={idSelected === 3 ? true : false} symbol={ICONS.COROA} text={"Administrador"} />
            :null}
          </ul>
          <button onClick={handleConfig} className="header-config">
            <Imagem data={ICONS.CONFIGURACAO}/>
          </button>
        </section>
        <section className="header-bottom"></section>
      </header>
      <ModalConfig isOpen={configIsOpen} setIsOpen={setConfigIsOpen} />
    </>
  );
}
