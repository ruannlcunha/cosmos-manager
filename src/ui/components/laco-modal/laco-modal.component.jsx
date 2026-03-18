import "./laco-modal.style.css"
import { useEffect, useState } from "react";
import { useForm } from "../../../hook";
import { BotaoPrimario } from "../botao-primario/botao-primario.component"
import { Modal } from "../modal/modal.component"
import { useCriarLaco } from "../../../hook/api/personagem/criar-laco.api";
import { useAlterarLaco } from "../../../hook/api/personagem/alterar-laco.api";
import { Imagem } from "../imagem/imagem.component";
import { ICONS } from "../../../constants";
import { AlterarImagemModal } from "../alterar-imagem-modal/alterar-imagem-modal.component";
import { useRemoverImagem } from "../../../hook/api/imagem/remover-imagem.api";
import { useAdicionarImagem } from "../../../hook/api/imagem/adicionar-imagem.api";
import { BotaoRemover } from "../botao-remover/botao-remover.component";
import { useRemoverLaco } from "../../../hook/api/personagem/remover-laco.api";

export function LacoModal({ personagem, setPersonagem, laco, setLaco, isOpen, setIsOpen, modoOffline }) {
    const { formData, setFormData, handleChange } = useForm(
        {
            nome: "", imagemAtual: null, imagemNova: null, emocao1: "nenhum", emocao2: "nenhum", emocao3: "nenhum",
            admiracao: false, inferioridade: false, lealdade: false, desconfianca: false, afeto: false, odio: false
        });
    const { alterarLaco } = useAlterarLaco();
    const { criarLaco } = useCriarLaco();
    const [imagemModal, setImagemModal] = useState(false)
    const { adicionarImagem } = useAdicionarImagem();
    const { removerImagem } = useRemoverImagem();
    const { removerLaco } = useRemoverLaco()

    useEffect(() => {
        if (laco) {
            const _emocao1 = laco.admiracao ? "admiracao" : laco.inferioridade ? "inferioridade" : "nenhum"
            const _emocao2 = laco.lealdade ? "lealdade" : laco.desconfianca ? "desconfianca" : "nenhum"
            const _emocao3 = laco.afeto ? "afeto" : laco.odio ? "odio" : "nenhum"
            setFormData({
                nome: laco.nome, imagemAtual: laco.imagem, imagemNova: null, emocao1: _emocao1, emocao2: _emocao2, emocao3: _emocao3,
                admiracao: laco.admiracao, inferioridade: laco.inferioridade, lealdade: laco.lealdade,
                desconfianca: laco.desconfianca, afeto: laco.afeto, odio: laco.odio
            })
        }
        else {
            setFormData({
                nome: "", imagemAtual: null, imagemNova: null, emocao1: "nenhum", emocao2: "nenhum", emocao3: "nenhum",
                admiracao: false, inferioridade: false, lealdade: false, desconfianca: false, afeto: false, odio: false
            })
        }
    }, [laco, isOpen])

    function handleCancelar() {
        setIsOpen(false)
        setLaco(null)
    }

    async function handleSalvar() {
        let _imagemId = laco.imagem_id
        if (formData.imagemNova) {
            if (laco.imagem_id && !modoOffline) await removerImagem(laco.imagem_id);
            const response = !modoOffline? await adicionarImagem({
                src: formData.imagemNova.src,
                alt: formData.imagemNova.alt,
                dataUri: formData.imagemNova.dataUri
            }) : {data: {id: `offline-imagem-${laco.id}`}}
            _imagemId = response.data
        };

        const lacoAntigo = personagem.lacos.find(_laco => _laco.id === laco.id)
        const novoLaco = {
            nome: formData.nome, imagem_id: _imagemId,
            admiracao: formData.admiracao, inferioridade: formData.inferioridade,
            lealdade: formData.lealdade, desconfianca: formData.desconfianca, afeto: formData.afeto, odio: formData.odio
        }
        if(!modoOffline) await alterarLaco(laco.id, novoLaco)
        setPersonagem({ ...personagem, lacos: [...personagem.lacos.filter(_laco => _laco.id !== laco.id), { ...lacoAntigo, ...novoLaco, imagem: formData.imagemAtual }] })
        setIsOpen(false)
        setLaco(null)
    }

    async function handleAdicionar() {
        let _imagemId = null
        if (formData.imagemNova) {
            const response = !modoOffline ? await adicionarImagem({
                src: formData.imagemNova.src,
                alt: formData.imagemNova.alt,
                dataUri: formData.imagemNova.dataUri
            }) : {data: {id: `offline-imagem-${personagem.lacos.length+1}`}}
            _imagemId = response.data
        };
        const novoLaco = {
            personagemId: personagem.id, nome: formData.nome, imagem_id: _imagemId, admiracao: formData.admiracao, inferioridade: formData.inferioridade,
            lealdade: formData.lealdade, desconfianca: formData.desconfianca, afeto: formData.afeto, odio: formData.odio
        }

        const response = !modoOffline ? await criarLaco(novoLaco) : {data: {id: `offline-${personagem.lacos.length+1}`}}
        setPersonagem({ ...personagem, lacos: [...personagem.lacos, { ...novoLaco, id: response.data, imagem: formData.imagemAtual }] })
        setIsOpen(false)
        setLaco(null)
    }

    async function handleRemover() {
        if(!modoOffline) await removerLaco(laco.id)
        setPersonagem({ ...personagem, lacos: [...personagem.lacos.filter(_laco => _laco.id !== laco.id)] })
        setIsOpen(false)
        setLaco(null)
    }

    function handleChangeEmocao(e) {
        const { id, value } = e.target
        let novoFormData = {}
        if (id === "emocao1") {
            novoFormData = { ...novoFormData, admiracao: 0, inferioridade: 0 }
            if (value === "admiracao") novoFormData = { ...novoFormData, admiracao: 1 }
            if (value === "inferioridade") novoFormData = { ...novoFormData, inferioridade: 1 }
        }
        if (id === "emocao2") {
            novoFormData = { ...novoFormData, lealdade: 0, desconfianca: 0 }
            if (value === "lealdade") novoFormData = { ...novoFormData, lealdade: 1 }
            if (value === "desconfianca") novoFormData = { ...novoFormData, desconfianca: 1 }
        }
        if (id === "emocao3") {
            novoFormData = { ...novoFormData, afeto: 0, odio: 0 }
            if (value === "afeto") novoFormData = { ...novoFormData, afeto: 1 }
            if (value === "odio") novoFormData = { ...novoFormData, odio: 1 }
        }

        setFormData({
            ...formData,
            ...novoFormData,
            [id]: value
        });
    }
    
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <AlterarImagemModal
                formData={formData}
                setFormData={setFormData}
                iconePadrao={ICONS.LACO_GENERICO}
                isOpen={imagemModal}
                setIsOpen={setImagemModal}
            />
            <div className="laco-modal">
                <header className="laco-header">
                    <div></div>
                    <h1>Laco</h1>
                    {laco ? <BotaoRemover deleteFunction={handleRemover} texto={"Você confirma que quer remover esse laço?"} /> : <div></div>}
                </header>
                <section className="laco-section">
                    <table>
                        <tbody>
                            <tr>
                                <th colSpan={3}>
                                    <h2>Nome:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <input type="text" name={"nome"} value={formData.nome} onChange={handleChange} placeholder="Escreva o nome do seu laco." />
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={3}>
                                    <div className="alterar-imagem-container">
                                        <h2>Imagem:</h2>
                                        <div className="imagem-container">
                                            <Imagem
                                                data={formData.imagemAtual ? formData.imagemAtual : ICONS.LACO_GENERICO}
                                                style={!formData.imagemAtual ? { opacity: "50%" } : null}
                                            />
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <BotaoPrimario onClick={() => setImagemModal(true)}>Alterar</BotaoPrimario>
                                </td>
                            </tr>
                            <tr><th colSpan={3}><h2>Emoções:</h2></th></tr>

                            <tr className="linha-emocoes">
                                <td>
                                    <select name="emocao1" id="emocao1" onChange={(e) => handleChangeEmocao(e)} value={formData.emocao1}
                                        className={formData.emocao1==="admiracao" ? "emocao-positiva" : formData.emocao1 === "lealdade" ? "emocao-negativa" : ""}>
                                        <option value="nenhum">Nenhum</option>
                                        <option className="emocao-positiva" value="admiracao">Admiração</option>
                                        <option className="emocao-negativa" value="inferioridade">Inferioridade</option>
                                    </select>
                                </td>
                                <td>
                                    <select name="emocao2" id="emocao2" onChange={(e) => handleChangeEmocao(e)} value={formData.emocao2}
                                        className={formData.emocao2==="lealdade" ? "emocao-positiva" : formData.emocao2 === "desconfianca" ? "emocao-negativa" : ""}>
                                        <option value="nenhum">Nenhum</option>
                                        <option className="emocao-positiva" value="lealdade">Lealdade</option>
                                        <option className="emocao-negativa" value="desconfianca">Desconfiança</option>
                                    </select>
                                </td>
                                <td>
                                    <select name="emocao3" id="emocao3" onChange={(e) => handleChangeEmocao(e)} value={formData.emocao3}
                                        className={formData.emocao3==="afeto" ? "emocao-positiva" : formData.emocao3 === "odio" ? "emocao-negativa" : ""}>
                                        <option value="nenhum">Nenhum</option>
                                        <option className="emocao-positiva" value="afeto">Afeto</option>
                                        <option className="emocao-negativa" value="odio">Ódio</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <footer>
                    <BotaoPrimario onClick={handleCancelar}>Cancelar</BotaoPrimario>
                    <BotaoPrimario onClick={laco ? handleSalvar : handleAdicionar}>{laco ? "Salvar" : "Adicionar"}</BotaoPrimario>
                </footer>
            </div>
        </Modal>
    )

}