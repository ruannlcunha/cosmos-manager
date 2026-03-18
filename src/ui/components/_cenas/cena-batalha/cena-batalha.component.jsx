import "./cena-batalha.style.css"
import pixelTexture from "../../../../assets/img/textures/BANNER_TEXTURE.png";
import { useVisualizarPersonagem } from "../../../../hook/api/personagem/visualizar-personagem.api";
import { useEffect, useState } from "react";
import { CENA_OBJETOS_TIPO, ICONS, USER_ROLE } from "../../../../constants";
import { Imagem } from "../../imagem/imagem.component";
import { useNavigate } from "react-router-dom";
import { ACOES_BATALHA, CONDICOES } from "../../../../constants/regras-sistema/regras-sistema.constant";
import { IMAGES } from "../../../../constants/images/images.constant";
import useGlobalUser from "../../../../context/user/global-user.context";
import { useListarUsuariosPersonagens } from "../../../../hook/api/usuario/listar-usuario-personagens.api";
import { useCriarCenaObjeto } from "../../../../hook/api/campanha/criar-cena-objeto.api";
import { useAlterarCenaObjeto } from "../../../../hook/api/campanha/alterar-cena-objeto.api";

export function CenaBatalha({ cena, cenaObjetos, hudAtivo }) {
    const [personagens, setPersonagens] = useState([])
    const [personagemSelecionado, setPersonagemSelecionado] = useState({ objeto_id: null })
    const [titulo, setTitulo] = useState({})
    const [personagemTurno, setPersonagemTurno] = useState({ objeto_id: null })
    const [user] = useGlobalUser()
    const [acoesHud, setAcoesHud] = useState(false)
    const { criarCenaObjeto } = useCriarCenaObjeto()
    const { alterarCenaObjeto } = useAlterarCenaObjeto()
    const { visualizarPersonagem } = useVisualizarPersonagem()
    const { usuariosPersonagens, listarUsuariosPersonagens } = useListarUsuariosPersonagens()
    const navigate = useNavigate()

    useEffect(() => {
        if(cenaObjetos.length) {
            fetchData()
        }
    }, [cenaObjetos])

    async function fetchData() {
        await listarUsuariosPersonagens(user.id)
        const personagensData = cenaObjetos.filter(obj=> obj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA || obj.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA)
        const novosPersonagens = []
        for (const personagemData of personagensData) {
            if (personagemData.exibindo) {
                const _personagem = await visualizarPersonagem(personagemData.valor)
                novosPersonagens.push({ ...personagemData, ..._personagem })
            }
        }
        setPersonagens([...novosPersonagens])

        const tituloData = cenaObjetos.find(obj=> obj.tipo === CENA_OBJETOS_TIPO.TITULO)
        let tituloNovo = {valor: "", tipo: CENA_OBJETOS_TIPO.TITULO}
        if(!tituloData) {
            const objetoId = await criarCenaObjeto(cena.campanha_id, cena.id, tituloNovo)
            tituloNovo = {...tituloNovo, objeto_id: objetoId}
        }
        else {
            tituloNovo = tituloData
        }
        setTitulo(tituloNovo)
        const _personagemTurno = novosPersonagens.find(personagem=> personagem.objeto_id == tituloNovo.valor)
        if(_personagemTurno) { 
            setPersonagemTurno({...tituloNovo, ..._personagemTurno})
        }
        else {
            setPersonagemTurno({objeto_id: null})
        }
    }

    function _calcularPorcentagem(atual, maximo) {
        return (atual / maximo) * 100
    }

    function getCondicoes(personagem) {
        const novasCondicoes = []
        Object.entries(personagem.condicoes).map(([key, value]) => {
            const condicaoData = CONDICOES.find(_condicao => _condicao.nome.toLowerCase() === key)
            if (condicaoData && value) {
                novasCondicoes.push(condicaoData)
            }
        })
        return novasCondicoes
    }

    function _getPersonagemRender(personagens, posicaoArr) {
        if (posicaoArr >= personagens.length) {
            return null
        }
        return renderPersonagem(personagens[posicaoArr])
    }

    function handleAcoes() {
        acoesHud ? setAcoesHud(false) : setAcoesHud(true)
    }

    function handleClicarPersonagem(personagem) {
        if (personagem.objeto_id === personagemSelecionado.objeto_id) {
            setPersonagemSelecionado({ objeto_id: null })
            return
        }
        setPersonagemSelecionado(personagem)
    }

    async function handleAssumirTurno(personagem) {
        if(personagem.objeto_id === personagemTurno.objeto_id) {
            await alterarCenaObjeto(cena.campanha_id, cena.id, titulo.objeto_id, { valor: "" })
            setPersonagemTurno({objeto_id: null})
            return
        }
        await alterarCenaObjeto(cena.campanha_id, cena.id, titulo.objeto_id, { valor: personagem.objeto_id })
        const personagemNovo = {...titulo, ...personagem}
        setPersonagemTurno(personagemNovo)
    }

    function renderTurnos() {
        return (
            <div className="turnos">
                <header>Turno</header>
                <section>
                    <div className="turnos-ponta"></div>
                    {
                        personagens.map(_personagem => {
                            const ativo = _personagem.objeto_id === personagemTurno.objeto_id
                            const perfil = _personagem.visualAtivo ? _personagem.visualAtivo.perfil.dataUri : IMAGES.PERFIL_GENERICO.src
                            return <div key={_personagem.objeto_id}
                                style={{
                                    backgroundImage: `url(${perfil})`,
                                    backgroundColor: `var(--${_personagem.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA ? "dark-red" : "blue"})`
                                }}
                                className={ativo && _personagem.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA ? "turnos-ativo inimigo" : ativo ? "turnos-ativo aliado" : null}
                            ></div>
                        })
                    }
                    <div className="turnos-ponta"></div>
                </section>
            </div>
        )
    }

    function renderAcoes() {
        return (
            <>
                <ul className="hud-acoes">
                    <li onClick={handleAcoes}>
                        Ações
                    </li>

                    <li onClick={() => navigate(`/personagem/${personagemSelecionado.id}`)}>
                        Ver ficha
                    </li>

                    <li onClick={() => { handleAssumirTurno(personagemSelecionado) }}>
                        Assumir turno
                    </li>
                </ul>
                {acoesHud ?
                    <div className="hud-sub-acoes">
                        <header className="sub-acoes-header">Ações</header>
                        <section className="sub-acoes-section">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Ação</th>
                                        <th>Descrição</th>
                                    </tr>
                                    {
                                        ACOES_BATALHA.map(acao => {
                                            return <tr>
                                                <th>{acao.nome}</th>
                                                <td><p>{acao.descricao}</p></td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </section>
                    </div>
                    : null}
            </>
        )
    }

    function renderHud() {
        const condicoes = getCondicoes(personagemSelecionado)
        const permissaoUsuario = user.role === USER_ROLE.ADM || usuariosPersonagens.some(up => up.personagem_id === personagemSelecionado.id)
        const derrotado = (!personagemSelecionado.pontos.pv_atual) && (personagemSelecionado.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA || permissaoUsuario)
        const emCrise = Number(personagemSelecionado.pontos.pv_atual) <= (Number(personagemSelecionado.pontos.pv_maximo) / 2) && (personagemSelecionado.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA || permissaoUsuario)
        const perfil = personagemSelecionado.visualAtivo ? personagemSelecionado.visualAtivo.perfil : IMAGES.PERFIL_GENERICO
        const corTema = personagemSelecionado.cor_tema ? personagemSelecionado.cor_tema : "cinza"
        return (
            <div
                className="batalha-hud"
            >
                <section
                    className="hud-status"
                    style={{
                        background: `url(${pixelTexture}) right,
                        linear-gradient(to right, 
                        var(--tema-${corTema}) 0%, var(--tema-${corTema}) 90%, transparent 99%, transparent 100%)`
                    }}
                >
                    <div
                        className="perfil-personagem"
                    >
                        <Imagem
                            data={perfil}
                            style={derrotado ? { filter: "saturate(0%) brightness(25%)" } : emCrise ? { animation: "sprite-em-crise 1.5s ease-in-out alternate infinite" } : null}
                        />
                    </div>

                    <header className="status-header">
                        <div>
                            <h1>{personagemSelecionado.nome}</h1>
                            {personagemSelecionado.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA || permissaoUsuario ?
                                <Imagem data={ICONS[`ELEMENTO_${personagemSelecionado.afinidade_elemental}`]} />
                                : null
                            }
                        </div>
                    </header>
                    <section className="status-section">
                        <div>
                            <h2>
                                {personagemSelecionado.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA || permissaoUsuario ?
                                    `PV: ${personagemSelecionado.pontos.pv_atual}/${personagemSelecionado.pontos.pv_maximo}`
                                    : `PV: ?/?`
                                }
                            </h2>
                            {condicoes
                                .sort(function (a, b) {
                                    return a.nome.localeCompare(b.nome);
                                })
                                .map((condicao, i) => {
                                    return (
                                        <Imagem
                                            key={i}
                                            data={condicao.icon}
                                        />
                                    );
                                })
                            }
                        </div>

                        <div
                            className="batalha-hud-barra"
                            style={personagemSelecionado.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA || permissaoUsuario ?
                                {
                                    background: `linear-gradient(to right, 
                                var(--red)${_calcularPorcentagem(personagemSelecionado.pontos.pv_atual, personagemSelecionado.pontos.pv_maximo)}%, 
                                var(--light-grey) 1%)`
                                } : { background: `linear-gradient(to right, var(--grey) 100%, var(--light-grey) 1%)` }
                            }
                        ></div>

                        <div>
                            <h2>
                                {personagemSelecionado.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA || permissaoUsuario ?
                                    `PM: ${personagemSelecionado.pontos.pm_atual}/${personagemSelecionado.pontos.pm_maximo}`
                                    : `PM: ?/?`
                                }
                            </h2>
                        </div>

                        <div
                            className="batalha-hud-barra"
                            style={personagemSelecionado.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA || permissaoUsuario ?
                                {
                                    background: `linear-gradient(to right, 
                                var(--blue) ${_calcularPorcentagem(personagemSelecionado.pontos.pm_atual, personagemSelecionado.pontos.pm_maximo)}%, 
                                var(--light-grey) 1%)`
                                } : { background: `linear-gradient(to right, var(--grey) 100%, var(--light-grey) 1%)` }
                            }
                        ></div>
                    </section>
                </section>
                {permissaoUsuario ? renderAcoes() : null}
            </div >
        )
    }

    function renderPersonagem(personagem) {
        const condicoes = getCondicoes(personagem)
        const permissaoUsuario = user.role === USER_ROLE.ADM || usuariosPersonagens.some(up => up.personagem_id === personagem.id)
        const derrotado = (!personagem.pontos.pv_atual) && (personagem.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA || permissaoUsuario)
        const emCrise = Number(personagem.pontos.pv_atual) <= (Number(personagem.pontos.pv_maximo) / 2) && (personagem.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA || permissaoUsuario)
        const sprite = personagem.visualAtivo ? personagem.visualAtivo.sprite : IMAGES.SPRITE_GENERICO
        return (
            <div onClick={hudAtivo?() => handleClicarPersonagem(personagem):null}>

                {hudAtivo ?
                    <div className="icones-container"
                        style={personagem.objeto_id === personagemSelecionado.objeto_id ? { backgroundImage: `url(${ICONS.SETA_SELECAO.src})` } : null}
                    >
                    </div>
                    : null}

                <Imagem
                    data={sprite}
                    style={derrotado ? { filter: "saturate(0%) brightness(25%)" } : emCrise ? { animation: "sprite-em-crise 1.5s ease-in-out alternate infinite" } : null}
                    className={`sprite-personagem${hudAtivo? " hud-ativo":""}`}
                />
                
                    <section style={!hudAtivo?{opacity: "0%"}:null}>
                        <div className="batalha-sprite-nome">
                            {personagem.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA || permissaoUsuario ?
                                <Imagem data={ICONS[`ELEMENTO_${personagem.afinidade_elemental}`]} />
                                : null
                            }
                            {personagem.nome}
                        </div>

                        <div
                            className="batalha-sprite-pontos"
                            style={personagem.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA || permissaoUsuario ?
                                {
                                    background: `linear-gradient(to right, 
                            var(--red) ${_calcularPorcentagem(personagem.pontos.pv_atual, personagem.pontos.pv_maximo)}%, 
                            var(--light-grey) 1%)`
                                }
                                : { background: `linear-gradient(to right, var(--grey) 100%, var(--light-grey) 1%)` }
                            }
                        ></div>
                        <div
                            className="batalha-sprite-pontos"
                            style={personagem.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA || permissaoUsuario ?
                                {
                                    background: `linear-gradient(to right, 
                            var(--blue) ${_calcularPorcentagem(personagem.pontos.pm_atual, personagem.pontos.pm_maximo)}%, 
                            var(--light-grey) 1%)`
                                }
                                : { background: `linear-gradient(to right, var(--grey) 100%, var(--light-grey) 1%)` }
                            }
                        ></div>

                        <div className="condicoes">
                            {condicoes
                                .sort(function (a, b) {
                                    return a.nome.localeCompare(b.nome);
                                })
                                .map(condicao => {
                                    return <Imagem data={condicao.icon} />
                                })
                            }
                        </div>
                    </section>
            </div>
        )
    }

    function renderCampoBatalha() {
        const personagensEsquerda = personagens.filter(_personagem => _personagem.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_ESQUERDA)
        const personagensDireita = personagens.filter(_personagem => _personagem.tipo === CENA_OBJETOS_TIPO.PERSONAGEM_DIREITA)
        return (
            <div className="campo-de-batalha">
                <section>
                    <div className="esquerda">
                        <section>
                            {_getPersonagemRender(personagensEsquerda, 4)}
                            {_getPersonagemRender(personagensEsquerda, 3)}
                        </section>
                        <section>
                            {_getPersonagemRender(personagensEsquerda, 2)}
                            {_getPersonagemRender(personagensEsquerda, 1)}
                        </section>
                        <section>
                            {_getPersonagemRender(personagensEsquerda, 5)}
                            {_getPersonagemRender(personagensEsquerda, 0)}
                        </section>
                    </div>
                    <div className="direita">
                        <section>
                            {_getPersonagemRender(personagensDireita, 5)}
                            {_getPersonagemRender(personagensDireita, 0)}
                        </section>
                        <section>
                            {_getPersonagemRender(personagensDireita, 2)}
                            {_getPersonagemRender(personagensDireita, 1)}
                        </section>
                        <section>
                            {_getPersonagemRender(personagensDireita, 4)}
                            {_getPersonagemRender(personagensDireita, 3)}
                        </section>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="cena-batalha-container" style={cena.fundo ? { backgroundImage: `url(${cena.fundo.dataUri})` } : null}>
            {hudAtivo ? renderTurnos() : null}
            {hudAtivo && personagemSelecionado.objeto_id ? renderHud() : null}
            {personagens.length ? renderCampoBatalha() : null}
        </div>
    )
}
