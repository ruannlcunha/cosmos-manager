import "./botao-remover.style.css"
import { ICONS } from "../../../constants";
import { Imagem } from "../imagem/imagem.component";
import { useState } from "react";
import { Modal } from "../modal/modal.component";
import { BotaoPrimario } from "../botao-primario/botao-primario.component";

export function BotaoRemover({ deleteFunction, style, texto }) {
    const [confirmIsOpen, setConfirmIsOpen] = useState(false)

    return (
        <>
            <Modal isOpen={confirmIsOpen} setIsOpen={setConfirmIsOpen}>
                <div className="confirm-modal">
                    <header><h1>Remover</h1></header>
                    <h2>{texto}</h2>
                    <footer>
                        <BotaoPrimario onClick={()=>setConfirmIsOpen(false)}>Cancelar</BotaoPrimario>
                        <BotaoPrimario onClick={deleteFunction}>Confirmar</BotaoPrimario>
                    </footer>
                </div>
            </Modal>
            <button className="remover-button" onClick={() => setConfirmIsOpen(true)} style={style}>
                <Imagem data={ICONS.LIXEIRA} />
            </button>
        </>
    )

}