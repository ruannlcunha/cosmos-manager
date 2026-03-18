import "./modal-config.style.css";
import { Modal } from "../modal/modal.component";
import { useEffect, useState } from "react";
import { CONTEXT_CONFIG_NAMES } from "../../../constants";
import { useMusic, useSound } from "../../../hook";
import { ICONS } from "../../../constants/images";
import { useNavigate } from "react-router-dom";
import useGlobalUser from "../../../context/user/global-user.context";
import userInicial from "../../../context/user/user_inicial.json"

export function ModalConfig({ isOpen, setIsOpen }) {
  const [efeitosVolume, setEfeitosVolume] = useState(10);
  const [musicaVolume, setMusicaVolume] = useState(10);
  const [user, setUser] = useGlobalUser();
  const { playClick } = useSound();
  const { restartMusic } = useMusic();
  const navigate = useNavigate();

  useEffect(() => {
    if(user) {
      setEfeitosVolume(user.configuracoes[CONTEXT_CONFIG_NAMES.SOM_EFEITOS]);
      setMusicaVolume(user.configuracoes[CONTEXT_CONFIG_NAMES.SOM_MUSICA]);
    }
  }, [user]);

  function handleDiminuir(configName, volume, setVolume) {
    playClick(1);
    if (volume > 0) {
      setVolume(volume - 1);
      setUser({
        ...user,
        configuracoes: {
          ...user.configuracoes,
          [configName]: volume - 1
        }
      });
    }
    configName === "somMusica" ? restartMusic(volume - 1) : null;
  }

  function handleAumentar(configName, volume, setVolume) {
    playClick(1);
    if (volume < 10) {
      setVolume(volume + 1);
      setUser({
        ...user,
        configuracoes: {
          ...user.configuracoes,
          [configName]: volume + 1
        }
      });
    }
    configName === "somMusica" ? restartMusic(volume + 1) : null;
  }

  function handleLogout() {
    setUser(userInicial)
    navigate("/")
  }

  function selectVolumeIcon(volume) {
    if (volume <= 10 && volume >= 7) return ICONS.VOLUME_ALTO;
    if (volume <= 6 && volume >= 4) return ICONS.VOLUME_MEDIO;
    if (volume <= 3 && volume >= 1) return ICONS.VOLUME_BAIXO;
    if (volume === 0) return ICONS.VOLUME_MUTADO;
    return ICONS.VOLUME_ALTO;
  }

  function renderOption(text, configName, volume, setVolume) {
    let _volumeIcon = selectVolumeIcon(volume);

    return (
      <li>
        {text}
        <div className="config-volume">
          <img src={_volumeIcon} alt="" />
          <button onClick={volume > 0 ? () => handleDiminuir(configName, volume, setVolume) : null}>-</button>
          <h2>{volume}</h2>
          <button onClick={volume < 10 ? () => handleAumentar(configName, volume, setVolume) : null}>+</button>
        </div>
      </li>
    );
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="config">
        {/* <h1>Configurações de Som</h1>
        <ul>
          {renderOption("Volume de Efeitos Sonoros", CONTEXT_CONFIG_NAMES.SOM_EFEITOS, efeitosVolume, setEfeitosVolume)}
          {renderOption("Volume de Músicas", CONTEXT_CONFIG_NAMES.SOM_MUSICA, musicaVolume, setMusicaVolume)}
        </ul> */}
        <h1>Outros</h1>
        <ul>
          <button onClick={handleLogout}>Logout</button>
        </ul>
      </div>
    </Modal>
  );
}
