import { useEffect } from "react";
import { useForm } from "../../../hook";
import { BotaoPrimario } from "../botao-primario/botao-primario.component"
import { Modal } from "../modal/modal.component"
import "./classe-modal.style.css"
import { useAlterarClasse } from "../../../hook/api/personagem/alterar-classe.api";
import { useCriarClasse } from "../../../hook/api/personagem/criar-classe.api";
import { BotaoRemover } from "../botao-remover/botao-remover.component";
import { useRemoverClasse } from "../../../hook/api/personagem/remover-classe.api";

export function ClasseModal({ personagem, setPersonagem, classe, setClasse, isOpen, setIsOpen, modoOffline }) {
    const { formData, setFormData, handleChange } = useForm({ nome: "", nivel: "0", beneficios: "", poderes: "" });
    const { alterarClasse } = useAlterarClasse();
    const { criarClasse } = useCriarClasse();
    const { removerClasse } = useRemoverClasse();

    useEffect(()=>{
        if(classe) {
            setFormData({ nome: classe.nome, nivel: classe.nivel, beneficios: classe.beneficios, poderes: classe.poderes })
        }
        else {
            setFormData({ nome: "", nivel: "0", beneficios: "", poderes: "" })
        }
    },[classe, isOpen])

    function handleCancelar() {
        setIsOpen(false)
        setClasse(null)
    }

    async function handleSalvar() {
        let _nivel = formData.nivel
        if(_nivel>50) _nivel = 50;
        if(!_nivel) _nivel = 0;

        const classeAntiga = personagem.classes.find(_classe=>_classe.id === classe.id)
        const classeNova = { nome: formData.nome, nivel: _nivel, beneficios: formData.beneficios, poderes: formData.poderes }
        if(!modoOffline) await alterarClasse(classe.id, classeNova)
        setPersonagem({...personagem, classes: [...personagem.classes.filter(_classe=>_classe.id!==classe.id), {...classeAntiga, ...classeNova}]})
        setIsOpen(false)
        setClasse(null)
    }

    async function handleAdicionar() {
        let _nivel = formData.nivel
        if(_nivel>50) _nivel = 50;
        if(!_nivel) _nivel = 0;

        const novaClasse = { personagemId: personagem.id, nome: formData.nome, nivel: _nivel, beneficios: formData.beneficios, poderes: formData.poderes }
        const response = !modoOffline ? await criarClasse(novaClasse) : {data: {id: `offline-${personagem.classes.length+1}`}}
        setPersonagem({...personagem, classes: [...personagem.classes, {...novaClasse, id: response.data}]})
        setIsOpen(false)
        setClasse(null)
    }

    async function handleRemover() {
        if(!modoOffline) await removerClasse(classe.id)
        setPersonagem({...personagem, classes: [...personagem.classes.filter(_classe=> _classe.id !== classe.id)]})
        setIsOpen(false)
        setClasse(null)
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="classe-modal">
                <header className="classe-header">
                    <div></div>
                    <h1>Classe</h1>
                    {classe ? <BotaoRemover deleteFunction={handleRemover} texto={"Você confirma que quer remover essa classe?"}/> : <div></div>}
                </header>
                <section className="classe-section">
                    <table>
                        <tbody>
                            <tr>
                                <th style={{ width: "70%" }}>
                                    <h2>Nome:</h2>
                                </th>
                                <th style={{ width: "30%" }}>
                                    <div className="classe-nivel">
                                        <h2>Nivel:</h2>
                                        <input type="number" min={0} max={50} name={"nivel"} value={formData.nivel} onChange={handleChange} />
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <input type="text" name={"nome"} value={formData.nome} onChange={handleChange} placeholder="Escreva o nome da sua classe." />
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2}>
                                    <h2>Benefícios Iniciais:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <input type="text" name={"beneficios"} value={formData.beneficios} onChange={handleChange} placeholder="Escreva os benefícios da sua classe." />
                                </td>
                            </tr>
                            <tr>
                                <th colSpan={2}>
                                    <h2>Poderes:</h2>
                                </th>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <textarea name={"poderes"} value={formData.poderes} onChange={handleChange} placeholder="Escreva os poderes da sua classe.">

                                    </textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <footer>
                    <BotaoPrimario onClick={handleCancelar}>Cancelar</BotaoPrimario>
                    <BotaoPrimario onClick={classe ? handleSalvar : handleAdicionar}>{classe? "Salvar" : "Adicionar"}</BotaoPrimario>
                </footer>
            </div>
        </Modal>
    )

}