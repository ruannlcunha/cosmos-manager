import "./config-cena-cenario.style.css"
import { useEffect, useState } from "react"
import { BotaoPrimario } from "../../botao-primario/botao-primario.component"
import { CENA_OBJETOS_TIPO, ICONS } from "../../../../constants"
import { Imagem } from "../../imagem/imagem.component"
import { useAlterarCenaObjeto } from "../../../../hook/api/campanha/alterar-cena-objeto.api"
import { useRemoverCenaObjeto } from "../../../../hook/api/campanha/remover-cena-objeto.api"
import { useToast } from "../../../../hook"
import { CriarObjetoModal } from "../../criar-objeto-modal/criar-objeto-modal.component"
import { useVisualizarImagem } from "../../../../hook/api/imagem/visualizar-imagem.api"

export function ConfigCenaCenario({ campanhaId, cenaId, cenaObjetos }) {
    const { alterarCenaObjeto } = useAlterarCenaObjeto()
    const { toastWarning } = useToast()
    const { removerCenaObjeto } = useRemoverCenaObjeto()
    const [criarObjetoModal, setCriarObjetoModal] = useState(false)
    const { visualizarImagem } = useVisualizarImagem()
    const [imagens, setImagens] = useState([])
    const [titulos, setTitulos] = useState([])
    const [textos, setTextos] = useState([])

    useEffect(() => {
        fetchObjetos()
    }, [cenaObjetos])

    async function fetchObjetos() {
        const _titulos = cenaObjetos.filter(obj => obj.tipo === CENA_OBJETOS_TIPO.TITULO)
        const _textos = cenaObjetos.filter(obj => obj.tipo === CENA_OBJETOS_TIPO.TEXTO)
        const _imagensData = cenaObjetos.filter(obj => obj.tipo === CENA_OBJETOS_TIPO.IMAGEM)
        const _imagensNova = []

        for (const obj of _imagensData) {
            const _imagem = await visualizarImagem(obj.valor)
            const imagemObj = { ..._imagem, ...obj }
            _imagensNova.push(imagemObj)
        }

        setTitulos(_titulos.sort(function (a, b) { return b.exibindo - a.exibindo || a.objeto_id - b.objeto_id; }))
        setTextos(_textos.sort(function (a, b) { return a.objeto_id - b.objeto_id; }))
        setImagens(_imagensNova.sort(function (a, b) { return b.exibindo - a.exibindo || a.objeto_id - b.objeto_id; }))
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

    function renderTituloCard(titulo) {
        return (
            <div className="card texto" style={!titulo.exibindo ? { opacity: "40%" } : null}>
                <div className="data">
                    {"[T]"}
                </div>
                <div className="info">
                    <header>
                        <h1>{titulo.valor}</h1>
                        {titulo.exibindo ? <Imagem data={ICONS.CAMERA} /> : null}
                    </header>
                    <section>
                        {titulo.exibindo ?
                            <BotaoPrimario onClick={() => handleEsconderObjeto(titulo)}>Esconder</BotaoPrimario>
                            : <BotaoPrimario onClick={() => handleExibirObjeto(titulo, 1, true)}>Exibir</BotaoPrimario>}
                        <BotaoPrimario onClick={() => handleRemoverObjeto(titulo)}>Remover</BotaoPrimario>
                    </section>
                </div>
            </div>
        )
    }

    function renderTextoCard(texto) {
        return (
            <div className="card texto" style={!texto.exibindo ? { opacity: "40%" } : null}>
                <div className="data">
                    <Imagem data={ICONS.PONTO_INTERESSE} />
                </div>
                <div className="info">
                    <header>
                        <h1>{texto.valor}</h1>
                        {texto.exibindo ? <Imagem data={ICONS.CAMERA} /> : null}
                    </header>
                    <section>
                        {texto.exibindo ?
                            <BotaoPrimario onClick={() => handleEsconderObjeto(texto)}>Esconder</BotaoPrimario>
                            : <BotaoPrimario onClick={() => handleExibirObjeto(texto)}>Exibir</BotaoPrimario>}
                        <BotaoPrimario onClick={() => handleRemoverObjeto(texto)}>Remover</BotaoPrimario>
                    </section>
                </div>
            </div>
        )
    }

    return (
        <div className="config-cena-cenario">
            <header><h1>Configurações de Cena de Cenario</h1></header>
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
                    <div className="menu-titulo">
                        <header>Títulos</header>
                        <section>
                            {
                                titulos.map(titulo => {
                                    return renderTituloCard(titulo)
                                })
                            }
                        </section>
                    </div>
                </div>
            </section>
            <CriarObjetoModal
                campanhaId={campanhaId}
                cenaId={cenaId}
                tiposData={[CENA_OBJETOS_TIPO.IMAGEM, CENA_OBJETOS_TIPO.TEXTO, CENA_OBJETOS_TIPO.TITULO, CENA_OBJETOS_TIPO.TEMPLATE]}
                cenaObjetos={cenaObjetos}
                titulo={"Cenário"}
                isOpen={criarObjetoModal}
                setIsOpen={setCriarObjetoModal}
            />
        </div>
    )

}