import "./start.style.css";
import { useEffect, useState } from "react";
import { AudioContainer, BotaoPrimario, ContainerScreen, Imagem, ModalConfig } from "../../components";
import { useMusic, useSound } from "../../../hook";
import { MUSICS } from "../../../constants/audios/musics.constant";
import { useNavigate } from "react-router-dom";
import useGlobalUser from "../../../context/user/global-user.context";
import { ICONS } from "../../../constants";
import { IMAGES } from "../../../constants/images";
import { useVerificarConexao } from "../../../hook/api/_base/verificar-conexao.api";

export function StartScreen() {
  const { playHover, playClick } = useSound();
  const { startMusic } = useMusic();
  const navigate = useNavigate();
  const [user, setUser] = useGlobalUser();
  const [aviso, setAviso] = useState(true);
  const [configIsOpen, setConfigIsOpen] = useState(false);
  const { conexao, verificarConexao } = useVerificarConexao()

  useEffect(() => {
    verificarConexao()
  }, [])

  function handleAviso() {
    playClick(2);
    setAviso(false);
    startMusic(true);
  }

  function handleModoOnline() {
    playClick(2);
    navigate("/login");
  }

  function handleModoOffline() {
    playClick(2);
    navigate("/offline");
  }

  function handleConfig() {
    playClick(2);
    setConfigIsOpen(true);
  }


  function renderTelaAviso() {
    return (
      <div className="start-aviso">
        <p>
          <span>AVISO:</span>
          Este é um projeto pessoal apenas para fins de diversão entre amigos. Nenhuma imagem ou som é de minha autoria.
          <br />
          <span>Continuar?</span>
        </p>
        <button onMouseEnter={() => playHover(1)} onClick={handleAviso}>
          Sim
        </button>
      </div>
    );
  }

  return (
    <ContainerScreen style={{ backgroundColor: "var(--black)" }}>
      <AudioContainer audio={MUSICS.TEMA_1} />
      {aviso ? (
        renderTelaAviso()
      ) : (
        <div className="start-screen">
          <Imagem data={IMAGES.TITLE} />
          <div style={user.nome ? { bottom: "3rem" } : null}>
            <BotaoPrimario onClick={handleModoOnline} ativo={conexao.result}>Login</BotaoPrimario>
            {/* <BotaoPrimario onClick={handleModoOffline}>Modo Offline</BotaoPrimario> */}
            {/* <BotaoPrimario onClick={handleConfig}>Configuracoes</BotaoPrimario> */}
          </div>
        </div>
      )}
      <ModalConfig isOpen={configIsOpen} setIsOpen={setConfigIsOpen} />
    </ContainerScreen>
  );
}
