import "./ficha-status.style.css"
import { ICONS } from "../../../../constants"
import { useForm } from "../../../../hook";
import { useEffect, useState } from "react";
import { BotaoPrimario } from "../../botao-primario/botao-primario.component";
import { useAlterarPontos } from "../../../../hook/api/personagem/alterar-pontos.api";
import { useAlterarAtributos } from "../../../../hook/api/personagem/alterar-atributos.api";
import { useAlterarCondicoes } from "../../../../hook/api/personagem/alterar-condicoes.api";

export function FichaStatus({ personagem, setPersonagem, modoOffline }) {
    const { formData, setFormData, handleChange } = useForm({
        pv_atual: "",
        pv_maximo: "",
        pm_atual: "",
        pm_maximo: "",
        pi_atual: "",
        pi_maximo: "",
        pf: "",
        destreza_base: "",
        destreza_atual: "",
        vigor_base: "",
        vigor_atual: "",
        astucia_base: "",
        astucia_atual: "",
        vontade_base: "",
        vontade_atual: "",
        abalado: "",
        atordoado: "",
        enfurecido: "",
        envenenado: "",
        fraco: "",
        lento: "",
    });
    const [pontoIsForm, setPontoIsForm] = useState({ pv: false, pm: false, pi: false, pf: false })
    const [atributosIsForm, setAtributosIsForm] = useState(false)
    const { alterarPontos } = useAlterarPontos();
    const { alterarAtributos } = useAlterarAtributos();
    const { alterarCondicoes } = useAlterarCondicoes();

    useEffect(()=>{
        if(personagem) {
            setFormData({
                pv_atual: personagem.pontos.pv_atual,
                pv_maximo: personagem.pontos.pv_maximo,
                pm_atual: personagem.pontos.pm_atual,
                pm_maximo: personagem.pontos.pm_maximo,
                pi_atual: personagem.pontos.pi_atual,
                pi_maximo: personagem.pontos.pi_maximo,
                pf: personagem.pontos.pf,
                destreza_base: personagem.atributos.destreza_base,
                destreza_atual: personagem.atributos.destreza_atual,
                vigor_base: personagem.atributos.vigor_base,
                vigor_atual: personagem.atributos.vigor_atual,
                astucia_base: personagem.atributos.astucia_base,
                astucia_atual: personagem.atributos.astucia_atual,
                vontade_base: personagem.atributos.vontade_base,
                vontade_atual: personagem.atributos.vontade_atual,
                abalado: personagem.condicoes.abalado,
                atordoado: personagem.condicoes.atordoado,
                enfurecido: personagem.condicoes.enfurecido,
                envenenado: personagem.condicoes.envenenado,
                fraco: personagem.condicoes.fraco,
                lento: personagem.condicoes.lento,
            })
        }
    },[personagem])


    function handleClicarPonto(ponto) {
        setPontoIsForm({
            ...pontoIsForm,
            [ponto]: pontoIsForm[ponto] ? false : true
        })
    }

    function handleSalvarPonto(ponto) {
        let novoFormData = {}
        let updatedData = {}

        Object.keys(formData).map(key => {
            const novoValor = formData[key] != '' ? formData[key] : 0
            novoFormData = { ...novoFormData, [key]: novoValor };
            if (key.toLowerCase().includes(ponto)) {
                updatedData = { ...updatedData, [key]: Number(novoValor) };
            }
        })

        if(!modoOffline) alterarPontos(personagem.id, updatedData);
        setFormData(novoFormData)
        setPersonagem({ ...personagem, pontos: { ...personagem.pontos, ...updatedData } })
        setPontoIsForm({
            ...pontoIsForm,
            [ponto]: pontoIsForm[ponto] ? false : true
        })
    }

    function handleChangeAtributos(event) {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        });
    }

    function handleSalvarAtributos() {
        const novosAtributos = {
            destreza_base: formData.destreza_base,
            destreza_atual: formData.destreza_atual,
            vigor_base: formData.vigor_base,
            vigor_atual: formData.vigor_atual,
            astucia_base: formData.astucia_base,
            astucia_atual: formData.astucia_atual,
            vontade_base: formData.vontade_base,
            vontade_atual: formData.vontade_atual,
        }
        if(!modoOffline) alterarAtributos(personagem.id, novosAtributos);
        setPersonagem({ ...personagem, atributos: { ...personagem.atributos, ...novosAtributos} })
        setAtributosIsForm(false)
    }

    function handleModificarPontos(modificador, index) {
        const valorAtual = formData[index]
        const valorModificado = Number(valorAtual) + modificador
        const novoValor = valorModificado >= 0 ? valorModificado : 0
        if(!modoOffline) alterarPontos(personagem.id, { [index]: novoValor });
        setFormData({
            ...formData,
            [index]: `${novoValor}`
        });
        setPersonagem({ ...personagem, pontos: { ...personagem.pontos, [index]: novoValor } })
    }

    function handleChangeCondicao(e) {
        if(!modoOffline) alterarCondicoes(personagem.id, { [e.target.name]: e.target.checked });
        setFormData({
            ...formData,
            [e.target.name]: e.target.checked
        });
        setPersonagem({ ...personagem, condicoes: { ...personagem.condicoes, [e.target.name]: e.target.checked } })
    }

    function renderPontos(titulo, icone, cor, index, valorAtual, valorMaximo) {
        const _valorAtual = formData[valorAtual]
        const _valorMaximo = formData[valorMaximo]
        const porcentagemValor = (_valorAtual / _valorMaximo) * 100

        return (
            <div className="ponto-container">
                <section>
                    <img src={icone.src} alt={icone.alt} />
                    <h1>{titulo}</h1>
                    {
                        index === "pv" && _valorAtual <= 0 ? <h4 style={{ color: "var(--grey)" }}>{"[Inconsciente]"}</h4> :
                            index === "pv" && _valorAtual <= (_valorMaximo / 2) ? <h4 style={{ color: "var(--mid-red)" }}>{"[Em crise]"}</h4> : null
                    }
                </section>
                <div className="barra-pontos-container">
                    <div
                        className="batalha-hud-barra"
                        style={{
                            background: `linear-gradient(to right, var(--${cor}) ${_valorMaximo != undefined ? `${porcentagemValor}` : "100"}%, var(--light-grey) 1%)`
                        }}
                    >
                    </div>
                    {pontoIsForm[index] ?
                        <div className="ponto-form">
                            <input type="number" name={valorAtual} value={formData[valorAtual]} onChange={handleChange} />
                            {_valorMaximo != undefined ?
                                <>
                                    <h3>/</h3>
                                    <input type="number" name={valorMaximo} value={formData[valorMaximo]} onChange={handleChange} />
                                </>
                                : null}
                            <BotaoPrimario onClick={() => handleSalvarPonto(index)}>
                                <img src={ICONS.SUCESSO.src} alt={ICONS.SUCESSO.alt} />
                            </BotaoPrimario>
                        </div>
                        :
                        <div className="ponto-status">
                            <div>
                                <button onClick={() => handleModificarPontos(-10, valorAtual)}>{"<<"}</button>
                                <button onClick={() => handleModificarPontos(-1, valorAtual)}>{"<"}</button>
                            </div>
                            <h2 onClick={() => handleClicarPonto(index)}>{_valorAtual}{_valorMaximo != undefined ? `/${_valorMaximo}` : null}</h2>
                            <div>
                                <button onClick={() => handleModificarPontos(1, valorAtual)}>{">"}</button>
                                <button onClick={() => handleModificarPontos(10, valorAtual)}>{">>"}</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }

    function renderAtributoDado(index) {
        const valor = formData[index]
        if (atributosIsForm) {
            return <td className="atributo-dado">
                <select name={`${index}`} id={`${index}`} onChange={(e) => handleChangeAtributos(e)} value={formData[index]}>
                    <option value="d6">d6</option>
                    <option value="d8">d8</option>
                    <option value="d10">d10</option>
                    <option value="d12">d12</option>
                </select>
            </td>
        }
        return <td className="atributo-dado">{valor}</td>
    }

    return (
        <section className="ficha-status-container">
            <section className="pontos-section">
                <h1>Pontos</h1>
                {renderPontos("Pontos de Vida", ICONS.PV, "red", "pv", "pv_atual", "pv_maximo")}
                {renderPontos("Pontos de Mana", ICONS.PM, "pure-blue", "pm", "pm_atual", "pm_maximo")}
                {renderPontos("Pontos de Inventário", ICONS.PI, "light-green", "pi", "pi_atual", "pi_maximo")}
                {renderPontos("Pontos de Fabula", ICONS.PF, "light-yellow", "pf", "pf")}

            </section>
            <section className="atributos-section">
                <h1>Atributos</h1>

                <div className="botao-alterar-container">
                    {
                        atributosIsForm ?
                            <BotaoPrimario onClick={handleSalvarAtributos}>Salvar</BotaoPrimario>
                            :
                            <BotaoPrimario onClick={() => setAtributosIsForm(true)}>Alterar</BotaoPrimario>
                    }

                </div>
                <table className="atributos-table">
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Base</th>
                            <th>Atual</th>
                        </tr>
                        <tr>
                            <th>
                                <img src={ICONS.DESTREZA.src} alt={ICONS.DESTREZA.alt} />
                                Destreza
                            </th>
                            {renderAtributoDado("destreza_base")}
                            {renderAtributoDado("destreza_atual")}
                        </tr>
                        <tr>
                            <th>
                                <img src={ICONS.VIGOR.src} alt={ICONS.VIGOR.alt} />
                                Vigor
                            </th>
                            {renderAtributoDado("vigor_base")}
                            {renderAtributoDado("vigor_atual")}
                        </tr>
                        <tr>
                            <th>
                                <img src={ICONS.ASTUCIA.src} alt={ICONS.ASTUCIA.alt} />
                                Astúcia
                            </th>
                            {renderAtributoDado("astucia_base")}
                            {renderAtributoDado("astucia_atual")}
                        </tr>
                        <tr>
                            <th>
                                <img src={ICONS.VONTADE.src} alt={ICONS.VONTADE.alt} />
                                Vontade
                            </th>
                            {renderAtributoDado("vontade_base")}
                            {renderAtributoDado("vontade_atual")}
                        </tr>
                    </tbody>
                </table>

                <h1>Condições </h1>
                <table className="condicoes-table">
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Descrição</th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>
                                <img src={ICONS.ABALADO.src} alt={ICONS.ABALADO.alt} />
                                Abalado
                            </th>
                            <td>Reduz Vontade</td>
                            <td><input type="checkbox" name={"abalado"} checked={formData.abalado} onChange={(e) => handleChangeCondicao(e)} /></td>
                        </tr>
                        <tr>
                            <th>
                                <img src={ICONS.ATORDOADO.src} alt={ICONS.ATORDOADO.alt} />
                                Atordoado
                            </th>
                            <td>Reduz Astúcia</td>
                            <td><input type="checkbox" name={"atordoado"} checked={formData.atordoado} onChange={(e) => handleChangeCondicao(e)} /></td>
                        </tr>
                        <tr>
                            <th>
                                <img src={ICONS.ENFURECIDO.src} alt={ICONS.ENFURECIDO.alt} />
                                Enfurecido
                            </th>
                            <td>Reduz Destreza e Astúcia</td>
                            <td><input type="checkbox" name={"enfurecido"} checked={formData.enfurecido} onChange={(e) => handleChangeCondicao(e)} /></td>
                        </tr>
                        <tr>
                            <th>
                                <img src={ICONS.ENVENENADO.src} alt={ICONS.ENVENENADO.alt} />
                                Envenenado
                            </th>
                            <td>Reduz Vigor e Vontade</td>
                            <td><input type="checkbox" name={"envenenado"} checked={formData.envenenado} onChange={(e) => handleChangeCondicao(e)} /></td>
                        </tr>
                        <tr>
                            <th>
                                <img src={ICONS.FRACO.src} alt={ICONS.FRACO.alt} />
                                Fraco
                            </th>
                            <td>Reduz Vigor</td>
                            <td><input type="checkbox" name={"fraco"} checked={formData.fraco} onChange={(e) => handleChangeCondicao(e)} /></td>
                        </tr>
                        <tr>
                            <th>
                                <img src={ICONS.LENTO.src} alt={ICONS.LENTO.alt} />
                                Lento
                            </th>
                            <td>Reduz Destreza</td>
                            <td><input type="checkbox" name={"lento"} checked={formData.lento} onChange={(e) => handleChangeCondicao(e)} /></td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </section>
    )

}