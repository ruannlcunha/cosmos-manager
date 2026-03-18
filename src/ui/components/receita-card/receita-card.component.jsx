import "./receita-card.style.css"
import { ICONS, USER_ROLE } from "../../../constants"
import { Imagem } from "../imagem/imagem.component"
import { BotaoPrimario } from "../botao-primario/botao-primario.component"
import useGlobalUser from "../../../context/user/global-user.context"

export function ReceitaCard({ receita, onClick, className, removerFunction }) {
    const [user] = useGlobalUser()

    async function handleRemover() {
        removerFunction(receita)
    }

    function renderReceita(receita) {
        const _imagem = receita.imagem ? receita.imagem : ICONS.RECEITA_GENERICO
        const _className = className ? ` ${className}` : ""

        return (
            <li className={`receita-card${_className}`} key={receita.id} onClick={onClick}>
                <h1>
                    {receita.nome}
                    {removerFunction && user.role === USER_ROLE.ADM ? <BotaoPrimario onClick={handleRemover}><Imagem data={ICONS.LIXEIRA}/></BotaoPrimario>: null}
                </h1>
                <div className="imagem-container">
                    <Imagem data={_imagem} style={!receita.imagem ? { opacity: "50%" } : {}} />
                </div>
                <table>
                    <tbody>
                        <tr>
                            <th style={{ width: "40%" }}>Custo:</th>
                            <td style={{ width: "60%" }}>{receita.custo}</td>
                        </tr>
                        <tr>
                            <th colSpan={2}>Efeitos:</th>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{ height: "10vh", verticalAlign: "top" }}>
                                <p>
                                    {receita.efeitos}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </li>
        )
    }

    return receita ? (
        <>
        {renderReceita(receita)}
        </>
    ) : null

}