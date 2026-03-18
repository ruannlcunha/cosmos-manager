import "./stream-cena.style.css"
import { useEffect, useState } from "react"
import { CenaBatalha, CenaCenario, CenaDialogo, CenaLoja, ContainerScreen, Imagem, OpcoesCena } from "../../components"
import { useParams } from "react-router-dom"
import { useVisualizarCena } from "../../../hook/api/campanha/visualizar-cena.api"
import { CENAS_TIPO, ICONS } from "../../../constants"
import { useSocket } from "../../../hook"
import { useListarCenaObjetos } from "../../../hook/api/campanha/listar-cena-objetos.api"
import { useVisualizarCampanha } from "../../../hook/api/campanha/visualizar-campanha.api"

export function StreamCenaScreen() {
    const [zoom, setZoom] = useState(100)
    const [hudAtivo, setHudAtivo] = useState(true)
    const { campanhaId } = useParams()
    const { visualizarCampanha } = useVisualizarCampanha()
    const [cena, setCena] = useState(null)
    const { cenaObjetos, setCenaObjetos, listarCenaObjetos } = useListarCenaObjetos()
    const { socket } = useSocket();

    useEffect(() => {
        fetchData()
        socket.on("campanhas", async () => {
            fetchData()
        });
    }, [campanhaId]);

    async function fetchData() {
        const campanha = await visualizarCampanha(campanhaId, 1)
        const _cena = campanha.cenas.find(_cenaData => _cenaData.exibindo)
        if (_cena) {
            setCena(_cena)
            await listarCenaObjetos(campanhaId, _cena.id);
        }
        else {
            setCena(null)
            setCenaObjetos([])
        }
    }

    return (
        <ContainerScreen style={{ backgroundColor: "var(--black)", justifyContent: "center"}}>
            {cena?
                <>
                    <OpcoesCena hudAtivo={hudAtivo} setHudAtivo={setHudAtivo} style={{opacity: "25%"}}/>
                    <div className="cena-screen">
                        <div className="cena-container" style={{ width: `${zoom}%`, height: `${zoom}%` }}>
                            {
                                cena.tipo === CENAS_TIPO.BATALHA ? <CenaBatalha cena={cena} cenaObjetos={cenaObjetos} hudAtivo={hudAtivo} />
                                    : cena.tipo === CENAS_TIPO.LOJA ? <CenaLoja cena={cena} cenaObjetos={cenaObjetos} hudAtivo={hudAtivo} />
                                        : cena.tipo === CENAS_TIPO.CENARIO ? <CenaCenario cena={cena} cenaObjetos={cenaObjetos} hudAtivo={hudAtivo} />
                                            : cena.tipo === CENAS_TIPO.DIALOGO ? <CenaDialogo cena={cena} cenaObjetos={cenaObjetos} hudAtivo={hudAtivo} />
                                                : null}
                        </div>
                    </div>
                </>
            : <Imagem data={ICONS.CAMERA} className={"cena-desativada-icon"}/> }
        </ContainerScreen>
    )
}