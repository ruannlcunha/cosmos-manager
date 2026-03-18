import { useEffect, useState } from "react"
import { BotaoPrimario } from "../../botao-primario/botao-primario.component"
import "./config-cena-batalha.style.css"
import { CENA_OBJETOS_TIPO, ICONS } from "../../../../constants"
import { useVisualizarPersonagem } from "../../../../hook/api/personagem/visualizar-personagem.api"
import { Imagem } from "../../imagem/imagem.component"
import { IMAGES } from "../../../../constants/images"
import { useAlterarCenaObjeto } from "../../../../hook/api/campanha/alterar-cena-objeto.api"
import { useRemoverCenaObjeto } from "../../../../hook/api/campanha/remover-cena-objeto.api"
import { useToast } from "../../../../hook"
import { CriarObjetoModal } from "../../criar-objeto-modal/criar-objeto-modal.component"
import CLOUD_TEXTURE from "../../../../assets/img/textures/CLOUDS.png"

export function ConfigCenaBatalha({ campanhaId, cenaId, cenaObjetos }) {
    const [personagensEsquerda, setPersonagensEsquerda] = useState([])
    const [personagensDireita, setPersonagensDireita] = useState([])
    const { visualizarPersonagem } = useVisualizarPersonagem()
    const { alterarCenaObjeto } = useAlterarCenaObjeto()
    const { toastWarning } = useToast()
    const { removerCenaObjeto } = useRemoverCenaObjeto()
    const [criarObjetoModal, setCriarObjetoModal] = useState(false)

    useEffect(() => {
        fetchObjetos()
    }, [cenaObjetos])

    async function fetchObjetos() {
        const _personagensEsquerda = []
        const _personagensDireita = []
        const personagensData = cenaObjetos.filter(obj=> obj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA || obj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA)
        for(const obj of personagensData) {
            const _personagem = await visualizarPersonagem(obj.valor)
            const personagemObj = {..._personagem, ...obj}
            if(personagemObj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA) {
                _personagensEsquerda.push(personagemObj)
            }
            if(personagemObj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA) {
                _personagensDireita.push(personagemObj)
            }
        }
        
        setPersonagensEsquerda(_personagensEsquerda.sort(function (a, b) { return a.objeto_id - b.objeto_id; }))
        setPersonagensDireita(_personagensDireita.sort(function (a, b) { return a.objeto_id - b.objeto_id; }))
    }

    async function handleExibirObjeto(objeto) {
        const _tipo = objeto.tipo
        const objetosFiltrados = cenaObjetos.filter(obj=> obj.tipo === _tipo && obj.exibindo)
        if(objetosFiltrados.length<6) {
            await alterarCenaObjeto(campanhaId, cenaId, objeto.objeto_id, { exibindo: true })
            return
        }
        toastWarning("Só podem ser exibidos 6 personagens em cada lado.")
    }

    async function handleEsconderObjeto(objeto) {
        await alterarCenaObjeto(campanhaId, cenaId, objeto.objeto_id, { exibindo: false })
    }

    async function handleRemoverObjeto(objeto) {
        await removerCenaObjeto(campanhaId, cenaId, objeto.objeto_id)
    }

    function renderPersonagemCard(personagem) {
        const perfil = personagem.visualAtivo ? personagem.visualAtivo.perfil : IMAGES.PERFIL_GENERICO
        const corTema = personagem.cor_tema ? personagem.cor_tema : "cinza"
        return (
            <div className="card" style={!personagem.exibindo ? {opacity: "40%"} : null}>
                <div
                className="data"
                style={{
                    background: `url(${CLOUD_TEXTURE}), linear-gradient(var(--tema-${corTema}) 25%, var(--white) 100%)`,
                    backgroundSize: "200%",
                    backgroundPosition: "bottom",
                    backgroundRepeat: "no-repeat"
                }}>
                    <Imagem data={perfil}/>
                </div>
                <div className="info">
                    <header>
                        <h1>{personagem.nome}</h1>
                        {personagem.exibindo ? <Imagem data={ICONS.CAMERA} /> : null}
                    </header>
                    <section>
                        {personagem.exibindo ?
                            <BotaoPrimario onClick={()=>handleEsconderObjeto(personagem)}>Esconder</BotaoPrimario>
                            : <BotaoPrimario onClick={()=>handleExibirObjeto(personagem)}>Exibir</BotaoPrimario>}
                        <BotaoPrimario onClick={()=>handleRemoverObjeto(personagem)}>Remover</BotaoPrimario>
                    </section>
                </div>
            </div>
        )
    }

    return (
        <div className="config-cena-batalha">
            <header><h1>Configurações de Cena de Batalha</h1></header>
            <section>
                <BotaoPrimario onClick={()=>setCriarObjetoModal(true)}>Criar objeto</BotaoPrimario>
                <div className="config-menus">
                    <div className="menu-personagens">
                        <header>Personagens Esquerda</header>
                        <section>
                            {
                                personagensEsquerda.map(personagem => {
                                    return renderPersonagemCard(personagem)
                                })
                            }
                        </section>
                    </div>

                    <div className="menu-personagens">
                        <header>Personagens Direita</header>
                        <section>
                            {
                                personagensDireita.map(personagem => {
                                    return renderPersonagemCard(personagem)
                                })
                            }
                        </section>
                    </div>
                </div>
            </section>
            <CriarObjetoModal
            campanhaId={campanhaId}
            cenaId={cenaId}
            tiposData={[CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA, CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA]}
            titulo={"Batalha"}
            isOpen={criarObjetoModal}
            setIsOpen={setCriarObjetoModal}
            />
        </div>
    )

}