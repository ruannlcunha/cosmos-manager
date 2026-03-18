import "./config-cena-dialogo.style.css"
import { useEffect, useState } from "react"
import { BotaoPrimario } from "../../botao-primario/botao-primario.component"
import { CENA_OBJETOS_TIPO, ICONS } from "../../../../constants"
import { Imagem } from "../../imagem/imagem.component"
import { useAlterarCenaObjeto } from "../../../../hook/api/campanha/alterar-cena-objeto.api"
import { useRemoverCenaObjeto } from "../../../../hook/api/campanha/remover-cena-objeto.api"
import { useToast } from "../../../../hook"
import { CriarObjetoModal } from "../../criar-objeto-modal/criar-objeto-modal.component"
import { IMAGES } from "../../../../constants/images"
import { useVisualizarImagem } from "../../../../hook/api/imagem/visualizar-imagem.api"
import { useVisualizarPersonagem } from "../../../../hook/api/personagem/visualizar-personagem.api"
import CLOUD_TEXTURE from "../../../../assets/img/textures/CLOUDS.png"
import { getTemplateCena } from "../../../../utils/get-template-cena.util"

export function ConfigCenaDialogo({ campanhaId, cenaId, cenaObjetos }) {
    const { alterarCenaObjeto } = useAlterarCenaObjeto()
    const { toastWarning } = useToast()
    const { removerCenaObjeto } = useRemoverCenaObjeto()
    const [criarObjetoModal, setCriarObjetoModal] = useState(false)
    const [titulos, setTitulos] = useState([])
    const [textos, setTextos] = useState([])
    const [imagens, setImagens] = useState([])
    const [personagensEsquerda, setPersonagensEsquerda] = useState([])
    const [personagensDireita, setPersonagensDireita] = useState([])
    const [templates, setTemplates] = useState([])
    const { visualizarImagem } = useVisualizarImagem()
    const { visualizarPersonagem } = useVisualizarPersonagem()

    useEffect(() => {
        fetchObjetos()
    }, [cenaObjetos])

    async function fetchObjetos() {
        const _titulos = cenaObjetos.filter(obj => obj.tipo === CENA_OBJETOS_TIPO.TITULO)
        const _textos = cenaObjetos.filter(obj => obj.tipo === CENA_OBJETOS_TIPO.TEXTO)
        const _personagensData = cenaObjetos.filter(obj => obj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA || obj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA)
        const _personagensEsquerda = []
        const _personagensDireita = []
        const _imagensData = cenaObjetos.filter(obj => obj.tipo === CENA_OBJETOS_TIPO.IMAGEM)
        const _imagensNova = []
        const _templates = cenaObjetos.filter(obj => obj.tipo === CENA_OBJETOS_TIPO.TEMPLATE)

        for (const personagem of _personagensData) {
            const _personagem = await visualizarPersonagem(personagem.valor)
            const personagemObj = { ..._personagem, ...personagem }
            if (personagemObj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA) _personagensEsquerda.push(personagemObj)
            if (personagemObj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA) _personagensDireita.push(personagemObj)
        }

        for (const obj of _imagensData) {
            const _imagem = await visualizarImagem(obj.valor)
            const imagemObj = { ..._imagem, ...obj }
            _imagensNova.push(imagemObj)
        }

        setPersonagensEsquerda(_personagensEsquerda.sort(function (a, b) { return b.exibindo - a.exibindo || a.objeto_id - b.objeto_id; }))
        setPersonagensDireita(_personagensDireita.sort(function (a, b) { return b.exibindo - a.exibindo || a.objeto_id - b.objeto_id; }))
        setTitulos(_titulos.sort(function (a, b) { return b.exibindo - a.exibindo || a.objeto_id - b.objeto_id; }))
        setImagens(_imagensNova.sort(function (a, b) { return b.exibindo - a.exibindo || a.objeto_id - b.objeto_id; }))
        setTextos(_textos.sort(function (a, b) { return b.exibindo - a.exibindo || a.objeto_id - b.objeto_id; }))
        setTemplates(_templates.sort(function (a, b) { return a.objeto_id - b.objeto_id; }))
    }

    async function handleExibirObjeto(objeto, limite, substituir) {
        const templateAtivo = cenaObjetos.find(obj=>obj.tipo === CENA_OBJETOS_TIPO.TEMPLATE && obj.exibindo)
        if(templateAtivo) {
            await alterarCenaObjeto(campanhaId, cenaId, templateAtivo.objeto_id, { exibindo: false })
        }

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
        const templateAtivo = cenaObjetos.find(obj=>obj.tipo === CENA_OBJETOS_TIPO.TEMPLATE && obj.exibindo)
        if(templateAtivo) {
            await alterarCenaObjeto(campanhaId, cenaId, templateAtivo.objeto_id, { exibindo: false })
        }
        await alterarCenaObjeto(campanhaId, cenaId, objeto.objeto_id, { exibindo: false })
    }

    async function handleExibirTemplate(objetoId, template) {
        for (const objeto of cenaObjetos) {
            const objTemplate = Object.values(template).find(_objetoId => _objetoId === objeto.objeto_id)
            if (objeto.exibindo && !objTemplate) {
                await alterarCenaObjeto(campanhaId, cenaId, objeto.objeto_id, { exibindo: false })
            }
        }

        for (const [key, value] of Object.entries(template)) {
            if (key !== "nome" && value) {
                const objeto = cenaObjetos.find(obj => obj.objeto_id === value && obj.tipo === key)
                if (!objeto.exibindo) {
                    await alterarCenaObjeto(campanhaId, cenaId, objeto.objeto_id, { exibindo: true })
                }
            }
        }
        await alterarCenaObjeto(campanhaId, cenaId, objetoId, { exibindo: true })
    }

    async function handleEsconderTemplate(objetoId, template) {
        for (const [key, value] of Object.entries(template)) {
            if (key !== "nome" && value) {
                const objeto = cenaObjetos.find(obj => obj.objeto_id === value && obj.tipo === key)
                if (objeto.exibindo) {
                    await alterarCenaObjeto(campanhaId, cenaId, objeto.objeto_id, { exibindo: false })
                }
            }
        }
        await alterarCenaObjeto(campanhaId, cenaId, objetoId, { exibindo: false })
    }

    async function handleRemoverObjeto(objeto) {
        await removerCenaObjeto(campanhaId, cenaId, objeto.objeto_id)
    }

    function renderTextoCard(obj) {
        return (
            <div className="card texto" style={!obj.exibindo ? { opacity: "40%" } : null}>
                <div className="data">
                    {"[T]"}
                </div>
                <div className="info">
                    <header>
                        <h1>{`(${obj.objeto_id}) ${obj.valor}`}</h1>
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

    function renderPersonagemCard(personagem) {
        const perfil = personagem.visualAtivo ? personagem.visualAtivo.perfil : IMAGES.PERFIL_GENERICO
        const corTema = personagem.cor_tema ? personagem.cor_tema : "cinza"
        return (
            <div className="card" style={!personagem.exibindo ? { opacity: "40%" } : null}>
                <div
                    className="data"
                    style={{
                        background: `url(${CLOUD_TEXTURE}), linear-gradient(var(--tema-${corTema}) 25%, var(--white) 100%)`,
                        backgroundSize: "200%",
                        backgroundPosition: "bottom",
                        backgroundRepeat: "no-repeat"
                    }}>
                    <Imagem data={perfil} />
                </div>
                <div className="info">
                    <header>
                        <h1><h1>{`(${personagem.objeto_id}) ${personagem.nome}`}</h1></h1>
                        {personagem.exibindo ? <Imagem data={ICONS.CAMERA} /> : null}
                    </header>
                    <section>
                        {personagem.exibindo ?
                            <BotaoPrimario onClick={() => handleEsconderObjeto(personagem)}>Esconder</BotaoPrimario>
                            : <BotaoPrimario onClick={() => handleExibirObjeto(personagem)}>Exibir</BotaoPrimario>}
                        <BotaoPrimario onClick={() => handleRemoverObjeto(personagem)}>Remover</BotaoPrimario>
                    </section>
                </div>
            </div>
        )
    }

    function renderImagemCard(img) {
        return (
            <div className="card" style={!img.exibindo ? { opacity: "40%" } : null}>
                <div className="data">
                    <Imagem data={img} />
                </div>
                <div className="info">
                    <header>
                        <h1><h1>{`(${img.objeto_id}) ${img.src}`}</h1></h1>
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

    function renderTemplateCard(template) {
        const templateValor = getTemplateCena(template.valor)
        return (
            <div className="card texto" style={!template.exibindo ? { opacity: "40%" } : null}>
                <div className="data">
                    <Imagem data={ICONS.CAMERA} />
                </div>
                <div className="info">
                    <header>
                        <h1>{`${templateValor.nome}`}</h1>
                        {template.exibindo ? <Imagem data={ICONS.CAMERA} /> : null}
                    </header>
                    <section>
                        {template.exibindo ?
                            <BotaoPrimario onClick={() => handleEsconderTemplate(template.objeto_id, templateValor)}>Esconder</BotaoPrimario>
                            : <BotaoPrimario onClick={() => handleExibirTemplate(template.objeto_id, templateValor)}>Exibir</BotaoPrimario>}
                        <BotaoPrimario onClick={() => handleRemoverObjeto(template)}>Remover</BotaoPrimario>
                    </section>
                </div>
            </div>
        )
    }

    return (
        <div className="config-cena-dialogo">
            <header><h1>Configurações de Cena de Diálogo</h1></header>
            <section>
                <BotaoPrimario onClick={() => setCriarObjetoModal(true)}>Criar objeto</BotaoPrimario>
                <div className="config-menus">
                    <div className="menu-template">
                        <header>Template</header>
                        <section>
                            {
                                templates.map(template => {
                                    return renderTemplateCard(template)
                                })
                            }
                        </section>
                    </div>
                    <div className="menu-imagens">
                        <header>Fundo (Imagem)</header>
                        <section>
                            {
                                imagens.map(img => {
                                    return renderImagemCard(img)
                                })
                            }
                        </section>
                    </div>
                    <div className="menu-personagens">
                        <header>Personagem Principal (Esquerda)</header>
                        <section>
                            {
                                personagensEsquerda.map(personagem => {
                                    return renderPersonagemCard(personagem)
                                })
                            }
                        </section>
                    </div>

                    <div className="menu-personagens">
                        <header>Personagem Secundário (Direita)</header>
                        <section>
                            {
                                personagensDireita.map(personagem => {
                                    return renderPersonagemCard(personagem)
                                })
                            }
                        </section>
                    </div>
                    <div className="menu-textos">
                        <header>Diálogo (Texto)</header>
                        <section>
                            {
                                textos.map(texto => {
                                    return renderTextoCard(texto)
                                })
                            }
                        </section>
                    </div>
                    <div className="menu-titulo">
                        <header>Nome Alternativo (Título)</header>
                        <section>
                            {
                                titulos.map(titulo => {
                                    return renderTextoCard(titulo)
                                })
                            }
                        </section>
                    </div>
                </div>
            </section>
            <CriarObjetoModal
                campanhaId={campanhaId}
                cenaId={cenaId}
                tiposData={[
                    CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA,
                    CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA,
                    CENA_OBJETOS_TIPO.IMAGEM,
                    CENA_OBJETOS_TIPO.TEXTO,
                    CENA_OBJETOS_TIPO.TITULO,
                    CENA_OBJETOS_TIPO.TEMPLATE,
                ]}
                cenaObjetos={cenaObjetos}
                titulo={"Diálogo"}
                isOpen={criarObjetoModal}
                setIsOpen={setCriarObjetoModal}
            />
        </div>
    )

}