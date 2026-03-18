import "./cena-dialogo.style.css"
import { CENA_OBJETOS_TIPO, ICONS } from "../../../../constants";
import { useVisualizarImagem } from "../../../../hook/api/imagem/visualizar-imagem.api";
import { Imagem } from "../../imagem/imagem.component";
import { useEffect, useState } from "react";
import { useVisualizarPersonagem } from "../../../../hook/api/personagem/visualizar-personagem.api";
import { IMAGES } from "../../../../constants/images";

export function CenaDialogo({ cena, cenaObjetos, hudAtivo }) {
    const [imagem, setImagem] = useState(null)
    const [titulo, setTitulo] = useState("")
    const [texto, setTexto] = useState("...")
    const [personagemEsquerda, setPersonagemEsquerda] = useState(null)
    const [personagemDireita, setPersonagemDireita] = useState(null)
    const { visualizarImagem } = useVisualizarImagem()
    const { visualizarPersonagem } = useVisualizarPersonagem()

    useEffect(() => {
        fetchData()
    }, [cenaObjetos])

    async function fetchData() {
        const _titulo = cenaObjetos.find(obj => obj.tipo === CENA_OBJETOS_TIPO.TITULO && obj.exibindo)
        const _texto = cenaObjetos.find(obj => obj.tipo === CENA_OBJETOS_TIPO.TEXTO && obj.exibindo)
        const _personagensData = cenaObjetos.filter(obj => obj.exibindo && (obj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA || obj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA))
        const _imagemObj = cenaObjetos.find(obj => obj.tipo === CENA_OBJETOS_TIPO.IMAGEM && obj.exibindo)
        if (_imagemObj) {
            const _imagemData = await visualizarImagem(_imagemObj.valor)
            const _imagem = { ..._imagemData, ..._imagemObj }
            setImagem(_imagem)
        }
        else {
            setImagem(null)
        }

        let personagemEsquerda = null
        let personagemDireita = null
        for (const personagem of _personagensData) {
            const _personagem = await visualizarPersonagem(personagem.valor)
            const personagemObj = { ..._personagem, ...personagem }
            if (personagemObj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA) personagemEsquerda = personagemObj
            if (personagemObj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA) personagemDireita = personagemObj
        }
        setPersonagemEsquerda(personagemEsquerda)
        setPersonagemDireita(personagemDireita)
        _titulo ? setTitulo(_titulo) : setTitulo("")
        _texto ? setTexto(_texto.valor) : setTexto("")
    }

    function renderPersonagemPerfil(personagem, secundario) {
        const perfil = personagem.visualAtivo ? personagem.visualAtivo.perfil : IMAGES.PERFIL_GENERICO
        return (
            <Imagem data={perfil} style={secundario ? { opacity: "90%", filter: "brightness(10%)" } : { transform: "scaleX(-1)" }} />
        )
    }

    return (
        <div className="cena-dialogo-container" style={
            imagem ? { backgroundImage: `url(${imagem.dataUri})` } : cena.fundo ? { backgroundImage: `url(${cena.fundo.dataUri})` } : null
        }>
            {personagemEsquerda || personagemDireita || titulo || texto ?
                <div className="dialogo-container">
                    <section className="personagens-section">
                        {personagemEsquerda ? renderPersonagemPerfil(personagemEsquerda, false) : <div></div>}
                        {personagemDireita ? renderPersonagemPerfil(personagemDireita, true) : <div></div>}
                    </section>
                    <section className="dialogo-section">
                        <header>{titulo ? <h1>{titulo.valor}</h1> : personagemEsquerda ? <h1>{personagemEsquerda.nome}</h1> : null}</header>
                        <section>
                            <p>{texto}</p>
                        </section>
                    </section>
                </div>
            :null}
        </div>
    )
}
