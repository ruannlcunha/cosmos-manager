import "./visuais-modal.style.css"
import { useEffect, useState } from "react";
import { BotaoPrimario } from "../botao-primario/botao-primario.component"
import { Modal } from "../modal/modal.component"
import { Imagem } from "../imagem/imagem.component";
import { ICONS, USER_ROLE } from "../../../constants";
import { useAlterarVisualVisibilidade } from "../../../hook/api/personagem/alterar-visual-visibilidade.api";
import { useAlterarVisualAtivo } from "../../../hook/api/personagem/alterar-visual-ativo.api";
import { IMAGES } from "../../../constants/images";
import useGlobalUser from "../../../context/user/global-user.context";
import { useForm } from "../../../hook";
import { useDesbloquearVisual } from "../../../hook/api/personagem/desbloquear-visual.api";

export function VisuaisModal({ personagem, setPersonagem, isOpen, setIsOpen, modoOffline }) {
    const [visuais, setVisuais] = useState({ array: [], ativo: null, escolhido: null })
    const [codigoModal, setCodigoModal] = useState(false)
    const [user] = useGlobalUser()
    const { formData, setFormData, handleChange } = useForm({ codigo: "" });
    const { alterarVisualVisibilidade } = useAlterarVisualVisibilidade();
    const { alterarVisualAtivo } = useAlterarVisualAtivo();
    const { desbloquearVisual } = useDesbloquearVisual();

    useEffect(() => {
        setFormData({ codigo: "" })
        if (personagem) {
            const _visuais = user.role === USER_ROLE.ADM ? personagem.visuais : personagem.visuais.filter(vis => vis.visivel)
            setVisuais({
                array: [..._visuais.sort(function (a, b) {
                    return a.id - b.id;
                })],
                ativo: { ...personagem.visualAtivo },
                escolhido: { ...personagem.visualAtivo },
            })
        }
    }, [personagem, isOpen])

    useEffect(() => {
        setFormData({ codigo: "" })
    }, [codigoModal])

    function handleCancelar() {
        setIsOpen(false)
    }

    async function handleSalvar() {
        if (!modoOffline) alterarVisualAtivo(personagem.id, visuais.escolhido.id)
        setPersonagem({ ...personagem, visualAtivo: visuais.escolhido })
        setIsOpen(false)
    }

    async function handleCadeado(visual) {
        const novaVisibilidade = visual.visivel ? false : true
        const novosVisuais = [
            ...personagem.visuais.filter(_visual => _visual.id !== visual.id),
            { ...visual, visivel: novaVisibilidade }
        ].sort(function (a, b) { return a.id - b.id; })

        alterarVisualVisibilidade(visual.id, novaVisibilidade)
        setVisuais({ ...visuais, array: novosVisuais })
        setPersonagem({ ...personagem, visuais: novosVisuais })
    }

    async function handleDesbloquearVisual() {
        const visuaisIds = await desbloquearVisual(personagem.id, formData.codigo)
        const visuaisDesbloqueados = [...personagem.visuais.map(_visual => {
            if (visuaisIds.data.some(_id => _id === _visual.id)) {
                return { ..._visual, visivel: 1 }
            }
            return { ..._visual }
        })]
        const novosVisuais = [
            ...personagem.visuais.filter(visualAntigo=> !visuaisDesbloqueados.some(visualNovo=> visualNovo.id === visualAntigo.id)),
            ...visuaisDesbloqueados
        ].sort(function (a, b) { return a.id - b.id; })

        setVisuais({ ...visuais, array: novosVisuais })
        setPersonagem({ ...personagem, visuais: novosVisuais })
        if (visuaisIds.length) setFormData({ codigo: "" })
    }

    function renderVisualCard(visual) {
        const _imagem = visual.perfil ? visual.perfil : IMAGES.PERFIL_GENERICO

        return <li
            className={visual.id === visuais.escolhido.id ? "visual-escolhido" : null}
            key={visual.id}
            onClick={() => setVisuais({ ...visuais, escolhido: visual })}
            style={!visual.visivel ? { opacity: "25%" } : null}
        >
            <section className="visual-esquerda">
                <div className="imagem-container">
                    <Imagem data={_imagem} style={!visual.perfil ? { opacity: "50%" } : null} />
                </div>
            </section>
            <section className="visual-direita">
                <header>
                    <h3>{visual.nome} {visual.id === visuais.ativo.id ? <span>[Ativo]</span> : null}</h3>
                    {user.role === USER_ROLE.ADM && !modoOffline ?
                        <button onClick={() => handleCadeado(visual)} style={{ backgroundColor: `var(--mid-${visual.visivel ? "green" : "red"})` }}>
                            <Imagem data={visual.visivel ? ICONS.CADEADO_ABERTO : ICONS.CADEADO_FECHADO} className={"cadeado"} />
                        </button>
                        : null}
                </header>
                <section>
                    <p>{visual.descricao}</p>
                </section>
            </section>
        </li>
    }

    function renderCodigoModal() {
        return (
            <Modal isOpen={codigoModal} setIsOpen={setCodigoModal}>
                <div className="codigo-modal">
                    <header><h1>Desbloquear visual</h1></header>
                    <h2>Insira o código:</h2>
                    <input type="text" name={"codigo"} value={formData.codigo} onChange={handleChange} placeholder="Digite aqui o código." />
                    <footer>
                        <BotaoPrimario onClick={()=>setCodigoModal(false)}>Cancelar</BotaoPrimario>
                        <BotaoPrimario onClick={handleDesbloquearVisual}>Confirmar</BotaoPrimario>
                    </footer>
                </div>
            </Modal>
        )
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="visuais-modal">
                {renderCodigoModal()}
                <header className="visuais-header">
                    <div></div>
                    <h1>Visuais</h1>
                    {!modoOffline ? <BotaoPrimario onClick={() => { setCodigoModal(true) }}>+</BotaoPrimario> : <div></div>}
                </header>
                <section>
                    <section className="lista-visuais">
                        <ul>
                            {
                                visuais.array.map(visual => {
                                    return renderVisualCard(visual)
                                })
                            }
                        </ul>
                    </section>
                    <section className="visual-preview">
                        {visuais.escolhido ?
                            <>
                                <h1>{visuais.escolhido.nome}</h1>
                                <Imagem data={visuais.escolhido.sprite ? visuais.escolhido.sprite : IMAGES.SPRITE_GENERICO} />
                                <p>"{visuais.escolhido.descricao}"</p>
                            </>
                            : null}

                    </section>
                </section>
                <footer>
                    <BotaoPrimario onClick={handleCancelar}>Cancelar</BotaoPrimario>
                    <BotaoPrimario onClick={handleSalvar}>Salvar</BotaoPrimario>
                </footer>
            </div>
        </Modal>
    )

}