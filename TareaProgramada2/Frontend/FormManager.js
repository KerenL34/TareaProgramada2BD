const miForm = document.getElementById("insert-form")

// Agregar un event listener al botón de envío
miForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    // Obtener los valores de los campos de entrada
    let nombreInput = document.getElementById('nombre');
    let precioInput = document.getElementById('precio');
    const nombreValue = nombreInput.value;
    const precioValue = parseInt(precioInput.value); // Convertir a entero


    fetch('http://localhost:8080/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({inNombre: nombreValue,inPrecio: precioValue})
    }).then(x=>{

        alert("El articulo ha sido agregado")
        nombreInput.value = '';
        precioInput.value = '';
    })
    .catch(error => {
        console.log('Error al obtener datos desde el backend:', error);
      })
});