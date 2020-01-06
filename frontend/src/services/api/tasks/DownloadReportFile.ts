import { ICourier } from "services/api";

export async function downloadReportFile(courier: ICourier, id: number) {
    const response = await courier.file(`tasks/${id}/report/file`);
    const blob = await response.blob();
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob);
        return;
    }
    const data = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = data;
    link.download = "report.xlsx";
    link.click();
    // for Firefox it is necessary to delay revoking the ObjectURL
    setTimeout(() => window.URL.revokeObjectURL(data), 100);
}
