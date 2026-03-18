import "./login.style.css"
import { BackButton, BotaoPrimario, ContainerScreen, Imagem } from "../../components"
import { useForm } from "../../../hook";
import { useRealizarLogin } from "../../../hook/api/usuario/realizar-login.api";
import useGlobalUser from "../../../context/user/global-user.context";
import { useNavigate } from "react-router-dom";
import { ICONS } from "../../../constants";
import { useEffect } from "react";

export function LoginScreen() {
    const { formData, setFormData, handleChange } = useForm({ usuario: "", senha: "" });
    const { realizarLogin } = useRealizarLogin()
    const navigate = useNavigate();
    const [user, setUser] = useGlobalUser();

    async function handleLogin(e) {
        e.preventDefault()
        const novoUsuario = await realizarLogin(formData.usuario, formData.senha)
        if (!novoUsuario) {
            setFormData({ ...formData, senha: "" })
            return
        }
        setUser({ ...user, ...novoUsuario })
        navigate("/home/personagens")
    }

    return (
        <ContainerScreen>
            <BackButton navigateTo={"/"}/>
            <div className="login-screen">
                <Imagem data={ICONS.LOGO} />
                <form onSubmit={handleLogin}>
                    <header>
                        <h1>Login</h1>
                    </header>
                    <section>
                        <label>Usuário</label>
                        <input type="text" name={"usuario"} value={formData.usuario} onChange={handleChange} />
                        <label>Senha</label>
                        <input type="password" name={"senha"} value={formData.senha} onChange={handleChange} />
                    </section>
                    <footer>
                        <BotaoPrimario>Entrar</BotaoPrimario>
                    </footer>
                </form>
            </div>
        </ContainerScreen>
    )

}