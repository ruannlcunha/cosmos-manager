import { BotaoPrimario } from "../botao-primario/botao-primario.component"
import { Modal } from "../modal/modal.component"
import { Imagem } from "../"
import "./alterar-imagem-modal.style.css"
import { useEffect } from "react"

export function AlterarImagemModal({ formData, setFormData, iconePadrao, isOpen, setIsOpen }) {

    useEffect(() => {
        if (isOpen) {
            setFormData({ ...formData, imagemNova: null })
        }
    }, [isOpen])

    function handleChangeImage(e) {
        const file = e.target.files[0]

        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFormData({
                ...formData, imagemNova: {
                    src: file.name,
                    alt: file.name,
                    dataUri: reader.result
                }
            });
        };
        reader.readAsDataURL(file);
    }

    function handleCancelar() {
        setIsOpen(false)
    }

    async function handleSalvar() {
        setFormData({ ...formData, imagemAtual: formData.imagemNova })
        setIsOpen(false)
    }

    function renderImagemContainer(texto, index, haveInput) {
        const data = formData[index] ? formData[index] : iconePadrao
        return (
            <div className="imagem-section">
                <h2>{texto}</h2>
                <div className="imagem-container"><Imagem data={data} style={!formData[index] ? { opacity: "50%" } : null} /></div>
                {haveInput ?
                    <input
                        type="file"
                        id={`imagem-input-${index}`}
                        accept="image/*"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleChangeImage(e)}
                    />
                    : null}
            </div>
        )
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="alterar-imagem-modal">
                <header className="alterar-imagem-header">
                    <h1>Alterar Imagem</h1>
                </header>
                <section className="alterar-imagem-section">
                    <section>{renderImagemContainer("Imagem Atual", "imagemAtual", false)}</section>
                    <section>{renderImagemContainer("Imagem Nova", "imagemNova", true)}</section>
                </section>
                <footer className="alterar-imagem-footer">
                    <BotaoPrimario onClick={handleCancelar}>Cancelar</BotaoPrimario>
                    <BotaoPrimario onClick={handleSalvar}>Salvar</BotaoPrimario>
                </footer>
            </div>
        </Modal>
    )

}