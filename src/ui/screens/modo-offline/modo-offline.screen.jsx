import "./modo-offline.style.css"
import { BackButton, BotaoPrimario, ContainerScreen, Imagem } from "../../components"
import { useNavigate } from "react-router-dom";
import { ICONS } from "../../../constants";
import { useEffect } from "react";
import useGlobalDataOffline from "../../../context/data-offline/global-data-offline.context";
import dataOfflineInicial from "../../../context/data-offline/data_offline_inicial.json";
import { useSound, useToast } from "../../../hook";

export function ModoOfflineScreen() {
    const navigate = useNavigate();
    const { playClick, playHover } = useSound()
    const { toastSuccess, toastError } = useToast();
    const [dataOffline, setDataOffline] = useGlobalDataOffline();

    useEffect(() => {
    }, [])

    function handleAcessarFicha() {
        navigate("/offline/personagem")
    }

    function handleNovoPersonagem() {
        setDataOffline({ ...dataOffline, personagem: dataOfflineInicial.personagem })
        toastSuccess("Um personagem novo foi criado!")
    }

    function handleChangePersonagem(e) {
        try {
            const fileReader = new FileReader();
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = (e) => {
                const json = JSON.parse(e.target.result);
                setDataOffline({ ...dataOffline, personagem: json })
                toastSuccess("Seu personagem foi carregado com sucesso!")
            };
        } catch (error) {
            toastError(error)
        }
    }

    return (
        <ContainerScreen>
            <BackButton navigateTo={"/"} />
            <div className="modo-offline-screen">
                <Imagem data={ICONS.LOGO} />
                <div className="opcoes-container" onSubmit={() => { }}>
                    <header>
                        <h1>Modo Offline</h1>
                    </header>
                    <section>
                        <BotaoPrimario onClick={handleAcessarFicha}>Acessar Ficha</BotaoPrimario>
                        <BotaoPrimario onClick={handleNovoPersonagem}>Novo Personagem</BotaoPrimario>
                        <BotaoPrimario>
                            <label htmlFor={"personagemFile"} onMouseEnter={() => playHover(1)}>
                                Carregar Jogo
                            </label>
                        </BotaoPrimario>
                        <input id="personagemFile" name="personagemFile" type="file" onChange={handleChangePersonagem} accept=".json" hidden />
                    </section>
                </div>
            </div>
        </ContainerScreen>
    )

}