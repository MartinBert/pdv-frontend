export function processDetailReceipt(codigoDocumento, totalVenta) {
    const creditCode = ["003", "008", "013", "112", "113", "114"];
    let evaluation = creditCode.filter((el) => el === codigoDocumento);
    if (evaluation) {
      evaluation = "CREDITO";
    } else {
      evaluation = "DEBITO";
    }

    let object = {
      nombre: evaluation,
      cantUnidades: 1,
      precioUnitario: parseFloat(totalVenta).toFixed(
        2
      ),
      precioTotal: parseFloat(totalVenta).toFixed(2),
    };

    return object;
}

export function checkDocuments(docs) {
  const arr = [
    "002",
    "003",
    "007",
    "008",
    "012",
    "013",
    "112",
    "113",
    "114",
    "115",
    "116",
    "117",
    "9999",
  ];
  const filteredDocs = docs.filter((el) => {
    for (let i = 0; i < arr.length; i++) {
      if (el.codigoDocumento === arr[i]) {
        return el;
      }
    }
  });

  return filteredDocs;
}