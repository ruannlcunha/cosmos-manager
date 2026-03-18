import { SOUNDS } from "../../../constants/audios/sounds.constant";
import { CONTEXT_CONFIG_NAMES } from "../../../constants";
import useGlobalUser from "../../../context/user/global-user.context";
import { useEffect, useState } from "react";

export function useSound() {
    const [user] = useGlobalUser();
    const [volumeEfeitos, setVolumeEfeitos] = useState(0.1)

    useEffect(() => {
        if (user) {
            const volume = Number(user.configuracoes[CONTEXT_CONFIG_NAMES.SOM_EFEITOS]) * 0.1
            setVolumeEfeitos(volume)
        }
    }, [user])

    function playSound(audio) {
        const novoAudio = new Audio(audio);
        novoAudio.volume = volumeEfeitos;
        //novoAudio.play();
    }

    function playHover(id) {
        const audio = new Audio(SOUNDS[`HOVER_${id}`]);
        audio.volume = volumeEfeitos;
        //audio.play();
    }

    function playClick(id) {
        const audio = new Audio(SOUNDS[`CLICK_${id}`]);
        audio.volume = volumeEfeitos;
        //audio.play();
    }

    function playBanner() {
        const audio = new Audio(SOUNDS.BANNER);
        audio.volume = volumeEfeitos;
        //audio.play();
    }

    function playDado() {
        const audio = new Audio(SOUNDS.DADO);
        audio.volume = volumeEfeitos;
        //audio.play();
    }

    function playDadoResultado() {
        const audio = new Audio(SOUNDS.DADO_RESULTADO);
        audio.volume = volumeEfeitos;
        //audio.play();
        return audio;
    }

    function playCancel() {
        const audio = new Audio(SOUNDS.CANCEL);
        audio.volume = volumeEfeitos;
        //audio.play();
    }

    function playBook() {
        const audio = new Audio(SOUNDS.BOOK);
        audio.volume = volumeEfeitos;
        //audio.play();
    }

    return {
        playSound,
        playHover,
        playClick,
        playBanner,
        playDado,
        playDadoResultado,
        playCancel,
        playBook
    };
}
