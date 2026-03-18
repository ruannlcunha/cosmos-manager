import "./alterar-cena-modal.style.css"
import { useEffect, useState } from "react";
import { useForm } from "../../../hook";
import { BotaoPrimario } from "../botao-primario/botao-primario.component"
import { Modal } from "../modal/modal.component"
import { Imagem } from "../imagem/imagem.component";
import { CENAS_TIPO, ICONS } from "../../../constants";
import { AlterarImagemModal } from "../alterar-imagem-modal/alterar-imagem-modal.component";
import { useAdicionarImagem } from "../../../hook/api/imagem/adicionar-imagem.api";
import { useRemoverImagem } from "../../../hook/api/imagem/remover-imagem.api";
import { BotaoRemover } from "../botao-remover/botao-remover.component";
import { useCriarCena } from "../../../hook/api/campanha/criar-cena.api";
import { useAlterarCena } from "../../../hook/api/campanha/alterar-cena.api";
import { useRemoverCena } from "../../../hook/api/campanha/remover-cena.api";

export function AlterarCenaModal({ campanhaId, cena, setCena, isOpen, setIsOpen, isRemovivel }) {
    const { formData, setFormData, handleChange } = useForm({ nome: "", tipo: CENAS_TIPO.CENARIO, imagemAtual: null, imagemNova: null, });
    const { criarCena } = useCriarCena();
    const { alterarCena } = useAlterarCena();
    const { removerCena } = useRemoverCena();
    const [imagemModal, setImagemModal] = useState(false)
    const { adicionarImagem } = useAdicionarImagem();
    const { removerImagem } = useRemoverImagem();
    
    useEffect(() => {
        if (cena) {
            setFormData({ nome: cena.nome, tipo: cena.tipo, imagemAtual: cena.fundo, imagemNova: null })
        }
        else {
            setFormData({ nome: "", tipo: CENAS_TIPO.CENARIO, imagemAtual: null, imagemNova: null, })
        }
    }, [cena, isOpen])

    function handleCancelar() {
        setIsOpen(false)
        setCena(null)
    }

    async function handleSalvar() {
        let _imagemId = cena.fundo_id
        if (formData.imagemNova) {
            if (cena.fundo_id) await removerImagem(cena.fundo_id);
            const response = await adicionarImagem({
                src: formData.imagemNova.src,
                alt: formData.imagemNova.alt,
                dataUri: formData.imagemNova.dataUri
            })
            _imagemId = response.data
        };

        const cenaNova = { nome: formData.nome, tipo: formData.tipo, fundo_id: _imagemId }
        await alterarCena(campanhaId, cena.id, cenaNova)
        setIsOpen(false)
        setCena(null)
    }

    async function handleAdicionar() {
        let _imagemId = null
        if (formData.imagemNova) {
            const response = await adicionarImagem({
                src: formData.imagemNova.src,
                alt: formData.imagemNova.alt,
                dataUri: formData.imagemNova.dataUri
            })
            _imagemId = response.data
        };
        const novaCena = { nome: formData.nome, tipo: formData.tipo, fundo_id: _imagemId }
        await criarCena(campanhaId, novaCena)
        setIsOpen(false)
        setCena(null)
    }

    async function handleRemover() {
        await removerCena(campanhaId, cena.id)
        setIsOpen(false)
        setCena(null)
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <AlterarImagemModal
                formData={formData}
                setFormData={setFormData}
                iconePadrao={ICONS.CAMERA}
                isOpen={imagemModal}
                setIsOpen={setImagemModal}
            />
            <div className="alterar-cena-modal">
                <header className="alterar-cena-header">
                    <div></div>
                    <h1>Cena</h1>
                    {cena && isRemovivel ? <BotaoRemover deleteFunction={handleRemover} texto={"Você confirma que quer remover essa cena?"} /> :<div></div>}
                </header>
                <section className="alterar-cena-section">
                    <table>
                        <tbody>
                            <tr>
                                <th>
                                    <h2>Nome:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <input type="text" name={"nome"} value={formData.nome} onChange={handleChange} placeholder="Escreva o nome da sua cena." />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div className="alterar-imagem-container">
                                        <h2>Imagem:</h2>
                                        <div className="imagem-container">
                                            <Imagem
                                                data={formData.imagemAtual ? formData.imagemAtual : ICONS.CAMERA}
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
                                    <h2>Tipo:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <select type="text" name="tipo" value={formData.tipo} onChange={handleChange}>
                                        {
                                            Object.values(CENAS_TIPO).map(cenaTipo=> {
                                                return <option value={cenaTipo}>{cenaTipo}</option>
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <footer>
                    <BotaoPrimario onClick={handleCancelar}>Cancelar</BotaoPrimario>
                    <BotaoPrimario onClick={cena ? handleSalvar : handleAdicionar}>{cena ? "Salvar" : "Adicionar"}</BotaoPrimario>
                </footer>
            </div>
        </Modal>
    )

}