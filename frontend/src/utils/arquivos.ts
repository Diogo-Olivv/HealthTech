export function contarExamesUltimosDias(arquivos: any[], dias: number = 7): number {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);
    
    return arquivos.filter((arq) => {
        const dataUpload = new Date(arq.dataUpload);
        return dataUpload >= dataLimite;
    }).length;
}
