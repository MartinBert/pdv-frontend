export function exportPDF(res) {
    let file = new Blob([res["data"]], { type: "application/pdf" });
    let fileURL = URL.createObjectURL(file);
    return window.open(fileURL, "_blank");
}