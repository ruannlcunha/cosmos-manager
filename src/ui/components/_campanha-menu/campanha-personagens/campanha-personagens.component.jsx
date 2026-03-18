import { useEffect, useState } from "react"
import "./campanha-personagens.style.css"
import { useVisualizarPersonagem } from "../../../../hook/api/personagem/visualizar-personagem.api"
import { useSocket } from "../../../../hook"
import { CardPersonagem } from "../../card-personagem/card-personagem.component"
import { BotaoPrimario } from "../../botao-primario/botao-primario.component"
import { USER_ROLE } from "../../../../constants"
import useGlobalUser from "../../../../context/user/global-user.context"

export function CampanhaPersonagens({ campanha, modoOffline }) {
    const [personagens, setPersonagens] = useState([])
    const { socket } = useSocket()
    const [user] = useGlobalUser()
    const { visualizarPersonagem } = useVisualizarPersonagem()

    useEffect(() => {
        if (campanha) {
            fetchPersonagens()
            socket.on("personagens", async () => {
                fetchPersonagens()
            });
        }
    }, [campanha])

    async function fetchPersonagens() {
        let novosPersonagens = []
        for (const personagemCampanha of campanha.personagens) {
            const personagem = await visualizarPersonagem(personagemCampanha.personagem_id)
            novosPersonagens = [...novosPersonagens, personagem]
        }
        setPersonagens(novosPersonagens)
    }
    console.log(personagens)
    return campanha ? (
        <div className="campanha-personagens-container">
            <div className="personagens-menu">
                <header className="personagens-header">
                    <h1>PERSONAGENS NO GRUPO</h1>
                </header>
                {/* {user.role === USER_ROLE.ADM ? <div className="botao-adicionar-container">
                    <BotaoPrimario onClick={() => { }}>Adicionar</BotaoPrimario>
                </div> : null} */}
                <section className="personagens-section">
                    {
                        personagens.map(personagem => {
                            return <CardPersonagem personagem={personagem} haveConfig={true}/>
                        })
                    }
                </section>
            </div>
        </div >
    ) : null
}