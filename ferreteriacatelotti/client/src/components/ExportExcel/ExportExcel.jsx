import React from "react";
import * as XLSX from "xlsx";

const ExportToExcel = ({ data, fileName, columnMap }) => {
  // Función para mapear los nombres de las columnas
  const mapColumns = (data, columnMap) => {
    return data.map((item) => {
      const mappedItem = {};
      for (const key in item) {
        // Si la clave existe en columnMap, reemplaza el nombre
        if (columnMap[key]) {
          mappedItem[columnMap[key]] = item[key];
        } else {
          // Si no, deja la clave original
          mappedItem[key] = item[key];
        }
      }
      return mappedItem;
    });
  };

  // Función para exportar los datos a Excel
  const exportToExcel = (data, filename) => {
    const mappedData = mapColumns(data, columnMap); // Renombramos las columnas
    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const handleExport = () => {
    exportToExcel(data, fileName);
  };

  return (
    <div>
      <button onClick={handleExport}>Exportar a Excel</button>
    </div>
  );
};

export default ExportToExcel;

