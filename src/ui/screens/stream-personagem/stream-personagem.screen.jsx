import { useParams } from "react-router-dom";
import { CardPersonagem } from "../../components";
import { useEffect } from "react";
import { useVisualizarPersonagem } from "../../../hook/api/personagem/visualizar-personagem.api";
import { useSocket } from "../../../hook";

export function StreamPersonagem() {
    const { personagemId } = useParams()
    const { socket } = useSocket();
    const { personagem, visualizarPersonagem } = useVisualizarPersonagem()

    useEffect(() => {
        if (personagemId) {
            visualizarPersonagem(personagemId);
            socket.on("personagens", async () => {
                visualizarPersonagem(personagemId)
            });
        }

    }, [personagemId]);


    return <CardPersonagem personagem={personagem }/>

}