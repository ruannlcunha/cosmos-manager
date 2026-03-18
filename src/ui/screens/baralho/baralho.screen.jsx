import "./baralho.style.css"
import { BackButton, BotaoPrimario, ContainerScreen, Imagem, Modal } from "../../components"
import { CARTAS_MAGICAS, CARTEADOR_HABILIDADES, CONJUNTOS_CARTAS } from "../../../constants/cartas-magicas.constant"
import { CARTAS_IMAGEM } from "../../../constants/images/cartas-imagem.constant"
import { useEffect, useState } from "react"
import { useSocket, useToast } from "../../../hook"
import { useVisualizarPersonagem } from "../../../hook/api/personagem/visualizar-personagem.api"
import { useVerificarConexao } from "../../../hook/api/_base/verificar-conexao.api"
import useGlobalUser from "../../../context/user/global-user.context"
import { useNavigate, useParams } from "react-router-dom"
import useGlobalDataOffline from "../../../context/data-offline/global-data-offline.context"
import { useEmbaralharCartas } from "../../../hook/api/personagem/embaralhar-cartas.api"
import { useAlterarCarta } from "../../../hook/api/personagem/alterar-carta.api"
import { useMontarBaralho } from "../../../hook/api/personagem/montar-baralho.api"

export function BaralhoScreen({ modoOffline }) {
    const { toastWarning } = useToast()
    const { personagem, setPersonagem, visualizarPersonagem } = useVisualizarPersonagem();
    const { conexao, verificarConexao } = useVerificarConexao()
    const { socket } = useSocket();
    const [user] = useGlobalUser()
    const navigate = useNavigate()
    const { personagemId } = useParams();
    const [baralho, setBaralho] = useState([])
    const [dataOffline, setDataOffline] = useGlobalDataOffline();
    const [mao, setMao] = useState([])
    const [descarte, setDescarte] = useState([])
    const [baralhoModal, setBaralhoModal] = useState(false)
    const [maoModal, setMaoModal] = useState(false)
    const [descarteModal, setDescarteModal] = useState(false)
    const [pilhaModal, setPilhaModal] = useState(false)
    const [habilidadesModal, setHabilidadesModal] = useState(false)
    const [trocarBaralhoModal, setTrocarBaralhoModal] = useState(false)
    const [pacotesCartas, setPacoteCartas] = useState([])
    const [cartaEscolhida, setCartaEscolhida] = useState(null)
    const { embaralharCartas } = useEmbaralharCartas()
    const { alterarCarta } = useAlterarCarta()
    const { montarBaralho } = useMontarBaralho()

    useEffect(() => {
        verificarConexao()
    }, [])

    useEffect(() => {
        if (conexao.result && !modoOffline) {
            visualizarPersonagem(personagemId, user.id);
            socket.on("personagens", async () => {
                visualizarPersonagem(personagemId, user.id)
            });
        }
        else if (modoOffline) {
            setPersonagem(dataOffline.personagem);
        }

    }, [conexao.result, personagemId]);

    useEffect(() => {
        if (personagem) {
            if (dataOffline) setDataOffline({ ...dataOffline, personagem })
            fetchCards()
        }
    }, [personagem])

    useEffect(() => {
        if (!maoModal) {
            setCartaEscolhida(null)
        }
    }, [maoModal])

    console.log(baralho)
    console.log(mao)
    console.log(descarte)

    function _embaralhar(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function fetchCards() {
        if (!personagem.baralho) {
            toastWarning("O personagem não possui um baralho. Verifique com um administrador.")
            navigate(-1)
            return
        }

        const baralhoCartas = personagem.baralho.cartas.map(carta => {
            const cartaImg = CARTAS_MAGICAS[carta.naipe].find(_carta => _carta.nome === carta.nome).img
            return { ...carta, img: cartaImg }
        })

        const pacotes = [personagem.baralho.conjunto1, personagem.baralho.conjunto2, personagem.baralho.conjunto3, personagem.baralho.conjunto4]
        .sort(function (a, b) { return a - b; })
        setPacoteCartas(pacotes)

        setMao(baralhoCartas.filter(carta => carta.mesa === "MAO").sort(function (a, b) { return a.posicao_arr - b.posicao_arr; }))
        setBaralho(baralhoCartas.filter(carta => carta.mesa === "BARALHO").sort(function (a, b) { return a.posicao_arr - b.posicao_arr; }))
        setDescarte(baralhoCartas.filter(carta => carta.mesa === "DESCARTE").sort(function (a, b) { return a.posicao_arr - b.posicao_arr; }))
    }

    async function handleEmbaralhar() {
        const cartasEmbaralhadas = _embaralhar([...baralho, ...mao, ...descarte])

        const maoNova = [...cartasEmbaralhadas].slice(-5)
            .map((carta, i) => { return { ...carta, mesa: "MAO", posicao_arr: i } })
            .sort(function (a, b) { return a.posicao_arr - b.posicao_arr; })

        const baralhoNovo = [...cartasEmbaralhadas].slice(0, cartasEmbaralhadas.length - 5)
            .map((carta, i) => { return { ...carta, mesa: "BARALHO", posicao_arr: i } })
            .sort(function (a, b) { return a.posicao_arr - b.posicao_arr; })

        const novasCartas = [...maoNova, ...baralhoNovo]
        await embaralharCartas(personagemId, { cartas: novasCartas })

        setMao(maoNova)
        setBaralho(baralhoNovo)
        setDescarte([])
    }

    async function handleDevolverDescarte() {
        const descarteEmbaralhado = _embaralhar([...descarte])
        const baralhoNovo = [...descarteEmbaralhado, ...baralho]
            .map((carta, i) => { return { ...carta, mesa: "BARALHO", posicao_arr: i } })
            .sort(function (a, b) { return a.posicao_arr - b.posicao_arr; })

        const novasCartas = [...mao, ...baralhoNovo]
        await embaralharCartas(personagemId, { cartas: novasCartas })

        setBaralho(baralhoNovo)
        setDescarte([])
        setDescarteModal(false)
    }

    function handleEscolherCarta(carta) {
        setCartaEscolhida(carta)
        setMaoModal(true)
    }

    async function handleDescartar(carta) {
        const maoNova = mao.filter(_carta => _carta.id !== carta.id)
            .map((carta, i) => { return { ...carta, posicao_arr: i } })
            .sort(function (a, b) { return a.posicao_arr - b.posicao_arr; })

        const descarteNova = [...descarte, { ...carta, mesa: "DESCARTE", posicao_arr: descarte.length }]
            .map((carta, i) => { return { ...carta, posicao_arr: i } })
            .sort(function (a, b) { return a.posicao_arr - b.posicao_arr; })

        await alterarCarta(personagemId, carta.id, { mesa: "DESCARTE", posicao_arr: descarte.length })
        setDescarte(descarteNova)
        setMao(maoNova)
        setMaoModal(false)
    }

    async function handlePegarDescarte(carta) {
        if (mao.length < 5) {
            const descarteNova = descarte.filter(_carta => _carta.id !== carta.id)
                .map((carta, i) => { return { ...carta, posicao_arr: i } })
                .sort(function (a, b) { return a.posicao_arr - b.posicao_arr; })

            const maoNova = [...mao, { ...carta, mesa: "MAO", posicao_arr: descarte.length }]
                .map((carta, i) => { return { ...carta, posicao_arr: i } })
                .sort(function (a, b) { return a.posicao_arr - b.posicao_arr; })

            await alterarCarta(personagemId, carta.id, { mesa: "MAO", posicao_arr: descarte.length })
            setDescarte(descarteNova)
            setMao(maoNova)
            setPilhaModal(false)
            return
        }
        toastWarning("Sua mão já possui o máximo de cartas.")
    }

    async function handlePegarCarta() {
        if (mao.length < 5) {
            const baralhoNovo = [...baralho]
            const cartaNova = baralhoNovo.pop()
            const maoNova = [...mao, { ...cartaNova, mesa: "MAO", posicao_arr: mao.length }]

            await alterarCarta(personagemId, cartaNova.id, { mesa: "MAO", posicao_arr: maoNova.length })
            setBaralho(baralhoNovo)
            setMao(maoNova)
            setBaralhoModal(false)
            return
        }
        toastWarning("Sua mão já possui o máximo de cartas.")
    }

    function handleVisualizarDescarte() {
        setPilhaModal(true)
        setDescarteModal(false)
    }

    async function handleTrocarBaralho() {
        if(pacotesCartas.length===4) {
            const novasCartas = []
            pacotesCartas.map(pacote=> {
                const cartas = CARTAS_MAGICAS[pacote]
                novasCartas.push(cartas)
            })

            await montarBaralho(personagemId, {
                conjunto1: pacotesCartas[0],
                conjunto2: pacotesCartas[1],
                conjunto3: pacotesCartas[2],
                conjunto4: pacotesCartas[3],
                cartas: novasCartas
            })
            setTrocarBaralhoModal(false)
            return
        }
        toastWarning("É necessário 4 pacotes para montar um baralho.")
    }

    function handleSelecionarPacote(pacote) {
        if (pacotesCartas.length < 4) {
            const novoPacote = [...pacotesCartas, pacote.nome].sort(function (a, b) { return a - b; })
            setPacoteCartas(novoPacote)
            return
        }
        toastWarning("Você só pode selecionar 4 pacotes ao todo.")
    }

    function handleRemoverPacote(pacote) {
        const novoPacote = [...pacotesCartas].filter(_pacote=> _pacote !== pacote.nome)
        setPacoteCartas(novoPacote)
    }

    function renderBaralho() {
        let posicaoCarta = 0
        return baralho.map((carta, i) => {
            let cartaRender = <></>
            if (i === (baralho.length - 1)) {
                cartaRender = <div key={carta.id} className="carta ultima" onClick={() => setBaralhoModal(true)} style={{ bottom: `${posicaoCarta}px` }}>
                    <Imagem data={CARTAS_IMAGEM.CARTA_VERSO_1} />
                </div>;
            }
            else {
                cartaRender = <div key={carta.id} className="carta" style={{ bottom: `${posicaoCarta}px` }}><Imagem data={CARTAS_IMAGEM.CARTA_VERSO_1} /></div>;
            }
            posicaoCarta = posicaoCarta + 3;
            return cartaRender
        })
    }

    function renderDescarte() {
        let posicaoCarta = 0

        return descarte.map((carta, i) => {
            let cartaRender = <></>
            if (i === (descarte.length - 1)) {
                cartaRender = <div key={carta.id} className="carta ultima" onClick={() => setDescarteModal(true)} style={{ bottom: `${posicaoCarta}px` }}>
                    <Imagem data={carta.img} />
                </div>;
            }
            else {
                cartaRender = <div key={carta.id} className="carta" style={{ bottom: `${posicaoCarta}px` }}><Imagem data={carta.img} /></div>;
            }
            posicaoCarta = posicaoCarta + 3;
            return cartaRender
        })
    }

    function renderHabilidade(habilidade) {
        return <table className="habilidade-card">
            <tbody>
                <tr>
                    <th className="habilidade-nome">{habilidade.nome}</th>
                </tr>
                <tr>
                    <th>{habilidade.requisitos}</th>
                </tr>
                <tr>
                    <td>{habilidade.efeito}</td>
                </tr>
            </tbody>
        </table>
    }

    return (
        <ContainerScreen>
            <BackButton />
            <div className="baralho-screen">
                <section className="cartas-section">
                    <div className="baralho-container">
                        <header><h1>Baralho</h1></header>
                        <section>
                            <div className="cartas-container">
                                {renderBaralho()}
                            </div>
                        </section>
                    </div>
                    <div className="mao-container">
                        <header><h1>Sua Mão</h1></header>
                        <section>
                            {
                                mao.map(carta => {
                                    return <div key={carta.id} className="carta" onClick={() => handleEscolherCarta(carta)}><Imagem data={carta.img} /></div>;
                                })
                            }
                        </section>
                    </div>
                    <div className="descarte-container">
                        <header><h1>Descarte</h1></header>
                        <section>
                            <div className="cartas-container">
                                {renderDescarte()}
                            </div>
                        </section>
                    </div>
                </section>
                <footer className="baralho-botoes">
                    <BotaoPrimario onClick={() => setTrocarBaralhoModal(true)}>Trocar Baralho</BotaoPrimario>
                    <BotaoPrimario onClick={handleEmbaralhar}>Embaralhar</BotaoPrimario>
                    <BotaoPrimario onClick={() => setHabilidadesModal(true)}>Habilidades</BotaoPrimario>
                </footer>
            </div>
            <Modal isOpen={baralhoModal} setIsOpen={setBaralhoModal}>
                <div className="carta-modal baralho">
                    <header><h1>Baralho</h1></header>
                    <BotaoPrimario onClick={handlePegarCarta}>Pegar uma carta</BotaoPrimario>
                    {/* <BotaoPrimario onClick={()=>{}}>Descartar carta do fundo</BotaoPrimario> */}
                </div>
            </Modal>
            {cartaEscolhida ?
                <Modal isOpen={maoModal} setIsOpen={setMaoModal}>
                    <div className="carta-modal">
                        <header><h1>Carta</h1></header>
                        <Imagem data={cartaEscolhida.img} />
                        <BotaoPrimario onClick={() => handleDescartar(cartaEscolhida)}>Descartar</BotaoPrimario>
                    </div>
                </Modal>
                : null}
            <Modal isOpen={descarteModal} setIsOpen={setDescarteModal}>
                <div className="carta-modal descarte">
                    <header><h1>Pilha de Descarte</h1></header>
                    <BotaoPrimario onClick={handleDevolverDescarte}>Devolver ao baralho</BotaoPrimario>
                    <BotaoPrimario onClick={handleVisualizarDescarte}>Visualizar cartas</BotaoPrimario>
                </div>
            </Modal>
            <Modal isOpen={pilhaModal} setIsOpen={setPilhaModal}>
                <div className="descarte-modal">
                    <header><h1>Pilha de Descarte</h1></header>
                    <section>
                        {
                            [...descarte].reverse().map(carta => {
                                return <div className="carta-container">
                                    <Imagem data={carta.img} />
                                    <BotaoPrimario onClick={() => handlePegarDescarte(carta)}>Pegar</BotaoPrimario>
                                </div>
                            })
                        }
                    </section>
                </div>
            </Modal>
            <Modal isOpen={trocarBaralhoModal} setIsOpen={setTrocarBaralhoModal}>
                <div className="trocar-baralho-modal">
                    <header><h1>Trocar Baralho</h1></header>
                    <section>
                        <div className="conjuntos-list">
                            <header><h1>Pacotes</h1></header>
                            <ul>
                                {
                                    CONJUNTOS_CARTAS.map(conjunto => {
                                        const isSelecionado = pacotesCartas.some(pacote => pacote === conjunto.nome)
                                        return <div className={`conjunto-container${isSelecionado? " selecionado": ""}`}>
                                            <Imagem data={conjunto.img} />
                                            <BotaoPrimario onClick={isSelecionado ? () => handleRemoverPacote(conjunto) : () => handleSelecionarPacote(conjunto)}>
                                                {isSelecionado ? "Remover" : "Selecionar"}
                                            </BotaoPrimario>
                                        </div>
                                    })
                                }
                            </ul>
                        </div>
                        <h2>{pacotesCartas.length}/4 selecionados.</h2>
                    </section>
                    <footer>
                        <BotaoPrimario onClick={() => setTrocarBaralhoModal(false)}>Cancelar</BotaoPrimario>
                        <BotaoPrimario onClick={handleTrocarBaralho} ativo={pacotesCartas.length===4}>Salvar</BotaoPrimario>
                    </footer>
                </div>
            </Modal>
            <Modal isOpen={habilidadesModal} setIsOpen={setHabilidadesModal}>
                <div className="habilidades-modal">
                    <header><h1>Habilidades de Conjuntos</h1></header>
                    <section>
                        {
                            CARTEADOR_HABILIDADES.map(habilidade => {
                                return renderHabilidade(habilidade)
                            })
                        }
                    </section>
                </div>
            </Modal>
        </ContainerScreen>
    )

}