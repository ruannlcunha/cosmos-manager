import "./diario-modal.style.css"
import { useEffect, useState } from "react";
import { useForm } from "../../../hook";
import { BotaoPrimario } from "../botao-primario/botao-primario.component"
import { Modal } from "../modal/modal.component"
import { Imagem } from "../imagem/imagem.component";
import { DIARIO_CATEGORIAS, ICONS, USER_ROLE } from "../../../constants";
import { AlterarImagemModal } from "../alterar-imagem-modal/alterar-imagem-modal.component";
import { useAdicionarImagem } from "../../../hook/api/imagem/adicionar-imagem.api";
import { useRemoverImagem } from "../../../hook/api/imagem/remover-imagem.api";
import { BotaoRemover } from "../botao-remover/botao-remover.component";
import { useRemoverRegistroDiario } from "../../../hook/api/campanha/remover-registro-diario.api";
import { useCriarRegistroDiario } from "../../../hook/api/campanha/criar-registro-diario.api";
import { useAlterarRegistroDiario } from "../../../hook/api/campanha/alterar-registro-diario.api";
import useGlobalUser from "../../../context/user/global-user.context";

export function DiarioModal({ campanha, setCampanha, diario, setDiario, isOpen, setIsOpen, modoOffline }) {
    const { formData, setFormData, handleChange } = useForm({ nome: "", descricao: "", categoria: "OUTROS", imagemAtual: null, imagemNova: null, });
    const { criarRegistroDiario } = useCriarRegistroDiario();
    const { alterarRegistroDiario } = useAlterarRegistroDiario();
    const { removerRegistroDiario } = useRemoverRegistroDiario();
    const [imagemModal, setImagemModal] = useState(false)
    const { adicionarImagem } = useAdicionarImagem();
    const { removerImagem } = useRemoverImagem();
    const [user] = useGlobalUser()

    useEffect(() => {
        if (diario) {
            setFormData({ nome: diario.nome, descricao: diario.descricao, categoria: diario.categoria, imagemAtual: diario.imagem, imagemNova: null })
        }
        else {
            setFormData({ nome: "", descricao: "", categoria: "OUTROS", imagemAtual: null, imagemNova: null, })
        }
    }, [diario, isOpen])

    function handleCancelar() {
        setIsOpen(false)
        setDiario(null)
    }

    async function handleSalvar() {
        let _imagemId = diario.imagem_id
        if (formData.imagemNova) {
            if (diario.imagem_id && !modoOffline) await removerImagem(diario.imagem_id);
            const response = !modoOffline ? await adicionarImagem({
                src: formData.imagemNova.src,
                alt: formData.imagemNova.alt,
                dataUri: formData.imagemNova.dataUri
            }) : { data: { id: `offline-imagem-${diario.id}` } }
            _imagemId = response.data
        };

        const diarioAntigo = campanha.diario.find(_diario => _diario.id === diario.id)
        const diarioNovo = { nome: formData.nome, descricao: formData.descricao, categoria: formData.categoria, imagem_id: _imagemId }
        if (!modoOffline) await alterarRegistroDiario(diario.id, diarioNovo)
        setCampanha({ ...campanha, diario: [...campanha.diario.filter(_diario => _diario.id !== diario.id), { ...diarioAntigo, ...diarioNovo, imagem: formData.imagemAtual }] })
        setIsOpen(false)
        setDiario(null)
    }

    async function handleAdicionar() {
        let _imagemId = null
        if (formData.imagemNova) {
            const response = !modoOffline ? await adicionarImagem({
                src: formData.imagemNova.src,
                alt: formData.imagemNova.alt,
                dataUri: formData.imagemNova.dataUri
            }) : { data: { id: `offline-imagem-${campanha.diario.length + 1}` } }
            _imagemId = response.data
        };
        const novoDiario = { campanhaId: campanha.id, imagem_id: _imagemId, nome: formData.nome, descricao: formData.descricao, categoria: formData.categoria }
        const response = !modoOffline ? await criarRegistroDiario(campanha.id, novoDiario) : { data: { id: `offline-${campanha.diario.length + 1}` } }
        setCampanha({ ...campanha, diario: [...campanha.diario, { ...novoDiario, id: response.data, imagem: formData.imagemAtual }] })
        setIsOpen(false)
        setDiario(null)
    }

    async function handleRemover() {
        if (!modoOffline) await removerRegistroDiario(diario.id)
        setCampanha({ ...campanha, diario: [...campanha.diario.filter(_diario => _diario.id !== diario.id)] })
        setIsOpen(false)
        setDiario(null)
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <AlterarImagemModal
                formData={formData}
                setFormData={setFormData}
                iconePadrao={ICONS.PERGAMINHO}
                isOpen={imagemModal}
                setIsOpen={setImagemModal}
            />
            <div className="diario-modal">
                <header className="diario-header">
                    <div></div>
                    <h1>Registro de Diário</h1>
                    {diario && user.role === USER_ROLE.ADM ?
                        <BotaoRemover deleteFunction={handleRemover} texto={"Você confirma que quer remover esse registro de diário?"} />
                        : <div></div>}
                </header>
                <section className="diario-section">
                    <table>
                        <tbody>
                            <tr>
                                <th colSpan={2}>
                                    <h2>Nome:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    {
                                        user.role === USER_ROLE.ADM ?
                                            <input type="text" name={"nome"} value={formData.nome} onChange={handleChange} placeholder="Escreva o nome do seu registro de diario." />
                                            : <h2>{diario ? diario.nome : ""}</h2>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2}>
                                    <div className="alterar-imagem-container">
                                        <h2>Imagem:</h2>
                                        <div className="imagem-container">
                                            <Imagem
                                                data={formData.imagemAtual ? formData.imagemAtual : ICONS.PERGAMINHO}
                                                style={!formData.imagemAtual ? { opacity: "50%" } : null}
                                            />
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            {
                                user.role === USER_ROLE.ADM ?
                                    <tr>
                                        <td colSpan={2}>
                                            <BotaoPrimario onClick={() => setImagemModal(true)}>Alterar</BotaoPrimario>
                                        </td>
                                    </tr>
                                    : null
                            }
                            <tr>
                                <th style={{ width: "20%" }}>
                                    <h2>Categoria:</h2>
                                </th>
                                <td style={{ borderLeft: "solid 2px var(--dark-purple)" }}>
                                    {
                                        user.role === USER_ROLE.ADM ?
                                            <select
                                                type="text"
                                                name="categoria"
                                                value={formData.categoria}
                                                onChange={handleChange}
                                                style={formData.categoria ? { backgroundColor: `var(--${DIARIO_CATEGORIAS[formData.categoria].cor})` } : null}
                                            >
                                                {
                                                    Object.values(DIARIO_CATEGORIAS).map(categoria => {
                                                        return <option style={{ backgroundColor: `var(--${categoria.cor})` }} value={categoria.data}>{categoria.nome}</option>
                                                    })
                                                }
                                            </select>
                                            : <h3 className="categoria" style={diario ? { backgroundColor: `var(--${DIARIO_CATEGORIAS[diario.categoria].cor})` } : null}>
                                                {diario ? DIARIO_CATEGORIAS[diario.categoria].nome : ""}
                                            </h3>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2}>
                                    <h2>Descrição:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    {
                                        user.role === USER_ROLE.ADM ?
                                            <textarea name={"descricao"} value={formData.descricao} onChange={handleChange} placeholder="Escreva a descrição do seu registro de diario.">
                                            </textarea>
                                            : <p>{diario ? diario.descricao : ""}</p>
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <footer>
                    {
                        user.role === USER_ROLE.ADM ?
                            <>
                                <BotaoPrimario onClick={handleCancelar}>Cancelar</BotaoPrimario>
                                <BotaoPrimario onClick={diario ? handleSalvar : handleAdicionar}>{diario ? "Salvar" : "Adicionar"}</BotaoPrimario>
                            </>
                            : <BotaoPrimario onClick={handleCancelar}>Voltar</BotaoPrimario>
                    }
                </footer>
            </div>
        </Modal>
    )

}