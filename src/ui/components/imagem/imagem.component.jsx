
export function Imagem({ data, style, className, onClick, key }) {
    if(data) {
        const _id = data.id ? data.id : data.src
        const _dataUri = data.dataUri ? data.dataUri : data.src
        return <img key={key} id={_id} name={data.src} src={_dataUri} alt={data.alt} className={className} style={style} onClick={onClick}/>
    }
}