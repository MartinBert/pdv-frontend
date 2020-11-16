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