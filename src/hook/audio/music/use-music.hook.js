import { useEffect, useState } from "react";
import { CONTEXT_CONFIG_NAMES } from "../../../constants";
import useGlobalUser from "../../../context/user/global-user.context";

export function useMusic() {
  const [user] = useGlobalUser();
  const [volumeMusica, setVolumeMusica] = useState(0.1)
  
    useEffect(()=>{
      if(user) { 
        setVolumeMusica(user.configuracoes[CONTEXT_CONFIG_NAMES.SOM_MUSICA] / 10)
      }
    },[user])

  function startMusic(loop) {
    const audioContext = new AudioContext();

    const audioElement = document.querySelector("audio");
    audioElement.volume = volumeMusica;
    audioElement.loop = loop;

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    //audioElement.play();
  }

  function restartMusic(novoVolume) {
    const audioElement = document.querySelector("audio");
    audioElement.pause();
    audioElement.volume = novoVolume / 10;
    //audioElement.play();
  }

  return { restartMusic, startMusic };
}
