import ExcelJS from "exceljs";

export const createExcelSheet = async (
    workSheet: string,
    arrRows:any[],
    columns: { header: string, key: string, width: number }[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(workSheet);

    worksheet.columns = columns;

    arrRows.forEach((row) => {
        worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    
    console.log("File created successfully.");

    return buffer;

};