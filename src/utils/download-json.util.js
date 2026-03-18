export function downloadJson(json, nomeArquivo) {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(json))}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `${nomeArquivo}.json`;

  link.click();
}
