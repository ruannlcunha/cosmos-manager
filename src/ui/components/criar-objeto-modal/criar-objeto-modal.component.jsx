import "./criar-objeto-modal.style.css"
import { useEffect, useState } from "react";
import { useForm, useToast } from "../../../hook";
import { BotaoPrimario } from "../botao-primario/botao-primario.component"
import { Modal } from "../modal/modal.component"
import { CENA_OBJETOS_TIPO, ICONS } from "../../../constants";
import { useCriarCenaObjeto } from "../../../hook/api/campanha/criar-cena-objeto.api";
import { useListarPersonagens } from "../../../hook/api/personagem/listar-personagens.api";
import { AlterarImagemModal } from "../alterar-imagem-modal/alterar-imagem-modal.component";
import { Imagem } from "../imagem/imagem.component";
import { useAdicionarImagem } from "../../../hook/api/imagem/adicionar-imagem.api";
import { useListarItens } from "../../../hook/api/item/listar-itens.api";

export function CriarObjetoModal({ campanhaId, cenaId, tiposData, cenaObjetos, titulo, isOpen, setIsOpen }) {
    const { formData, setFormData, handleChange } = useForm({ valor: "", tipo: null, imagemAtual: null, imagemNova: null, filtro: "", template: ""});
    const [imagemModal, setImagemModal] = useState(false)
    const [tipos, setTipos] = useState([])
    const [objetos, setObjetos] = useState([])
    const { toastWarning, toastSuccess } = useToast()
    const { criarCenaObjeto } = useCriarCenaObjeto();
    const { adicionarImagem } = useAdicionarImagem()
    const { itens, listarItens } = useListarItens()
    const { personagens, listarPersonagens } = useListarPersonagens()
    const NENHUM = "NENHUM"

    useEffect(() => {
        setTipos([NENHUM, ...tiposData])
        setFormData({ valor: "", tipo: NENHUM, imagemAtual: null, imagemNova: null, filtro: "", })
        fetchData()
        if (cenaObjetos) {
            setObjetos(cenaObjetos)
        }
    }, [isOpen])

    useEffect(() => {
        if(isOpen) {
            if (tiposData.some(tipo => tipo === CENA_OBJETOS_TIPO.TEMPLATE)) {
                let formDataNovo = { ...formData }
                const tipos = tiposData.filter(tipo => tipo !== CENA_OBJETOS_TIPO.TEMPLATE)
                tipos.forEach(tipo => {
                    formDataNovo = { ...formDataNovo, [`${tipo}`]: "" }
                });
                setFormData(formDataNovo)
            }
        }
    }, [isOpen])

    useEffect(() => {
        fetchData()
        setFormData({ ...formData, valor: "" })
    }, [formData.filtro])

    useEffect(() => {
        setFormData({ ...formData, valor: "", imagemAtual: null, imagemNova: null, filtro: "", })
    }, [formData.tipo])

    async function fetchData() {
        if (tiposData.some(tipo => tipo === CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA || tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA)) {
            await listarPersonagens()
        }
        if (tiposData.some(tipo => tipo === CENA_OBJETOS_TIPO.ITEM)) {
            await listarItens(formData.filtro)
        }
    }

    function _getObjetosByTipo(tipo) {
        return objetos.filter(obj => obj.tipo === tipo)
    }

    function handleCancelar() {
        setIsOpen(false)
    }

    async function handleAdicionarTemplate() {
        if (!formData.template) {
            toastWarning("É necessário escolher um nome para o template.")
            return
        }
        let _valor = `nome=[${formData.template}]`
        const tipos = tiposData.filter(tipo => tipo !== CENA_OBJETOS_TIPO.TEMPLATE)
        tipos.forEach(tipo => {
            _valor = _valor.concat(`;${tipo}=[${formData[tipo]}]`)
        })

        const novoObjeto = { valor: _valor, tipo: formData.tipo }
        await criarCenaObjeto(campanhaId, cenaId, novoObjeto)
        toastSuccess("Objeto adicionado com sucesso!")
        setIsOpen(false)
    }

    async function handleAdicionar() {
        if (formData.tipo === CENA_OBJETOS_TIPO.TEMPLATE) {
            await handleAdicionarTemplate()
            return
        }
        if ((formData.tipo !== NENHUM && formData.valor !== NENHUM && formData.tipo && formData.valor) || (formData.tipo === CENA_OBJETOS_TIPO.IMAGEM && formData.imagemNova)) {

            let _valor = formData.valor

            if (formData.tipo === CENA_OBJETOS_TIPO.IMAGEM) {
                const response = await adicionarImagem({
                    src: formData.imagemNova.src,
                    alt: formData.imagemNova.alt,
                    dataUri: formData.imagemNova.dataUri
                })
                const _imagemId = response.data
                _valor = _imagemId
            };

            const novoObjeto = { valor: _valor, tipo: formData.tipo }
            await criarCenaObjeto(campanhaId, cenaId, novoObjeto)
            toastSuccess("Objeto adicionado com sucesso!")
            setIsOpen(false)
            return
        }
        toastWarning("É necessário escolher um tipo e um valor para o objeto.")
    }

    function renderPersonagensValores() {
        const valores = personagens.map(personagem => {
            return { id: personagem.id, nome: personagem.nome }
        })

        return (
            <>
                <tr><th><h2>Personagem</h2></th></tr>
                <tr>
                    <td>
                        <select type="text" name="valor" value={formData.valor} onChange={handleChange}>
                            <option value={""}>{NENHUM}</option>
                            {
                                valores.map((valor, i) => {
                                    return <option value={valor.id}>
                                        {`${valor.nome} (${valor.id})`}
                                    </option>
                                })
                            }
                        </select>
                    </td>
                </tr>
            </>
        )
    }

    function renderTextoValores(titulo) {

        return (
            <>
                <tr><th><h2>{titulo}</h2></th></tr>
                <tr>
                    <td>
                        <input type="text" name="valor" value={formData.valor} onChange={handleChange} />
                    </td>
                </tr>
            </>
        )
    }

    function renderImagemValores() {
        return (
            <>
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
            </>
        )
    }

    function renderItemValores() {
        const valores = itens.map(item => {
            return { id: item.id, nome: item.nome }
        })

        return (
            <>
                <tr><th><h2>Pesquisar</h2></th></tr>
                <tr>
                    <td>
                        <input type="text" name="filtro" value={formData.filtro} onChange={handleChange} />
                    </td>
                </tr>
                <tr><th><h2>Item</h2></th></tr>
                <tr>
                    <td>
                        <select type="text" name="valor" value={formData.valor} onChange={handleChange}>
                            <option value={""}>{NENHUM}</option>
                            {
                                valores.map((valor) => {
                                    return <option value={valor.id}>
                                        {`${valor.nome} (${valor.id})`}
                                    </option>
                                })
                            }
                        </select>
                    </td>
                </tr>
            </>
        )
    }

    function renderTemplateValores() {
        const tipos = tiposData.filter(tipo => tipo !== CENA_OBJETOS_TIPO.TEMPLATE)
        return (
            <>
                <tr><th><h2>Template:</h2></th></tr>
                <tr><th><h2>Nome</h2></th></tr>
                <tr>
                    <td>
                        <input type="text" name="template" value={formData.template} onChange={handleChange} />
                    </td>
                </tr>
                {
                    tipos.map(tipo => (
                        <>
                            <tr><th><h2>{tipo}</h2></th></tr>
                            <tr>
                                <td>
                                    <select type="text" name={tipo} value={formData[tipo]} onChange={handleChange}>
                                        <option value={""}>{NENHUM}</option>
                                        {
                                            _getObjetosByTipo(tipo).map((obj) => {
                                                return <option value={obj.objeto_id}>
                                                    {`${obj.objeto_id}`}
                                                </option>
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                        </>
                    ))
                }
            </>
        )
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="criar-objeto-modal">
                <header className="criar-objeto-header">
                    <h1>{`Criar Objeto de Cena (${titulo})`}</h1>
                </header>
                <section className="criar-objeto-section">
                    <table>
                        <tbody>
                            <tr>
                                <th>
                                    <h2>Tipo:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <select type="text" name="tipo" value={formData.tipo} onChange={handleChange}>
                                        {
                                            tipos.map(tipo => {
                                                return <option value={tipo}>{tipo}</option>
                                            })
                                        }
                                    </select>
                                </td>
                            </tr>
                            {
                                formData.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA || formData.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA ?
                                    renderPersonagensValores()
                                    : formData.tipo === CENA_OBJETOS_TIPO.TITULO ? renderTextoValores("Título")
                                        : formData.tipo === CENA_OBJETOS_TIPO.TEXTO ? renderTextoValores("Texto")
                                            : formData.tipo === CENA_OBJETOS_TIPO.IMAGEM ? renderImagemValores()
                                                : formData.tipo === CENA_OBJETOS_TIPO.ITEM ? renderItemValores()
                                                    : formData.tipo === CENA_OBJETOS_TIPO.TEMPLATE ? renderTemplateValores()
                                                        : null
                            }
                        </tbody>
                    </table>
                </section>
                <footer>
                    <BotaoPrimario onClick={handleCancelar}>Cancelar</BotaoPrimario>
                    <BotaoPrimario onClick={handleAdicionar}>Adicionar</BotaoPrimario>
                </footer>
            </div>
            <AlterarImagemModal
                formData={formData}
                setFormData={setFormData}
                iconePadrao={ICONS.CAMERA}
                isOpen={imagemModal}
                setIsOpen={setImagemModal}
            />
        </Modal>
    )

}