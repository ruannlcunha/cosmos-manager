
export function getTemplateCena(str) {
  const resultado = {};
  const regex = /(\w+)=\[([^\]]*)\]/g;
  let correspondencia;

  while ((correspondencia = regex.exec(str)) !== null) {
    const nome = correspondencia[1];
    const valor = correspondencia[2];
    resultado[nome] = valor;
  }

  return resultado;
}