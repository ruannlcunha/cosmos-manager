import "./card-personagem.style.css"
import CLOUD_TEXTURE from "../../../assets/img/textures/CLOUDS.png"
import { Imagem } from "../imagem/imagem.component"
import { IMAGES } from "../../../constants/images"
import { ICONS, USER_ROLE } from "../../../constants"
import { BotaoPrimario } from "../botao-primario/botao-primario.component"
import useGlobalUser from "../../../context/user/global-user.context"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export function CardPersonagem({ personagem, haveConfig }) {
    const [user] = useGlobalUser()
    const [emCrise, setEmCrise] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (personagem) {
            setEmCrise(Number(personagem.pontos.pv_atual) <= (Number(personagem.pontos.pv_maximo) / 2))
        }
    }, [personagem])

    function renderPontos(atual, maximo, cor, icon) {
        const porcentagemValor = (atual / maximo) * 100
        return (
            <div className="ponto-container">
                <div className="barra-pontos-container">
                    <div
                        className="batalha-hud-barra"
                        style={{
                            background: `linear-gradient(to right, var(--${cor}) ${maximo != undefined ? `${porcentagemValor}` : "100"}%, var(--light-grey) 1%)`
                        }}
                    >
                        <Imagem data={icon} />
                        <h3>{atual}/{maximo}</h3>
                    </div>
                </div>
            </div>
        )
    }

    return personagem ? (
        <div className="card-personagem-container">
            <div
                className={`card-personagem`}
                style={{
                    background: `url(${CLOUD_TEXTURE}), linear-gradient(var(--tema-${personagem.cor_tema}) 25%, var(--white) 100%)`,
                    backgroundSize: "200%",
                    backgroundPosition: "bottom",
                    backgroundRepeat: "no-repeat"
                }}>
                <div className="personagem-imagens">
                    {personagem.simbolo ?
                     <Imagem data={personagem.simbolo} className={"personagem-simbolo"} />
                     : <Imagem data={ICONS[`ELEMENTO_${personagem.afinidade_elemental}`]} className={"personagem-simbolo"} />
                     }
                    <Imagem
                        data={personagem.visualAtivo ? personagem.visualAtivo.perfil : IMAGES.PERFIL_GENERICO} className={"personagem-perfil"}
                        style={
                            !personagem.pontos.pv_atual ? { filter: "saturate(0%) brightness(25%)" }
                                : emCrise ? { animation: "sprite-em-crise 1.5s ease-in-out alternate infinite" }
                                    : null
                        }
                    />
                </div>
                <div className="hud-section">
                    <header className="hud-header">
                        <div className="nome-container">
                            <Imagem data={ICONS[`ELEMENTO_${personagem.afinidade_elemental}`]} className={"personagem-elemento"} />
                            <h1>{personagem.nome}</h1>
                        </div>
                        <div className="pf-container">
                            <Imagem data={ICONS.PF} />
                            <h2>{personagem.pontos.pf}</h2>
                        </div>
                    </header>
                    <section className="status-section">
                        {renderPontos(personagem.pontos.pv_atual, personagem.pontos.pv_maximo, "red", ICONS.PV)}
                        {renderPontos(personagem.pontos.pm_atual, personagem.pontos.pm_maximo, "pure-blue", ICONS.PM)}
                    </section>
                </div>
            </ div>
            {haveConfig && user.role === USER_ROLE.ADM ? <div className="configuracoes">
                <BotaoPrimario style={{ padding: "0" }}><Imagem data={ICONS.CONFIGURACAO} /></BotaoPrimario>
                <BotaoPrimario onClick={() => { navigate(`/personagem/${personagem.id}`) }}>Acessar Ficha</BotaoPrimario>
            </div> : null}
        </div>
    ) : null

}