export function generateInvoiceNumber() {
    // Generar el punto de venta: un número entre 1 y 9999
    const salesPoint = Math.floor(Math.random() * (9999 - 1 + 1)) + 1;
  
    // Generar el número de factura: un número entre 1 y 99999999
    const invoiceNumber = Math.floor(Math.random() * (99999999 - 1 + 1)) + 1;
  
    // Formatear el punto de venta (4 dígitos) y el número de factura (8 dígitos)
    const formattedSalesPoint = salesPoint.toString().padStart(4, "0");
    const formattedInvoiceNumber = invoiceNumber.toString().padStart(8, "0");
  
    // Concatenar ambos números para crear el código completo
    return `${formattedSalesPoint}-${formattedInvoiceNumber}`;
  }