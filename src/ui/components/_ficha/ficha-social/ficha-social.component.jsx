import { useEffect, useState } from "react"
import { BotaoPrimario } from "../../botao-primario/botao-primario.component"
import "./ficha-social.style.css"
import { useForm } from "../../../../hook";
import { ICONS } from "../../../../constants";
import { useAlterarPersonagem } from "../../../../hook/api/personagem/alterar-personagem.api";
import { Imagem } from "../../imagem/imagem.component";
import { LacoModal } from "../../laco-modal/laco-modal.component";

export function FichaSocial({ personagem, setPersonagem, modoOffline }) {
    const [tracosIsForm, setTracosIsForm] = useState(false)
    const [lacos, setLacos] = useState([])
    const [anotacoesIsForm, setAnotacoesIsForm] = useState(false)
    const [lacoSelecionado, setLacoSelecionado] = useState(null);
    const [lacoOpen, setLacoOpen] = useState(false);
    const { formData, setFormData, handleChange } = useForm({
        identidade: "",
        tema: "",
        origem: "",
        anotacoes: "",
    });
    const { alterarPersonagem } = useAlterarPersonagem();

    useEffect(() => {
        if (personagem) {
            setLacos(personagem.lacos.sort(function (a, b) {
                return a.id - b.id;
            }))
            setFormData({
                identidade: personagem.identidade,
                tema: personagem.tema,
                origem: personagem.origem,
                anotacoes: personagem.anotacoes,
            })
        }
    }, [personagem])

    async function handleSalvarTracos() {
        if(!modoOffline) await alterarPersonagem(personagem.id, {
            identidade: formData.identidade, tema: formData.tema, origem: formData.origem
        })
        setPersonagem({ ...personagem, identidade: formData.identidade, tema: formData.tema, origem: formData.origem })
        setTracosIsForm(false)
    }

    async function handleSalvarAnotacoes() {
        if(!modoOffline) await alterarPersonagem(personagem.id, { anotacoes: formData.anotacoes })
        setPersonagem({ ...personagem, anotacoes: formData.anotacoes })
        setAnotacoesIsForm(false)
    }

    function handleClicarLaco(laco) {
        setLacoSelecionado(laco)
        setLacoOpen(true)
    }

    function handleAdicionarLaco() {
        setLacoSelecionado(null)
        setLacoOpen(true)
    }

    function renderTraco(index) {
        if (tracosIsForm) {
            return <td className="traco-input">
                <input type="text" name={index} value={formData[index]} onChange={handleChange} />
            </td>
        }
        return <td>{formData[index]}</td>
    }


    function renderLaco(laco) {
        const emocoes = []
        if (laco.admiracao) emocoes.push({ nome: "Admiração", tipo: "POSITIVO", par: 1 })
        if (laco.inferioridade) emocoes.push({ nome: "Inferioridade", tipo: "NEGATIVO", par: 1 })
        if (laco.lealdade) emocoes.push({ nome: "Lealdade", tipo: "POSITIVO", par: 2 })
        if (laco.desconfianca) emocoes.push({ nome: "Desconfiança", tipo: "NEGATIVO", par: 2 })
        if (laco.afeto) emocoes.push({ nome: "Afeto", tipo: "POSITIVO", par: 3 })
        if (laco.odio) emocoes.push({ nome: "Ódio", tipo: "NEGATIVO", par: 3 })

        const par1 = emocoes.find(emocao => emocao.par === 1)
        const par2 = emocoes.find(emocao => emocao.par === 2)
        const par3 = emocoes.find(emocao => emocao.par === 3)

        const _imagem = laco.imagem ? laco.imagem : ICONS.LACO_GENERICO;

        return <li key={laco.id} className="laco-card" onClick={() => handleClicarLaco(laco)} >
            <section className="laco-esquerda">
                <div className="imagem-container">
                    <Imagem data={_imagem} style={!laco.imagem ? { opacity: "50%" } : null} />
                </div>
            </section>
            <section className="laco-direita">
                <header>
                    <h3>{laco.nome}</h3>
                </header>
                <table>
                    <tbody>
                        <tr>
                            {par1 ? <td style={{ backgroundColor: `var(--${par1.tipo === "POSITIVO" ? "dark-green" : "dark-red"})` }}><h3>{par1.nome}</h3></td>
                                : <td style={{ backgroundColor: "var(--black-transparent)" }}><h3>Vazio</h3></td>
                            }
                            {par2 ? <td style={{ backgroundColor: `var(--${par2.tipo === "POSITIVO" ? "dark-green" : "dark-red"})` }}><h3>{par2.nome}</h3></td>
                                : <td style={{ backgroundColor: "var(--black-transparent)" }}><h3>Vazio</h3></td>
                            }
                            {par3 ? <td style={{ backgroundColor: `var(--${par3.tipo === "POSITIVO" ? "dark-green" : "dark-red"})` }}><h3>{par3.nome}</h3></td>
                                : <td style={{ backgroundColor: "var(--black-transparent)" }}><h3>Vazio</h3></td>
                            }
                        </tr>
                    </tbody>
                </table>
            </section>
        </li>
    }

    return (
        <section className="ficha-social-container">
            <LacoModal
            personagem={personagem}
            setPersonagem={setPersonagem}
            laco={lacoSelecionado}
            setLaco={setLacoSelecionado}
            isOpen={lacoOpen}
            setIsOpen={setLacoOpen}
            modoOffline={modoOffline}
            />
            <section className="lacos-section">
                <h1>Laços</h1>

                <div className="botao-alterar-container">
                    <BotaoPrimario onClick={handleAdicionarLaco}>Adicionar</BotaoPrimario>
                </div>
                <ul>
                    {lacos.length ?
                        lacos.map(laco => {
                            return renderLaco(laco)
                        })
                        : <h2>O personagem não possui laços.</h2>
                    }
                </ul>

            </section>
            <section className="tracos-section">
                <h1>Traços</h1>

                <div className="botao-alterar-container">
                    {
                        tracosIsForm ?
                            <BotaoPrimario onClick={handleSalvarTracos} style={{ backgroundColor: "var(--pacific-blue)" }}>Salvar</BotaoPrimario>
                            :
                            <BotaoPrimario onClick={() => setTracosIsForm(true)}>Alterar</BotaoPrimario>
                    }

                </div>

                <table>
                    <tbody>
                        <tr>
                            <th>Identidade</th>
                            {renderTraco("identidade")}
                        </tr>
                        <tr>
                            <th>Tema</th>
                            {renderTraco("tema")}
                        </tr>
                        <tr>
                            <th>Origem</th>
                            {renderTraco("origem")}
                        </tr>
                    </tbody>
                </table>

                <h1>Anotações</h1>

                <div className="botao-alterar-container">
                    {
                        anotacoesIsForm ?
                            <BotaoPrimario onClick={handleSalvarAnotacoes} style={{ backgroundColor: "var(--pacific-blue)" }}>Salvar</BotaoPrimario>
                            :
                            <BotaoPrimario onClick={() => setAnotacoesIsForm(true)}>Alterar</BotaoPrimario>
                    }

                </div>
                <textarea
                    name="anotacoes"
                    value={formData.anotacoes}
                    onChange={handleChange}
                    className={!anotacoesIsForm ? "anotacoes-desativadas" : null}
                    disabled={!anotacoesIsForm}
                    placeholder="Aparência, personalidade, história, anotações gerais, etc...">
                </textarea>
            </section>
        </section>
    )

}