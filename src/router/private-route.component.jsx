import { useEffect } from "react"
import useGlobalUser from "../context/user/global-user.context"
import { Navigate } from "react-router-dom"
import { useVerificarConexao } from "../hook/api/_base/verificar-conexao.api"
import { useToast } from "../hook"
import { RootScreen } from "../ui/screens"

export function PrivateRoute({ Screen, role }) {
    const [user] = useGlobalUser()
    const { conexao, verificarConexao } = useVerificarConexao()
    const { toastError } = useToast();

    useEffect(() => {
        verificarConexao()
    }, [])

    function renderRoute() {
        if (conexao.loading) return <RootScreen />
        if (!conexao.loading && conexao.result) {
            if (user.id) {
                if (role) {
                    if (user.role !== role) {
                        toastError({ response: "O usuário logado não possui permissões suficientes para acessar esta página." })
                        return <Navigate to={"/login"} />
                    }
                }
                return <Screen />
            }
            else {
                toastError({ response: "Nenhum usuário válido está logado." })
                return <Navigate to={"/login"} />
            }
        }
        else {
            toastError({ response: "Não foi possível se conectar ao servidor." })
            return <Navigate to={"/"} />
        }
    }

    return renderRoute()
}