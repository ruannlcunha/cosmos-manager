import { useEffect, useState } from "react"
import { ICONS } from "../../../constants"
import { BackButton, CampanhaCena, CampanhaInformacoes, CampanhaPersonagens, ContainerScreen, FichaGrupo, Imagem } from "../../components"
import "./campanha.style.css"
import { useVisualizarCampanha } from "../../../hook/api/campanha/visualizar-campanha.api"
import { useParams, useSearchParams } from "react-router-dom"
import useGlobalUser from "../../../context/user/global-user.context"
import { useSocket } from "../../../hook"

export function CampanhaScreen() {
    const [menuEscolhido, setMenuEscolhido] = useState(1)
    const { campanhaId } = useParams();
    const [user] = useGlobalUser()
    const { socket } = useSocket();
    const { campanha, setCampanha, visualizarCampanha } = useVisualizarCampanha();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const menu = searchParams.get("menu");
        setMenuEscolhido(Number(menu))
    }, [])

    useEffect(() => {
        visualizarCampanha(campanhaId, user.id);
        socket.on("campanhas", async () => {
            visualizarCampanha(campanhaId, user.id)
        });

    }, [campanhaId, menuEscolhido]);

    function handleEscolherMenu(id) {
        setMenuEscolhido(id)
    }

    function renderOption(id, icon, text) {
        return (
            <li className={`campanha-option${menuEscolhido === id ? " escolhido" : ""}`} onClick={() => handleEscolherMenu(id)}>
                <Imagem data={icon} />
                {text}
            </li>
        )
    }

    return campanha ? (
        <ContainerScreen>
            <BackButton navigateTo={"/home/campanhas"} />
            <div className="campanha-screen">
                <div className="campanha-options">
                    <h1>
                        <Imagem data={ICONS.CAMPANHA} />
                        Campanha
                    </h1>
                    <ul>
                        {renderOption(1, ICONS.INFORMACAO, "Informações")}
                        {renderOption(2, ICONS.PERSONAGENS, "Personagens")}
                        {renderOption(3, ICONS.PERGAMINHO, "Ficha de Grupo")}
                        {renderOption(4, ICONS.CAMERA, "Cena")}
                    </ul>
                </div>

                <div className="campanha-menu">
                    {
                        menuEscolhido === 1 ? <CampanhaInformacoes campanha={campanha} /> :
                            menuEscolhido === 2 ? <CampanhaPersonagens campanha={campanha} /> :
                                menuEscolhido === 3 ? <FichaGrupo campanha={campanha} setCampanha={setCampanha} /> :
                                    menuEscolhido === 4 ? <CampanhaCena campanha={campanha} /> :
                                        null
                    }
                </div>
            </div>
        </ContainerScreen>
    ) : null;

}