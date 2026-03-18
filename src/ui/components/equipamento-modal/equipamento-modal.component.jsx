import "./equipamento-modal.style.css"
import { useEffect, useState } from "react";
import { useForm } from "../../../hook";
import { BotaoPrimario } from "../botao-primario/botao-primario.component"
import { Modal } from "../modal/modal.component"
import { useAlterarEquipamento } from "../../../hook/api/personagem/alterar-equipamento.api";
import { Imagem } from "../imagem/imagem.component";
import { AlterarImagemModal } from "../alterar-imagem-modal/alterar-imagem-modal.component";
import { useAdicionarImagem } from "../../../hook/api/imagem/adicionar-imagem.api";
import { useRemoverImagem } from "../../../hook/api/imagem/remover-imagem.api";

export function EquipamentoModal({ personagem, setPersonagem, equipamento, setEquipamento, titulo, icon, isOpen, setIsOpen, modoOffline }) {
    const { formData, setFormData, handleChange } = useForm({ nome: "", descricao: "", imagemAtual: null, imagemNova: null, });
    const { alterarEquipamento } = useAlterarEquipamento();
    const [imagemModal, setImagemModal] = useState(false)
    const { adicionarImagem } = useAdicionarImagem();
    const { removerImagem } = useRemoverImagem();

    useEffect(() => {
        if (equipamento) {
            setFormData({ nome: equipamento.nome, descricao: equipamento.descricao, imagemAtual: equipamento.imagem, imagemNova: null, })
        }
        else {
            setFormData({ nome: "", descricao: "", imagemAtual: null, imagemNova: null, })
        }
    }, [equipamento, isOpen])

    function handleCancelar() {
        setIsOpen(false)
        setEquipamento(null)
    }

    async function handleSalvar() {
        let _imagemId = equipamento.imagem_id
        if (formData.imagemNova) {
            if (equipamento.imagem_id && !modoOffline) await removerImagem(equipamento.imagem_id);
            
            const response = !modoOffline ? await adicionarImagem({
                src: formData.imagemNova.src,
                alt: formData.imagemNova.alt,
                dataUri: formData.imagemNova.dataUri
            }) : { data: { id: null } }
            _imagemId = response.data
        };

        const equipamentoAntigo = personagem.equipamentos.find(_equipamento => _equipamento.id === equipamento.id)
        const equipamentoNovo = { nome: formData.nome, descricao: formData.descricao, imagem_id: _imagemId }
        if (!modoOffline) await alterarEquipamento(equipamento.id, equipamentoNovo)
        setPersonagem({
            ...personagem, equipamentos: [
                ...personagem.equipamentos.filter(_equipamento => _equipamento.id !== equipamento.id),
                { ...equipamentoAntigo, ...equipamentoNovo, imagem: formData.imagemAtual }
            ]
        })
        setIsOpen(false)
        setEquipamento(null)
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <AlterarImagemModal
                formData={formData}
                setFormData={setFormData}
                iconePadrao={icon}
                isOpen={imagemModal}
                setIsOpen={setImagemModal}
            />

            <div className="equipamento-modal">
                <header className="equipamento-header">
                    <h1>{titulo}</h1>
                </header>
                <section className="equipamento-section">
                    <table>
                        <tbody>
                            <tr>
                                <th>
                                    <h2>Nome:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" name={"nome"} value={formData.nome} onChange={handleChange} placeholder="Escreva o nome do seu equipamento." />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div className="alterar-imagem-container">
                                        <h2>Imagem:</h2>
                                        <div className="imagem-container">
                                            <Imagem
                                                data={formData.imagemAtual ? formData.imagemAtual : icon}
                                                style={!formData.imagemAtual ? { opacity: "50%" } : null}
                                            />
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <BotaoPrimario onClick={() => setImagemModal(true)}>Alterar</BotaoPrimario>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h2>Descrição:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <textarea name={"descricao"} value={formData.descricao} onChange={handleChange} placeholder="Escreva a descrição do seu equipamento.">

                                    </textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <footer>
                    <BotaoPrimario onClick={handleCancelar}>Cancelar</BotaoPrimario>
                    <BotaoPrimario onClick={handleSalvar}>Salvar</BotaoPrimario>
                </footer>
            </div>
        </Modal>
    )

}