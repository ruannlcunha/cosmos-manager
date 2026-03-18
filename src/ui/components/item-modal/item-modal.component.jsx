import "./item-modal.style.css"
import { useEffect, useState } from "react";
import { useForm } from "../../../hook";
import { BotaoPrimario } from "../botao-primario/botao-primario.component"
import { Modal } from "../modal/modal.component"
import { useCriarItemPersonagem } from "../../../hook/api/personagem/criar-item-personagem.api";
import { useAlterarItemPersonagem } from "../../../hook/api/personagem/alterar-item-personagem.api";
import { Imagem } from "../imagem/imagem.component";
import { ICONS } from "../../../constants";
import { AlterarImagemModal } from "../alterar-imagem-modal/alterar-imagem-modal.component";
import { useAdicionarImagem } from "../../../hook/api/imagem/adicionar-imagem.api";
import { useRemoverImagem } from "../../../hook/api/imagem/remover-imagem.api";
import { BotaoRemover } from "../botao-remover/botao-remover.component";
import { useRemoverItemPersonagem } from "../../../hook/api/personagem/remover-item-personagem.api";

export function ItemModal({ personagem, setPersonagem, item, setItem, isOpen, setIsOpen, modoOffline, isEditavel }) {
    const { formData, setFormData, handleChange } = useForm({ nome: "", descricao: "", custo: 0, imagemAtual: null, imagemNova: null, });
    const { alterarItemPersonagem } = useAlterarItemPersonagem();
    const { criarItemPersonagem } = useCriarItemPersonagem();
    const [imagemModal, setImagemModal] = useState(false)
    const { adicionarImagem } = useAdicionarImagem();
    const { removerImagem } = useRemoverImagem();
    const { removerItemPersonagem } = useRemoverItemPersonagem();

    useEffect(() => {
        if (item) {
            setFormData({ nome: item.nome, descricao: item.descricao, custo: item.custo, imagemAtual: item.imagem, imagemNova: null })
        }
        else {
            setFormData({ nome: "", descricao: "", custo: 0, imagemAtual: null, imagemNova: null, })
        }
    }, [item, isOpen])

    function _getCusto(valor) {
        const novoValor = valor > 999999 ? 999999 : !valor ? 0 : valor
        return novoValor
    }

    function handleCancelar() {
        setIsOpen(false)
        setItem(null)
    }

    async function handleSalvar() {
        let _imagemId = item.imagem_id
        if (formData.imagemNova) {
            if (item.imagem_id && !modoOffline) await removerImagem(item.imagem_id);
            const response = !modoOffline ? await adicionarImagem({
                src: formData.imagemNova.src,
                alt: formData.imagemNova.alt,
                dataUri: formData.imagemNova.dataUri
            }) : { data: { id: `offline-imagem-${item.id}` } }
            _imagemId = response.data
        };

        const itemAntigo = personagem.itens.find(_item => _item.id === item.id)
        const itemNovo = { nome: formData.nome, descricao: formData.descricao, custo: _getCusto(formData.custo), imagem_id: _imagemId }
        if (!modoOffline) await alterarItemPersonagem(item.id, itemNovo)
        setPersonagem({ ...personagem, itens: [...personagem.itens.filter(_item => _item.id !== item.id), { ...itemAntigo, ...itemNovo, imagem: formData.imagemAtual }] })
        setIsOpen(false)
        setItem(null)
    }

    async function handleAdicionar() {
        let _imagemId = null
        if (formData.imagemNova) {
            const response = !modoOffline ? await adicionarImagem({
                src: formData.imagemNova.src,
                alt: formData.imagemNova.alt,
                dataUri: formData.imagemNova.dataUri
            }) : { data: { id: `offline-imagem-${personagem.itens.length + 1}` } }
            _imagemId = response.data
        };
        const novoItem = { personagemId: personagem.id, imagem_id: _imagemId, nome: formData.nome, descricao: formData.descricao, custo: _getCusto(formData.custo) }
        const response = !modoOffline ? await criarItemPersonagem(novoItem) : { data: { id: `offline-${personagem.itens.length + 1}` } }
        setPersonagem({ ...personagem, itens: [...personagem.itens, { ...novoItem, id: response.data, imagem: formData.imagemAtual }] })
        setIsOpen(false)
        setItem(null)
    }

    async function handleRemover() {
        if (!modoOffline) await removerItemPersonagem(item.id)
        setPersonagem({ ...personagem, itens: [...personagem.itens.filter(_item => _item.id !== item.id)] })
        setIsOpen(false)
        setItem(null)
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <AlterarImagemModal
                formData={formData}
                setFormData={setFormData}
                iconePadrao={ICONS.ITEM_GENERICO}
                isOpen={imagemModal}
                setIsOpen={setImagemModal}
            />
            <div className="item-modal">
                <header className="item-header">
                    <div></div>
                    <h1>Item</h1>
                    {item && isEditavel ? <BotaoRemover deleteFunction={handleRemover} texto={"Você confirma que quer remover esse item?"} /> : <div></div>}
                </header>
                <section className="item-section">
                    <table>
                        <tbody>
                            <tr>
                                <th>
                                    <h2>Nome:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" name={"nome"} value={formData.nome} onChange={handleChange} placeholder="Escreva o nome do seu item." disabled={!isEditavel} />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div className="alterar-imagem-container">
                                        <h2>Imagem:</h2>
                                        <div className="imagem-container">
                                            <Imagem
                                                data={formData.imagemAtual ? formData.imagemAtual : ICONS.ITEM_GENERICO}
                                                style={!formData.imagemAtual ? { opacity: "50%" } : null}
                                            />
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            {isEditavel ?
                                <tr>
                                    <td>
                                        <BotaoPrimario onClick={() => setImagemModal(true)}>Alterar</BotaoPrimario>
                                    </td>
                                </tr>
                                : null}
                            <tr>
                                <th>
                                    <h2>Custo:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <input type="number" name={"custo"} value={formData.custo} placeholder="0" min={0} max={999999} onChange={handleChange} disabled={!isEditavel} />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h2>Descrição:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <textarea name={"descricao"} value={formData.descricao} onChange={handleChange} placeholder="Escreva a descrição do seu item." disabled={!isEditavel}>
                                    </textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <footer>
                    {isEditavel ?
                        <>
                            <BotaoPrimario onClick={handleCancelar}>Cancelar</BotaoPrimario>
                            <BotaoPrimario onClick={item ? handleSalvar : handleAdicionar}>{item ? "Salvar" : "Adicionar"}</BotaoPrimario>
                        </>
                        : null}
                </footer>
            </div>
        </Modal>
    )

}