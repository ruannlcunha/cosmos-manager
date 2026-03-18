import { useEffect, useState } from "react"
import { ICONS } from "../../../constants"
import { AdmMenuCampanhas, AdmMenuItens, AdmMenuPersonagens, AdmMenuUsuarios, ContainerScreen, Header, Imagem } from "../../components"
import "./home-adm.style.css"
import { useListarPersonagens } from "../../../hook/api/personagem/listar-personagens.api"
import { useListarUsuarios } from "../../../hook/api/usuario/listar-usuarios.api"
import { useListarCampanhas } from "../../../hook/api/campanha/listar-campanhas.api"
import useGlobalUser from "../../../context/user/global-user.context"

export function HomeAdmScreen() {
    const [user] = useGlobalUser()
    const [menuEscolhido, setMenuEscolhido] = useState(null)
    const [optionEscolhido, setOptionEscolhido] = useState(null)
    const { personagens, listarPersonagens } = useListarPersonagens()
    const { usuarios, listarUsuarios } = useListarUsuarios()
    const { campanhas, listarCampanhas } = useListarCampanhas()

    useEffect(() => {
        fetchData()
    }, [user])

    async function fetchData() {
        await listarPersonagens()
        await listarUsuarios()
        await listarCampanhas(user.id)
    }

    function handleEscolherMenu(id) {
        if (menuEscolhido === id) {
            setMenuEscolhido(null)
            return
        }
        setMenuEscolhido(id)
    }

    function handleEscolherOption(id) {
        if (optionEscolhido === id) {
            setOptionEscolhido(null)
            return
        }
        setOptionEscolhido(id)
    }

    function renderOption(id, icon, text, subOptions) {
        return (
            <>
                <li className={`adm-option${menuEscolhido === id ? " escolhido" : ""}`} onClick={() => handleEscolherMenu(id)}>
                    <Imagem data={icon} />
                    {text}
                </li>
                {id === menuEscolhido ?
                    <ul className="sub-list">
                        {
                            subOptions.map(option => {
                                return <li className={`sub-option${optionEscolhido === option.id ? " escolhido" : ""}`} onClick={() => handleEscolherOption(option.id)}>
                                    {option.text}
                                </li>
                            })
                        }
                    </ul>
                    : null}
            </>
        )
    }
    
    return (
        <ContainerScreen>
            <Header idSelected={3} />
            <div className="home-adm-screen">
                <div className="adm-options">
                    <h1>
                        <Imagem data={ICONS.COROA} />
                        Administrador
                    </h1>
                    <ul>
                        {renderOption(1, ICONS.PERSONAGENS, "Gerenciar Personagens", [
                            { id: 1, text: "Criar Personagem" },
                            { id: 2, text: "Alterar Personagem" },
                            { id: 3, text: "Deletar Personagem" },
                            { id: 4, text: "Vincular Personagem à Usuário" },
                            { id: 5, text: "Adicionar visual" },
                            { id: 'MONTAR_BARALHO', text: "Montar Baralho Inicial" },
                        ])}
                    </ul>
                    <ul>
                        {renderOption(2, ICONS.CAMPANHA, "Gerenciar Campanhas", [
                            { id: 6, text: "Criar Campanha" },
                            { id: 7, text: "Alterar Campanha" },
                            { id: 8, text: "Remover Campanha" },
                            { id: 9, text: "Vincular Personagem à Campanha" },
                            { id: 10, text: "Vincular Usuário à Campanha" },
                            { id: 11, text: "Criar receita" },
                        ])}
                    </ul>
                    <ul>
                        {renderOption(3, ICONS.ITEM_GENERICO, "Gerenciar Itens", [
                            { id: 13, text: "Criar Item" },
                            { id: 14, text: "Alterar Item" },
                            { id: 15, text: "Deletar Item" },
                        ])}
                    </ul>
                    <ul>
                        {renderOption(4, ICONS.USUARIO, "Gerenciar Usuários", [
                            { id: 16, text: "Criar Usuario" },
                            { id: 17, text: "Alterar Usuario" },
                            // { id: 18, text: "Deletar Usuario" },
                            { id: 19, text: "Trocar Senha" },
                        ])}
                    </ul>
                </div>
                <div className="adm-menu">
                        <AdmMenuPersonagens
                        menuEscolhido={optionEscolhido}
                        personagens={personagens}
                        usuarios={usuarios}
                        />
                        <AdmMenuCampanhas
                        menuEscolhido={optionEscolhido}
                        personagens={personagens}
                        usuarios={usuarios}
                        campanhas={campanhas}
                        />
                        <AdmMenuItens
                        menuEscolhido={optionEscolhido}
                        />
                        <AdmMenuUsuarios
                        menuEscolhido={optionEscolhido}
                        />
                </div>
            </div>
        </ContainerScreen>
    );

}