import "./campanha-informacoes.style.css"

export function CampanhaInformacoes({ campanha, modoOffline }) {


    return campanha ? (
        <div className="campanha-informacoes-container">
            <div className="informacoes-menu">
                <header className="informacoes-header">
                    <h1>INFORMAÇÕES DA CAMPANHA</h1>
                </header>
                <table>
                    <tbody>
                        <tr>
                            <th>Nome:</th>
                            <td>{campanha.nome}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="campanha-capa" style={{backgroundImage: `url(${campanha.capa.dataUri})`}}></div>
                <section className="informacoes-section">
                <table style={{height: "90%"}}>
                    <tbody>
                        <tr>
                            <th style={{height: "15%"}}>Descrição:</th>
                        </tr>
                        <tr>
                            <td>
                                <p>{campanha.descricao}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <th>Jogadores:</th>
                        </tr>
                            {
                               campanha.jogadores.map(jogador=> {
                                return <tr><td>{jogador.apelido}</td></tr>
                               }) 
                            }
                    </tbody>
                </table>
                </section>
            </div>
        </div >
    ) : null
}