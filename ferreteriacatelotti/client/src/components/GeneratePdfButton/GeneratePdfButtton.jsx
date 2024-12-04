import { jsPDF } from "jspdf";

const handleGeneratePDF = () => {
  const doc = new jsPDF();

  // Datos que se van a incluir en el PDF
  const data = {
    fecha: purchaseOrderDate,
    proveedor: selectedSuppliers.length > 0 ? selectedSuppliers[0].label : 'Sin proveedor',
    estado: localStatus,
    productos: rows, // Los productos que tienes en rows
  };

  // Establecer la fuente
  doc.setFont("helvetica", "normal");

  // Títulos de las columnas
  const columns = ['Producto', 'Cantidad', 'Costo Unitario', 'Total'];

  // Título de la tabla
  doc.text("Detalles del Pedido de Compra", 20, 20);
  doc.text(`Fecha: ${data.fecha}`, 20, 30);
  doc.text(`Proveedor: ${data.proveedor}`, 20, 40);
  doc.text(`Estado: ${data.estado}`, 20, 50);

  // Ajustar la posición y el espaciado para los productos
  let yOffset = 60;

  // Añadir los títulos de las columnas
  columns.forEach((column, index) => {
    doc.text(column, 20 + (index * 45), yOffset); // Ajusta el desplazamiento horizontal
  });

  // Añadir los productos y sus datos
  yOffset += 10; // Aumenta un poco para separar los títulos de los datos
  data.productos.forEach((producto, index) => {
    doc.text(producto.detailOrderProduct, 20, yOffset); // Producto
    doc.text(`${producto.detailOrderQuantity}`, 65, yOffset); // Cantidad
    doc.text(`${producto.detailOrderUnitCost}`, 110, yOffset); // Costo Unitario
    doc.text(`${producto.totalCost}`, 155, yOffset); // Total
    yOffset += 10;
  });

  // Guardar el PDF
  doc.save("pedido_compra.pdf");

  return (
    <button onClick={generatePDF}>Generar PDF</button>
  );
};

export default GeneratePDFButton;
