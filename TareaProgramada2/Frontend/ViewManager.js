// Realiza una solicitud GET al backend y maneja la respuesta
// Obtén una referencia a la tabla
const tabla = document.getElementById('tabla');

const tbody = tabla.querySelector('tbody');






fetch('http://localhost:8080/select')
  .then(response => response.json())
  .then(data => {
    const jsonData = data; // Asigna el valor dentro del .then()
    for (const producto of jsonData) {
        const newRow = tbody.insertRow();
        
        const cellId = newRow.insertCell(0);
        const cellNombre = newRow.insertCell(1);
        const cellPrecio = newRow.insertCell(2);
        
        cellId.textContent = producto.id;
        cellNombre.textContent = producto.nombre;
        cellPrecio.textContent = producto.precio;
        }
    })
    
  .catch(error => {
    console.error('Error al obtener datos desde el backend:', error);
  });





