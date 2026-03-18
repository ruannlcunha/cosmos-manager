import { useNavigate } from "react-router-dom"
import { AlterarCenaModal, BotaoPrimario, Imagem, Modal } from "../../"
import "./campanha-cena.style.css"
import { ICONS, USER_ROLE } from "../../../../constants"
import { useEffect, useState } from "react"
import { useAlterarCena } from "../../../../hook/api/campanha/alterar-cena.api"
import useGlobalUser from "../../../../context/user/global-user.context"

export function CampanhaCena({ campanha }) {
    const navigate = useNavigate()
    const [cenaExibida, setCenaExibida] = useState(null)
    const [gerenciarCenasModal, setGerenciarCenasModal] = useState(false)
    const [cenaModal, setCenaModal] = useState(false)
    const [cenaEscolhida, setCenaEscolhida] = useState(null)
    const [user] = useGlobalUser()
    const { alterarCena } = useAlterarCena()

    useEffect(() => {
        const _cenaExibida = campanha.cenas.find(cena => cena.exibindo)
        setCenaExibida(_cenaExibida ? _cenaExibida : null) 
        
    }, [campanha])

    function handleEntrarCena(cena) {
        if(cena) {
            navigate(`/campanha/${campanha.id}/cena/${cena.id}`)
        }
    }

    async function handleEsconderCena(cena) {
        await alterarCena(campanha.id, cena.id, {exibindo: false})
    }

    async function handleExibirCena(cena) {
        if(cenaExibida) {
            await alterarCena(campanha.id, cenaExibida.id, {exibindo: false})
        }
        await alterarCena(campanha.id, cena.id, {exibindo: true})
    }

    function handleAlterarCena(cena) {
        setCenaEscolhida(cena)
        setCenaModal(true)
    }

    function handleCriarCena() {
        setCenaModal(true)
    }

    function renderCenaCard(cena) {
        const _cenaExibida = cenaExibida ? cenaExibida : {id: null}
        return (
            <div className="cena-card">
                <header><h1>Cena: {cena.nome}</h1></header>
                <section style={cena.fundo ? { backgroundImage: `url(${cena.fundo.dataUri})` } : null}>
                    {cena.id === _cenaExibida.id ?
                    <Imagem data={ICONS.CAMERA} />
                    :null}
                </section>
                <footer>
                    <BotaoPrimario onClick={()=>handleEntrarCena(cena)}>
                        Ver
                    </BotaoPrimario>
                    <BotaoPrimario onClick={()=>handleAlterarCena(cena)}>
                        Alterar
                    </BotaoPrimario>
                    <BotaoPrimario onClick={cena.id === _cenaExibida.id ? ()=>handleEsconderCena(cena) : ()=>handleExibirCena(cena)}>
                        {cena.id === _cenaExibida.id ? "Esconder" : "Exibir"}
                    </BotaoPrimario>
                </footer>
            </div>
        )
    }
    
    return campanha ? (
        <div className="campanha-cena-container">
            <div className="cena-menu">
                <header className="cena-header">
                    <h1>CENA</h1>
                </header>
                <section>
                    <h1>Cena em exibição:</h1>
                    <div className={`cena-exibicao-container${cenaExibida ? " exibindo" : ""}`}>
                        <Imagem data={ICONS.CAMERA} />
                        <div className="cena-container">
                            <header>
                                {cenaExibida ? <h2>Cena: {cenaExibida.nome}</h2> : null}
                            </header>
                            <section>
                            <div className="cena-exibida" style={cenaExibida && cenaExibida.fundo ? { backgroundImage: `url(${cenaExibida.fundo.dataUri})` } : null}>
                                {!cenaExibida ? <h3>Nenhuma cena está sendo exibida.</h3> : null}
                            </div>
                            </section>
                        </div>
                    </div>
                    <BotaoPrimario onClick={()=>handleEntrarCena(cenaExibida)} ativo={cenaExibida}>
                        Entrar na cena
                    </BotaoPrimario>
                    {user.role === USER_ROLE.ADM ?
                    <BotaoPrimario onClick={()=>setGerenciarCenasModal(true)}>
                        Gerenciar cenas
                    </BotaoPrimario>
                    :null}
                </section>
            </div>

            <Modal isOpen={gerenciarCenasModal} setIsOpen={setGerenciarCenasModal}>
                <div className="gerenciar-cenas-modal">
                    <header><h1>Gerenciar Cenas</h1></header>
                    <section>
                        {
                            campanha.cenas
                            .sort(function (a, b) { return b.exibindo - a.exibindo; })
                            .map(cena=> {
                                return renderCenaCard(cena)
                            })
                        }
                    </section>
                    <footer>
                        <BotaoPrimario onClick={handleCriarCena}>Criar Cena</BotaoPrimario>
                    </footer>
                </div>
            </Modal>

            <AlterarCenaModal
            campanhaId={campanha.id}
            cena={cenaEscolhida}
            setCena={setCenaEscolhida}
            isOpen={cenaModal}
            setIsOpen={setCenaModal}
            isRemovivel={true}
            />
        </div >
    ) : null
}