import { useEffect, useState } from "react"
import { AlterarCenaModal, BotaoPrimario, CenaBatalha, CenaCenario, CenaDialogo, CenaLoja, ConfigCenaBatalha, ConfigCenaCenario, ConfigCenaDialogo, ConfigCenaLoja, ContainerScreen, Imagem, Modal, OpcoesCena } from "../../components"
import "./cena.style.css"
import { useNavigate, useParams } from "react-router-dom"
import { useVisualizarCena } from "../../../hook/api/campanha/visualizar-cena.api"
import { CENAS_TIPO, ICONS, USER_ROLE } from "../../../constants"
import { useSocket } from "../../../hook"
import useGlobalUser from "../../../context/user/global-user.context"
import { useListarCenaObjetos } from "../../../hook/api/campanha/listar-cena-objetos.api"
import { useAlterarCena } from "../../../hook/api/campanha/alterar-cena.api"
import { useListarCenas } from "../../../hook/api/campanha/listar-cenas.api"

export function CenaScreen() {
    const [zoom, setZoom] = useState(100)
    const [hudAtivo, setHudAtivo] = useState(true)
    const [permissaoCena, setPermissaoCena] = useState(false)
    const { campanhaId, cenaId } = useParams()
    const { cenas, listarCenas } = useListarCenas()
    const { cena, visualizarCena } = useVisualizarCena()
    const { cenaObjetos, listarCenaObjetos } = useListarCenaObjetos()
    const { socket } = useSocket();
    const [gerenciarCenaModal, setGerenciarCenaModal] = useState(false)
    const [alterarCenaModal, setAlterarCenaModal] = useState(false)
    const { alterarCena } = useAlterarCena()
    const navigate = useNavigate()
    const [user] = useGlobalUser()

    useEffect(() => {
        fetchCena()
        socket.on("campanhas", async () => {
            fetchCena()
        });

    }, [campanhaId, cenaId]);

    useEffect(() => {
        if(cena) {
            verificarPermissaoCena()
        }
    }, [cena, user]);

    async function fetchCena() {
        await visualizarCena(campanhaId, cenaId);
        await listarCenaObjetos(campanhaId, cenaId);
        await listarCenas(campanhaId);
    }

    function verificarPermissaoCena() {
        if (!cena.exibindo && user.role !== USER_ROLE.ADM) {
            navigate(`/campanha/${campanhaId}?menu=4`);
            return
        }
        setPermissaoCena(true)
    }

    async function handleExibirCena() {
        const cenaExibida = cenas.find(_cena => _cena.exibindo)
        if(cenaExibida) {
            await alterarCena(campanhaId, cenaExibida.id, { exibindo: false })
        }
        await alterarCena(campanhaId, cenaId, { exibindo: true })
    }

    async function handleEsconderCena() {
        await alterarCena(campanhaId, cenaId, { exibindo: false })
    }

    function renderGerenciarCenaBotao() {
        return user.role === USER_ROLE.ADM ? (
            <button className="gerenciar-cena-button" onClick={() => setGerenciarCenaModal(true)}>
                <Imagem data={ICONS.CAMERA} />
                <h1>Gerenciar Cena</h1>
                <Imagem data={ICONS.COROA} />
            </button>
        ) : null
    }

    return permissaoCena ?(
        <ContainerScreen>
            <OpcoesCena campanhaId={campanhaId} zoom={zoom} setZoom={setZoom} hudAtivo={hudAtivo} setHudAtivo={setHudAtivo} />
            {renderGerenciarCenaBotao()}
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
            <Modal isOpen={gerenciarCenaModal} setIsOpen={setGerenciarCenaModal}>
                <div className="gerenciar-cena-modal">
                    <header><h1>Gerenciar cena</h1></header>
                    <section>
                        <table>
                            <tbody>
                                <tr>
                                    <th><h1>Cena:</h1></th>
                                    <td>
                                        <div>
                                            <Imagem data={ICONS.COROA} />
                                            <BotaoPrimario onClick={() => setAlterarCenaModal(true)}>Alterar</BotaoPrimario>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Imagem data={ICONS.CAMERA} style={!cena.exibindo ? {opacity: "25%"}:null}/>
                                            {cena.exibindo ? <BotaoPrimario onClick={handleEsconderCena}>Esconder</BotaoPrimario>
                                                : <BotaoPrimario onClick={handleExibirCena}>Exibir</BotaoPrimario>}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {
                            cena.tipo === CENAS_TIPO.BATALHA ? <ConfigCenaBatalha campanhaId={campanhaId} cenaId={cenaId} cenaObjetos={cenaObjetos} />
                            : cena.tipo === CENAS_TIPO.LOJA ? <ConfigCenaLoja campanhaId={campanhaId} cenaId={cenaId} cenaObjetos={cenaObjetos} />
                            : cena.tipo === CENAS_TIPO.CENARIO ? <ConfigCenaCenario campanhaId={campanhaId} cenaId={cenaId} cenaObjetos={cenaObjetos} />
                            : cena.tipo === CENAS_TIPO.DIALOGO ? <ConfigCenaDialogo campanhaId={campanhaId} cenaId={cenaId} cenaObjetos={cenaObjetos} />
                           : null
                        }
                    </section>
                </div>
            </Modal>
            <AlterarCenaModal
                isOpen={alterarCenaModal}
                setIsOpen={setAlterarCenaModal}
                campanhaId={campanhaId}
                cena={cena}
                setCena={() => { }}
                isRemovivel={false}
            />
        </ContainerScreen>
    ) : null
}