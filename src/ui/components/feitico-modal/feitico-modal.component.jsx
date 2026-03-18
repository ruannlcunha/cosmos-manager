import "./feitico-modal.style.css"
import { useEffect, useState } from "react";
import { useForm } from "../../../hook";
import { BotaoPrimario } from "../botao-primario/botao-primario.component"
import { Modal } from "../modal/modal.component"
import { useAlterarFeitico } from "../../../hook/api/personagem/alterar-feitico.api";
import { Imagem } from "../imagem/imagem.component";
import { ICONS } from "../../../constants";
import { AlterarImagemModal } from "../alterar-imagem-modal/alterar-imagem-modal.component";
import { useAdicionarImagem } from "../../../hook/api/imagem/adicionar-imagem.api";
import { useRemoverImagem } from "../../../hook/api/imagem/remover-imagem.api";
import { useCriarFeitico } from "../../../hook/api/personagem/criar-feitico.api";
import { BotaoRemover } from "../botao-remover/botao-remover.component";
import { useRemoverFeitico } from "../../../hook/api/personagem/remover-feitico.api";

export function FeiticoModal({ personagem, setPersonagem, feitico, setFeitico, isOpen, setIsOpen, modoOffline }) {
    const { formData, setFormData, handleChange } = useForm({ nome: "", descricao: "", imagemAtual: null, imagemNova: null, custo: "", alvos: "", duracao: "", ofensivo: 0 });
    const { alterarFeitico } = useAlterarFeitico();
    const { criarFeitico } = useCriarFeitico();
    const [imagemModal, setImagemModal] = useState(false)
    const { adicionarImagem } = useAdicionarImagem();
    const { removerImagem } = useRemoverImagem();
    const { removerFeitico } = useRemoverFeitico()

    useEffect(() => {
        if (feitico) {
            setFormData({
                nome: feitico.nome, descricao: feitico.descricao, imagemAtual: feitico.imagem, imagemNova: null,
                custo: feitico.custo, alvos: feitico.alvos, duracao: feitico.duracao, ofensivo: feitico.ofensivo
            })
        }
        else {
            setFormData({ nome: "", descricao: "", imagemAtual: null, imagemNova: null, custo: "", alvos: "", duracao: "", ofensivo: 0 })
        }
    }, [feitico, isOpen])

    function handleCancelar() {
        setIsOpen(false)
        setFeitico(null)
    }

    async function handleSalvar() {
        let _imagemId = feitico.imagem_id
        if (formData.imagemNova) {
            if (feitico.imagem_id && !modoOffline) await removerImagem(feitico.imagem_id);
            const response = !modoOffline? await adicionarImagem({
                src: formData.imagemNova.src,
                alt: formData.imagemNova.alt,
                dataUri: formData.imagemNova.dataUri
            }): {data: {id: `offline-imagem-${feitico.id}`}}
            _imagemId = response.data
        };

        const feiticoAntigo = personagem.feiticos.find(_feitico => _feitico.id === feitico.id)
        const feiticoNovo = {
            imagem_id: _imagemId, nome: formData.nome, descricao: formData.descricao,
            custo: formData.custo, alvos: formData.alvos, duracao: formData.duracao, ofensivo: formData.ofensivo
        }
        if(!modoOffline) await alterarFeitico(feitico.id, feiticoNovo)
        setPersonagem({ ...personagem, feiticos: [...personagem.feiticos.filter(_feitico => _feitico.id !== feitico.id), { ...feiticoAntigo, ...feiticoNovo, imagem: formData.imagemAtual }] })
        setIsOpen(false)
        setFeitico(null)
    }

    async function handleAdicionar() {
        let _imagemId = null
        if (formData.imagemNova) {
            const response = !modoOffline ? await adicionarImagem({
                src: formData.imagemNova.src,
                alt: formData.imagemNova.alt,
                dataUri: formData.imagemNova.dataUri
            }): {data: {id: `offline-imagem-${personagem.feiticos.length+1}`}}
            _imagemId = response.data
        };
        const feiticoNovo = {
            personagemId: personagem.id, imagem_id: _imagemId, nome: formData.nome, descricao: formData.descricao,
            custo: formData.custo, alvos: formData.alvos, duracao: formData.duracao, ofensivo: formData.ofensivo
        }
        const response = !modoOffline ?
        await criarFeitico(personagem.id, _imagemId, formData.nome, formData.descricao, formData.custo, formData.alvos, formData.duracao, formData.ofensivo)
        : {data: {id: `offline-${personagem.feiticos.length+1}`}}

        setPersonagem({ ...personagem, feiticos: [...personagem.feiticos, { ...feiticoNovo, id: response.data, imagem: formData.imagemAtual }] })
        setIsOpen(false)
        setFeitico(null)
    }

    async function handleRemover() {
        if(!modoOffline) await removerFeitico(feitico.id)
        setPersonagem({ ...personagem, feiticos: [...personagem.feiticos.filter(_feitico => _feitico.id !== feitico.id)] })
        setIsOpen(false)
        setFeitico(null)
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <AlterarImagemModal
                formData={formData}
                setFormData={setFormData}
                iconePadrao={ICONS.FEITICO_GENERICO}
                isOpen={imagemModal}
                setIsOpen={setImagemModal}
            />
            <div className="feitico-modal">
                <header className="feitico-header">
                    <div></div>
                    <h1>Feitiço</h1>
                    {feitico ? <BotaoRemover deleteFunction={handleRemover} texto={"Você confirma que quer remover esse feitiço?"} /> : <div></div>}
                </header>
                <section className="feitico-section">
                    <table>
                        <tbody>
                            <tr>
                                <th>
                                    <h2>Nome:</h2>
                                </th>
                                <td style={{ borderLeft: "solid 2px var(--dark-blue)" }}>
                                    <input type="text" name={"nome"} value={formData.nome} onChange={handleChange} placeholder="Escreva o nome do seu feitiço." />
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2}>
                                    <div className="alterar-imagem-container">
                                        <h2>Imagem:</h2>
                                        <div className="imagem-container">
                                            <Imagem
                                                data={formData.imagemAtual ? formData.imagemAtual : ICONS.FEITICO_GENERICO}
                                                style={!formData.imagemAtual ? { opacity: "50%" } : null}
                                            />
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <BotaoPrimario onClick={() => setImagemModal(true)}>Alterar</BotaoPrimario>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h2>Custo:</h2>
                                </th>
                                <td style={{ borderLeft: "solid 2px var(--dark-blue)" }}>
                                    <input type="text" name={"custo"} value={formData.custo} onChange={handleChange} placeholder="Escreva o custo do seu feitiço." />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h2>Alvos:</h2>
                                </th>
                                <td style={{ borderLeft: "solid 2px var(--dark-blue)" }}>
                                    <input type="text" name={"alvos"} value={formData.alvos} onChange={handleChange} placeholder="Escreva os alvos do seu feitiço." />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h2>Duração:</h2>
                                </th>
                                <td style={{ borderLeft: "solid 2px var(--dark-blue)" }}>
                                    <input type="text" name={"duracao"} value={formData.duracao} onChange={handleChange} placeholder="Escreva a duração do seu feitiço." />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h2>Ofensivo:</h2>
                                </th>
                                <td style={{ borderLeft: "solid 2px var(--dark-blue)" }}>
                                    <select type="text" name="ofensivo" value={formData.ofensivo} onChange={handleChange}>
                                        <option value={0}>Não</option>
                                        <option value={1}>Sim</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2}>
                                    <h2>Descrição:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <textarea name={"descricao"} value={formData.descricao} onChange={handleChange} placeholder="Escreva a descrição do seu feitiço.">

                                    </textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <footer>
                    <BotaoPrimario onClick={handleCancelar}>Cancelar</BotaoPrimario>
                    <BotaoPrimario onClick={feitico ? handleSalvar : handleAdicionar}>{feitico ? "Salvar" : "Adicionar"}</BotaoPrimario>
                </footer>
            </div>
        </Modal>
    )

}