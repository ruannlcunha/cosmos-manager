import "./adm-menu-usuarios.style.css"
import { useNavigate } from "react-router-dom"
import { BotaoPrimario } from "../.."
import { useListarUsuarios } from "../../../../hook/api/usuario/listar-usuarios.api"
import { useEffect, useState } from "react"
import { useForm, useToast } from "../../../../hook"
import { USER_ROLE } from "../../../../constants"
import { useCriarUsuario } from "../../../../hook/api/usuario/criar-usuario.api"
import { useAlterarUsuario } from "../../../../hook/api/usuario/alterar-usuario.api"

export function AdmMenuUsuarios({ menuEscolhido }) {
    const { criarUsuario } = useCriarUsuario()
    const { alterarUsuario } = useAlterarUsuario()
    const { listarUsuarios } = useListarUsuarios()
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([])
    const { toastWarning } = useToast()
    const { formData, handleChange } = useForm({ filtro: "" })
    const navigate = useNavigate()

    useEffect(() => {
        if (menuEscolhido > 16) {
            fetchUsuarios()
        }
    }, [menuEscolhido, formData.filtro])

    async function fetchUsuarios() {
        const usuariosData = await listarUsuarios()
        const _usuariosFiltrados = usuariosData.filter(usr => usr.apelido.toLowerCase().includes(formData.filtro.toLowerCase()))
        setUsuariosFiltrados(_usuariosFiltrados)
    }

    function renderMenuCriarUsuario() {

        async function _submitCriarUsuario(e) {
            e.preventDefault();
            const apelido = e.target["criar-usuario-apelido"].value;
            const nome_de_usuario = e.target["criar-usuario-nome_de_usuario"].value;
            const senha = e.target["criar-usuario-senha"].value;
            const role = e.target["criar-usuario-role"].value;
            await criarUsuario(apelido, nome_de_usuario, senha, role);
            navigate(0)
        }

        return (
            <form onSubmit={_submitCriarUsuario}>
                <label htmlFor="criar-usuario-apelido">Apelido</label>
                <input type="text" id="criar-usuario-apelido" />

                <label htmlFor="criar-usuario-nome_de_usuario">Nome de Usuário</label>
                <input type="text" id="criar-usuario-nome_de_usuario" />

                <label htmlFor="criar-usuario-senha">Senha</label>
                <input type="password" id="criar-usuario-senha" />

                <label htmlFor="criar-usuario-id">Role</label>
                <select id="criar-usuario-role">
                    <option key={0} value={""}>NENHUM</option>
                    {Object.values(USER_ROLE).map((role) => (
                        <option key={role} value={role}>{`${role}`}</option>
                    ))}
                </select>

                <BotaoPrimario type="submit">
                    Criar
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuAlterarUsuario() {

        async function _submitAlterarUsuario(e) {
            e.preventDefault();
            const id = e.target["alterar-usuario-id"].value;
            const apelido = e.target["alterar-usuario-apelido"].value;
            const nome_de_usuario = e.target["alterar-usuario-nome_de_usuario"].value;
            const role = e.target["alterar-usuario-role"].value;

            if (!Number(id)) {
                toastWarning("É preciso escolher um usuario válido.")
                return
            }

            let novoUsuario = {}
            if (apelido) novoUsuario = { ...novoUsuario, apelido }
            if (nome_de_usuario) novoUsuario = { ...novoUsuario, nome_de_usuario }
            if (role) novoUsuario = { ...novoUsuario, role }

            await alterarUsuario(id, novoUsuario);
            navigate(0)
        }

        return (
            <form onSubmit={_submitAlterarUsuario}>
                <label htmlFor="filtro">Pesquisar Usuário</label>
                <input type="text" id="filtro" name="filtro" value={formData.filtro} onChange={handleChange} />

                <label htmlFor="alterar-usuario-id">Usuario</label>
                <select id="alterar-usuario-id">
                    <option key={0} value={0}>NENHUM</option>
                    {usuariosFiltrados.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>{`${usuario.apelido} (${usuario.id})`}</option>
                    ))}
                </select>

                <label htmlFor="alterar-usuario-apelido">Apelido</label>
                <input type="text" id="alterar-usuario-apelido" />

                <label htmlFor="alterar-usuario-nome_de_usuario">Nome de Usuário</label>
                <input type="text" id="alterar-usuario-nome_de_usuario" />

                <label htmlFor="alterar-usuario-id">Role</label>
                <select id="alterar-usuario-role">
                    <option key={0} value={""}>NENHUM</option>
                    {Object.values(USER_ROLE).map((role) => (
                        <option key={role} value={role}>{`${role}`}</option>
                    ))}
                </select>

                <BotaoPrimario type="submit">
                    Alterar
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuRemoverUsuario() {

        async function _submitRemoverUsuario(e) {
            e.preventDefault();
            const id = e.target["remover-usuario-id"].value;

            if (!Number(id)) {
                toastWarning("É preciso escolher um usuario válido.")
                return
            }
            await alterarUsuario(id, {ativo: false});
            navigate(0)
        }

        return (
            <form onSubmit={_submitRemoverUsuario}>
                <label htmlFor="filtro">Pesquisar usuario</label>
                <input type="text" id="filtro" name="filtro" value={formData.filtro} onChange={handleChange} />

                <label htmlFor="remover-usuario-id">Usuario</label>
                <select id="remover-usuario-id">
                    <option key={0} value={0}>NENHUM</option>
                    {usuariosFiltrados.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>{`${usuario.apelido} (${usuario.id})`}</option>
                    ))}
                </select>

                <BotaoPrimario type="submit">
                    Remover
                </BotaoPrimario>
            </form>
        );
    }

    function renderMenuTrocarSenha() {

        async function _submitTrocarSenha(e) {
            e.preventDefault();
            const id = e.target["trocar-senha-id"].value;
            const senha = e.target["trocar-senha-senha"].value;
            const confirmarSenha = e.target["trocar-senha-confirmar"].value;

            if (!Number(id)) {
                toastWarning("É preciso escolher um usuario válido.")
                return
            }

            if (!senha) {
                toastWarning("É preciso escolher uma senha válida.")
                return
            }

            if (senha !== confirmarSenha) {
                toastWarning("O campo de Confirmar Senha está diferente.")
                return
            }

            await alterarUsuario(id, { senha });
            navigate(0)
        }

        return (
            <form onSubmit={_submitTrocarSenha}>
                <label htmlFor="filtro">Pesquisar Usuário</label>
                <input type="text" id="filtro" name="filtro" value={formData.filtro} onChange={handleChange} />

                <label htmlFor="trocar-senha-id">Usuario</label>
                <select id="trocar-senha-id">
                    <option key={0} value={0}>NENHUM</option>
                    {usuariosFiltrados.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>{`${usuario.apelido} (${usuario.id})`}</option>
                    ))}
                </select>

                <label htmlFor="trocar-senha-senha">Senha</label>
                <input type="password" id="trocar-senha-senha" />

                <label htmlFor="trocar-senha-confirmar">Confirmar Senha</label>
                <input type="password" id="trocar-senha-confirmar" />

                <BotaoPrimario type="submit">
                    Alterar
                </BotaoPrimario>
            </form>
        );
    }

    return (
        <>
            {
                menuEscolhido === 16 ? renderMenuCriarUsuario()
                    : menuEscolhido === 17 ? renderMenuAlterarUsuario()
                        : menuEscolhido === 18 ? renderMenuRemoverUsuario()
                            : menuEscolhido === 19 ? renderMenuTrocarSenha()
                                : null
            }
        </>
    )
}