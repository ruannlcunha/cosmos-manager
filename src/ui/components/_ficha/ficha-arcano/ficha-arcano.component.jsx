import { useEffect, useState } from "react"
import "./ficha-arcano.style.css"
import { BotaoPrimario } from "../../botao-primario/botao-primario.component"
import { useForm } from "../../../../hook";
import { Imagem } from "../../imagem/imagem.component";
import { ELEMENTOS, ICONS } from "../../../../constants";
import { useAlterarPersonagem } from "../../../../hook/api/personagem/alterar-personagem.api";
import { FeiticoModal } from "../../feitico-modal/feitico-modal.component";

export function FichaArcano({ personagem, setPersonagem, modoOffline }) {
    const [feiticos, setFeiticos] = useState([]);
    const [feiticoSelecionado, setFeiticoSelecionado] = useState(null);
    const [feiticoOpen, setFeiticoOpen] = useState(false);
    const [elementoIsForm, setElementoIsForm] = useState(false);
    const [rituaisIsForm, setRituaisIsForm] = useState(false);
    const { formData, setFormData, handleChange } = useForm({ afinidadeElemental: "NULO", rituais: "" });
    const { alterarPersonagem } = useAlterarPersonagem();

    useEffect(() => {
        if (personagem) {
            setFeiticos(personagem.feiticos.sort(function (a, b) {return a.id - b.id;}))
            setFormData({
                afinidadeElemental: personagem.afinidade_elemental ? personagem.afinidade_elemental : "NULO",
                rituais: personagem.rituais,
            })
        }
    }, [personagem])

    async function handleSalvarElemento() {
        if(!modoOffline) await alterarPersonagem(personagem.id, { afinidade_elemental: formData.afinidadeElemental })
        setPersonagem({ ...personagem, afinidade_elemental: formData.afinidadeElemental })
        setElementoIsForm(false)
    }

    async function handleSalvarRituais() {
        if(!modoOffline) await alterarPersonagem(personagem.id, { rituais: formData.rituais })
        setPersonagem({ ...personagem, rituais: formData.rituais })
        setRituaisIsForm(false)
    }

    function handleClicarFeitico(feitico) {
        setFeiticoSelecionado(feitico)
        setFeiticoOpen(true)
    }

    function handleAdicionarFeitico() {
        setFeiticoSelecionado(null)
        setFeiticoOpen(true)
    }

    function renderFeitico(feitico) {
        const _imagem = feitico.imagem ? feitico.imagem : ICONS.FEITICO_GENERICO

        return <li className="feitico-card" key={feitico.id} onClick={() => handleClicarFeitico(feitico)}>
            <header>
                <section className="feitico-esquerda">
                    <div className="imagem-container">
                        <Imagem data={_imagem} style={!feitico.imagem ? { opacity: "50%" } : null} />
                    </div>
                </section>
                <section className="feitico-direita">
                    <h3>{feitico.nome}</h3>
                    {feitico.ofensivo ? <Imagem data={ICONS.MAGIA_OFENSIVA} /> : null}
                </section>
            </header>
            <table>
                <tbody>
                    <tr>
                        <th>Custo:</th>
                        <td>{feitico.custo}</td>
                    </tr>
                    <tr>
                        <th>Alvos:</th>
                        <td>{feitico.alvos}</td>
                    </tr>
                    <tr>
                        <th>Duração:</th>
                        <td>{feitico.duracao}</td>
                    </tr>
                    <tr>
                        <th colSpan={2}>Descrição:</th>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <p>{feitico.descricao}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </li>
    }

    function renderAfinidade() {
        if (elementoIsForm) {
            return <td className="elemento-input">
                <select type="text" name="afinidadeElemental" value={formData.afinidadeElemental} onChange={handleChange}>
                    {
                        Object.entries(ELEMENTOS).map(elemento => {
                            const [key, value] = elemento
                            return <option value={key}>{value}</option>
                        })
                    }
                </select>
            </td>
        }
        return <td>{ELEMENTOS[formData.afinidadeElemental]}</td>
    }

    return (
        <section className="ficha-arcano-container">
            <FeiticoModal
            personagem={personagem}
            setPersonagem={setPersonagem}
            feitico={feiticoSelecionado}
            setFeitico={setFeiticoSelecionado}
            isOpen={feiticoOpen}
            setIsOpen={setFeiticoOpen}
            modoOffline={modoOffline}
            />
            <section className="esquerda-section">
                <h1>Feitiços</h1>
                <div className="botao-alterar-container">
                    <BotaoPrimario onClick={handleAdicionarFeitico}>Adicionar</BotaoPrimario>
                </div>
                <ul>
                    {feiticos.length ?
                        feiticos.map(feitico => {
                            return renderFeitico(feitico)
                        })
                        : <h2>O personagem não possui feitiços.</h2>}
                </ul>
            </section>

            <section className="direita-section">
                <h1>Afinidade Elemental</h1>
                <div className="afinidade-container">
                    <div className="elemento-container">
                        <div className="botao-alterar-container">
                            {
                                elementoIsForm ?
                                    <BotaoPrimario onClick={handleSalvarElemento} style={{ backgroundColor: "var(--pacific-blue)" }}>Salvar</BotaoPrimario>
                                    :
                                    <BotaoPrimario onClick={() => setElementoIsForm(true)}>Alterar</BotaoPrimario>
                            }

                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Elemento</th>
                                </tr>
                                <tr>
                                    {renderAfinidade()}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="imagem-container">
                        <Imagem data={ICONS[`ELEMENTO_${formData.afinidadeElemental}`]} />
                    </div>
                </div>

                <br />

                <h1>Rituais</h1>
                <div className="botao-alterar-container">
                    {
                        rituaisIsForm ?
                            <BotaoPrimario onClick={handleSalvarRituais} style={{ backgroundColor: "var(--pacific-blue)" }}>Salvar</BotaoPrimario>
                            :
                            <BotaoPrimario onClick={() => setRituaisIsForm(true)}>Alterar</BotaoPrimario>
                    }

                </div>
                <textarea
                    name="rituais"
                    value={formData.rituais}
                    onChange={handleChange}
                    className={!rituaisIsForm ? "rituais-desativados" : null}
                    disabled={!rituaisIsForm}
                    placeholder="Descreva quais rituais você pode conjurar e como são conjurados.">
                </textarea>
            </section>
        </section>
    )

}