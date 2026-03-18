import "./container-screen.style.css";

export function ContainerScreen({ children, style }) {

  return (
    <>
    <div className="container-screen" style={style}>
      {children}
    </div>
    </>
  )
}
