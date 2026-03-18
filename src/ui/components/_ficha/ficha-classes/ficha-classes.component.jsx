import { useEffect, useState } from "react"
import { ICONS } from "../../../../constants"
import { BotaoPrimario } from "../../botao-primario/botao-primario.component"
import "./ficha-classes.style.css"
import { useForm } from "../../../../hook"
import { useAlterarPersonagem } from "../../../../hook/api/personagem/alterar-personagem.api"
import { ClasseModal } from "../../classe-modal/classe-modal.component"

export function FichaClasses({ personagem, setPersonagem, modoOffline }) {
    const [nivelIsForm, setNivelIsForm] = useState(false)
    const [expIsForm, setExpIsForm] = useState(false)
    const [poderesIsForm, setPoderesIsForm] = useState(false)
    const { formData, setFormData, handleChange } = useForm({ nivel: "", experiencia: "", poderes: "" });
    const [classes, setClasses] = useState([]);
    const [classeSelecionada, setClasseSelecionada] = useState(null);
    const [classeOpen, setClasseOpen] = useState(false);
    const { alterarPersonagem } = useAlterarPersonagem();

    useEffect(() => {
        if (personagem) {
            setClasses(personagem.classes.sort(function (a, b) {
                return a.id - b.id;
            }))
            setFormData({
                nivel: personagem.nivel,
                experiencia: personagem.experiencia,
                poderes: personagem.poderes_gerais,
            })
        }
    }, [personagem])

    function handleSalvarNivel() {
        if(!modoOffline) alterarPersonagem(personagem.id, { nivel: formData.nivel })
        setPersonagem({ ...personagem, nivel: formData.nivel })
        setNivelIsForm(false)
    }

    function handleSalvarExp() {
        if(!modoOffline) alterarPersonagem(personagem.id, { experiencia: formData.experiencia })
        setPersonagem({ ...personagem, experiencia: formData.experiencia })
        setExpIsForm(false)
    }

    function handleSalvarPoderes() {
        if(!modoOffline) alterarPersonagem(personagem.id, { poderes_gerais: formData.poderes })
        setPersonagem({ ...personagem, poderes_gerais: formData.poderes })
        setPoderesIsForm(false)
    }

    function handleClicarClasse(classe) {
        setClasseSelecionada(classe)
        setClasseOpen(true)
    }

    function handleAdicionarClasse() {
        setClasseSelecionada(null)
        setClasseOpen(true)
    }

    function renderClasse(classe) {
        return (
            <li key={classe.id} onClick={() => handleClicarClasse(classe)}>
                <table>
                    <tbody>
                        <tr style={{ backgroundColor: "var(--dark-blue)" }}>
                            <th style={{ width: "60%", textAlign: "left" }}>
                                {classe.nome}
                            </th>
                            <th style={{ width: "40%" }}>
                                Nível {classe.nivel}
                            </th>
                        </tr>
                        <tr>
                            <td colSpan={2}>Benefícios Iniciais</td>
                        </tr>
                        <tr>
                            <td colSpan={2} className="descricao">
                                {classe.beneficios}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Poderes</td>
                        </tr>
                        <tr>
                            <td colSpan={2} className="descricao">
                                {classe.poderes}
                            </td>
                        </tr>
                        <tr><td colSpan={2}></td></tr>
                    </tbody>
                </table>
            </li>
        )
    }

    return (
        <section className="ficha-classes-container">
            <ClasseModal
                personagem={personagem}
                setPersonagem={setPersonagem}
                classe={classeSelecionada}
                setClasse={setClasseSelecionada}
                isOpen={classeOpen}
                setIsOpen={setClasseOpen}
                modoOffline={modoOffline}
            />
            <section className="classes-section">
                <h1>Classes</h1>

                <div className="botao-alterar-container">
                    <BotaoPrimario onClick={handleAdicionarClasse}>Adicionar</BotaoPrimario>
                </div>
                <ul className="lista-classes">
                    {
                        classes.map(classe => {
                            return renderClasse(classe)
                        })
                    }
                </ul>

            </section>
            <section className="niveis-section">
                <h1>Níveis</h1>
                <ul>
                    <li>
                        <h1>Nível de Personagem</h1>
                        <div className="nivel-valor">
                            <div className="valor-container">
                                {
                                    nivelIsForm ? <input type="number" min={0} max={50} name="nivel" value={formData.nivel} onChange={handleChange} />
                                        : <h2 onClick={() => setNivelIsForm(true)}>{formData.nivel}</h2>
                                }
                            </div>
                            {nivelIsForm ?
                                <BotaoPrimario onClick={handleSalvarNivel}>
                                    <img src={ICONS.SUCESSO.src} alt={ICONS.SUCESSO.alt} />
                                </BotaoPrimario>
                                : null}
                        </div>
                    </li>
                    <li className="experiencia-container">
                        <h1>Experiência</h1>
                        <div className="nivel-valor">
                            <div className="valor-container">
                                {
                                    expIsForm ? <input type="number" min={0} max={99} name="experiencia" value={formData.experiencia} onChange={handleChange} />
                                        : <h2 onClick={() => setExpIsForm(true)}>{formData.experiencia}</h2>
                                }
                            </div>
                            {expIsForm ?
                                <BotaoPrimario onClick={handleSalvarExp}>
                                    <img src={ICONS.SUCESSO.src} alt={ICONS.SUCESSO.alt} />
                                </BotaoPrimario>
                                : null}
                        </div>
                    </li>
                </ul>

                <br />
                <h1>Outros Poderes</h1>
                <div className="botao-alterar-container">
                    {
                        poderesIsForm ?
                            <BotaoPrimario onClick={handleSalvarPoderes} style={{ backgroundColor: "var(--pacific-blue)" }}>Salvar</BotaoPrimario>
                            :
                            <BotaoPrimario onClick={() => setPoderesIsForm(true)}>Alterar</BotaoPrimario>
                    }

                </div>
                <textarea
                    name="poderes"
                    value={formData.poderes}
                    onChange={handleChange}
                    className={!poderesIsForm ? "poderes-desativados" : null}
                    disabled={!poderesIsForm}
                    placeholder="Poderes Heróicos, Poderes Zero, e outros...">
                </textarea>
            </section>
        </section>
    )

}