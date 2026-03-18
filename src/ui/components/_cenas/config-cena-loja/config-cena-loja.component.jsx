import "./config-cena-loja.style.css"
import { useEffect, useState } from "react"
import { BotaoPrimario } from "../../botao-primario/botao-primario.component"
import { CENA_OBJETOS_TIPO, ICONS } from "../../../../constants"
import { Imagem } from "../../imagem/imagem.component"
import { useAlterarCenaObjeto } from "../../../../hook/api/campanha/alterar-cena-objeto.api"
import { useRemoverCenaObjeto } from "../../../../hook/api/campanha/remover-cena-objeto.api"
import { useToast } from "../../../../hook"
import { CriarObjetoModal } from "../../criar-objeto-modal/criar-objeto-modal.component"
import { useVisualizarImagem } from "../../../../hook/api/imagem/visualizar-imagem.api"
import { useListarItens } from "../../../../hook/api/item/listar-itens.api"

export function ConfigCenaLoja({ campanhaId, cenaId, cenaObjetos }) {
    const { alterarCenaObjeto } = useAlterarCenaObjeto()
    const { toastWarning } = useToast()
    const { removerCenaObjeto } = useRemoverCenaObjeto()
    const [criarObjetoModal, setCriarObjetoModal] = useState(false)
    const { visualizarImagem } = useVisualizarImagem()
    const { listarItens } = useListarItens()
    const [imagens, setImagens] = useState([])
    const [itens, setItens] = useState([])
    const [titulos, setTitulos] = useState([])
    const [textos, setTextos] = useState([])

    useEffect(() => {
        fetchObjetos()
    }, [cenaObjetos])

    async function fetchObjetos() {
        const _itensData = await listarItens()
        const _titulos = cenaObjetos.filter(obj => obj.tipo === CENA_OBJETOS_TIPO.TITULO)
        const _textos = cenaObjetos.filter(obj => obj.tipo === CENA_OBJETOS_TIPO.TEXTO)
        const _imagensData = cenaObjetos.filter(obj => obj.tipo === CENA_OBJETOS_TIPO.IMAGEM)
        const _imagensNova = []
        const _itens = cenaObjetos
            .filter(obj => obj.tipo === CENA_OBJETOS_TIPO.ITEM)
            .map(obj => {
                const _itemData = _itensData.find(data => data.id === obj.valor)
                return { ...obj, ..._itemData }
            })

        for (const obj of _imagensData) {
            const _imagem = await visualizarImagem(obj.valor)
            const imagemObj = { ..._imagem, ...obj }
            _imagensNova.push(imagemObj)
        }

        setTitulos(_titulos.sort(function (a, b) { return b.exibindo - a.exibindo || a.objeto_id - b.objeto_id; }))
        setTextos(_textos.sort(function (a, b) { return b.exibindo - a.exibindo || a.objeto_id - b.objeto_id; }))
        setImagens(_imagensNova.sort(function (a, b) { return b.exibindo - a.exibindo || a.objeto_id - b.objeto_id; }))
        setItens(_itens.sort(function (a, b) { return a.objeto_id - b.objeto_id; }))
    }

    async function handleExibirObjeto(objeto, limite, substituir) {
        const _tipo = objeto.tipo
        const objetosFiltrados = cenaObjetos.filter(obj => obj.tipo === _tipo && obj.exibindo)

        if (!limite) {
            await alterarCenaObjeto(campanhaId, cenaId, objeto.objeto_id, { exibindo: true })
            return
        }

        if (substituir && objetosFiltrados.length) {
            await alterarCenaObjeto(campanhaId, cenaId, objetosFiltrados[0].objeto_id, { exibindo: false })
            await alterarCenaObjeto(campanhaId, cenaId, objeto.objeto_id, { exibindo: true })
            return
        }

        if (objetosFiltrados.length < limite) {
            await alterarCenaObjeto(campanhaId, cenaId, objeto.objeto_id, { exibindo: true })
            return
        }
        toastWarning(`Só podem ser exibidos ${limite} objetos do tipo ${_tipo}.`)
    }

    async function handleEsconderObjeto(objeto) {
        await alterarCenaObjeto(campanhaId, cenaId, objeto.objeto_id, { exibindo: false })
    }

    async function handleRemoverObjeto(objeto) {
        await removerCenaObjeto(campanhaId, cenaId, objeto.objeto_id)
    }

    function renderImagemCard(img) {
        return (
            <div className="card" style={!img.exibindo ? { opacity: "40%" } : null}>
                <div className="data">
                    <Imagem data={img} />
                </div>
                <div className="info">
                    <header>
                        <h1>{img.src}</h1>
                        {img.exibindo ? <Imagem data={ICONS.CAMERA} /> : null}
                    </header>
                    <section>
                        {img.exibindo ?
                            <BotaoPrimario onClick={() => handleEsconderObjeto(img)}>Esconder</BotaoPrimario>
                            : <BotaoPrimario onClick={() => handleExibirObjeto(img, 1, true)}>Exibir</BotaoPrimario>}
                        <BotaoPrimario onClick={() => handleRemoverObjeto(img)}>Remover</BotaoPrimario>
                    </section>
                </div>
            </div>
        )
    }

    function renderTextoCard(obj) {
        return (
            <div className="card texto" style={!obj.exibindo ? { opacity: "40%" } : null}>
                <div className="data">
                    {"[T]"}
                </div>
                <div className="info">
                    <header>
                        <h1>{obj.valor}</h1>
                        {obj.exibindo ? <Imagem data={ICONS.CAMERA} /> : null}
                    </header>
                    <section>
                        {obj.exibindo ?
                            <BotaoPrimario onClick={() => handleEsconderObjeto(obj)}>Esconder</BotaoPrimario>
                            : <BotaoPrimario onClick={() => handleExibirObjeto(obj, 1, true)}>Exibir</BotaoPrimario>}
                        <BotaoPrimario onClick={() => handleRemoverObjeto(obj)}>Remover</BotaoPrimario>
                    </section>
                </div>
            </div>
        )
    }

    function renderItemCard(item) {
        const imagem = item.imagem ? item.imagem : ICONS.ITEM_GENERICO
        return (
            <div className="card" style={!item.exibindo ? { opacity: "40%" } : null}>
                <div className="data">
                    <Imagem data={imagem} />
                </div>
                <div className="info">
                    <header>
                        <h1>{item.nome}</h1>
                        {item.exibindo ? <Imagem data={ICONS.CAMERA} /> : null}
                    </header>
                    <section>
                        {item.exibindo ?
                            <BotaoPrimario onClick={() => handleEsconderObjeto(item)}>Esconder</BotaoPrimario>
                            : <BotaoPrimario onClick={() => handleExibirObjeto(item)}>Exibir</BotaoPrimario>}
                        <BotaoPrimario onClick={() => handleRemoverObjeto(item)}>Remover</BotaoPrimario>
                    </section>
                </div>
            </div>
        )
    }

    return (
        <div className="config-cena-loja">
            <header><h1>Configurações de Cena de Loja</h1></header>
            <section>
                <BotaoPrimario onClick={() => setCriarObjetoModal(true)}>Criar objeto</BotaoPrimario>
                <div className="config-menus">
                    <div className="menu-imagens">
                        <header>Imagens</header>
                        <section>
                            {
                                imagens.map(img => {
                                    return renderImagemCard(img)
                                })
                            }
                        </section>
                    </div>
                    <div className="menu-itens">
                        <header>Itens</header>
                        <section>
                            {
                                itens.map(item => {
                                    return renderItemCard(item)
                                })
                            }
                        </section>
                    </div>
                    <div className="menu-titulo">
                        <header>Títulos</header>
                        <section>
                            {
                                titulos.map(titulo => {
                                    return renderTextoCard(titulo)
                                })
                            }
                        </section>
                    </div>
                    <div className="menu-textos">
                        <header>Textos</header>
                        <section>
                            {
                                textos.map(texto => {
                                    return renderTextoCard(texto)
                                })
                            }
                        </section>
                    </div>
                </div>
            </section>
            <CriarObjetoModal
                campanhaId={campanhaId}
                cenaId={cenaId}
                tiposData={[CENA_OBJETOS_TIPO.IMAGEM, CENA_OBJETOS_TIPO.ITEM, CENA_OBJETOS_TIPO.TEXTO, CENA_OBJETOS_TIPO.TITULO, CENA_OBJETOS_TIPO.TEMPLATE]}
                cenaObjetos={cenaObjetos}
                titulo={"Loja"}
                isOpen={criarObjetoModal}
                setIsOpen={setCriarObjetoModal}
            />
        </div>
    )

}