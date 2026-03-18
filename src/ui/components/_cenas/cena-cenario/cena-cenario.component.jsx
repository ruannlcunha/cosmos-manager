import { CENA_OBJETOS_TIPO, ICONS } from "../../../../constants";
import { useVisualizarImagem } from "../../../../hook/api/imagem/visualizar-imagem.api";
import { Imagem } from "../../imagem/imagem.component";
import "./cena-cenario.style.css"
import { useEffect, useState } from "react";

export function CenaCenario({ cena, cenaObjetos, hudAtivo }) {
    const [imagem, setImagem] = useState(null)
    const [titulo, setTitulo] = useState("")
    const [textos, setTextos] = useState([])
    const { visualizarImagem } = useVisualizarImagem()

    useEffect(() => {
        fetchData()
    }, [cenaObjetos])


    async function fetchData() {
        const _titulo = cenaObjetos.find(obj => obj.tipo === CENA_OBJETOS_TIPO.TITULO && obj.exibindo)
        const _textos = cenaObjetos.filter(obj => obj.tipo === CENA_OBJETOS_TIPO.TEXTO && obj.exibindo)
        const _imagemObj = cenaObjetos.find(obj => obj.tipo === CENA_OBJETOS_TIPO.IMAGEM && obj.exibindo)
        if(_imagemObj) {
            const _imagemData = await visualizarImagem(_imagemObj.valor)
            const _imagem = { ..._imagemData, ..._imagemObj }
            setImagem(_imagem)
        }
        else {
            setImagem(null)
        }
        setTitulo(_titulo)
        setTextos(_textos.sort(function (a, b) { return a.objeto_id - b.objeto_id; }))
    }

    function renderTitulo() {
        return (
            <div className="titulo-cenario">
                <div className="titulo-ponta"></div>
                <h1>{titulo.valor}</h1>
                <div className="titulo-ponta"></div>
            </div>
        )
    }

    function renderPontoInteresse(texto) {
        return (
            <div className="ponto-interesse" key={texto.objeto_id}>
                <Imagem data={ICONS.PONTO_INTERESSE} />
                <h2>{texto.valor}</h2>
            </div>
        )
    }

    function renderImagem() {
        return (
            <div className="cenario-img-container">
                <Imagem data={imagem} />
            </div>
        )
    }


    return (
        <div className="cena-cenario-container" style={cena.fundo ? { backgroundImage: `url(${cena.fundo.dataUri})` } : null}>
            {titulo && hudAtivo ? renderTitulo() : null}
            <div className="ponto-interesse-container">
                {hudAtivo ?
                    textos.map(texto => {
                        return renderPontoInteresse(texto)
                    })
                : null}
            </div>
            {imagem && hudAtivo ? renderImagem() : null}
        </div>
    )
}
