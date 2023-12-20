function marcarAsistencia() {
    var fecha = new Date();
    
    var email = document.getElementById('email');
    var name = document.getElementById('name');
    var surname = document.getElementById('lastname');
    var presencial = document.getElementById('Presencial');
    var remoto = document.getElementById('Remote');
    let action = 0
    if (presencial === 1){
        action = 1
    } else {
        action = 2
    }

     
    // Llamo al magico
    let body = {
        emai: email.value,
        name: name.value,
        surname:surname.value,
        action: action
    }

    console.log('ElBody: ',body)

    fetch('http://localhost:6001/api/clevendario/action',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(body)

    }).then(response => response.json())
    .then(responseData => {
        mostrarRegistro();
    })
    .catch(error => {
        console.error('Error al llamar al servicio:', error);
    });;

    
}

function mostrarRegistro() {
    var registro = document.getItem('registro') || '[]';
    var registroHTML = "";
    registro = JSON.parse(registro);

    fetch('http://localhost:6001/api/clevendario/health',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }

    }).then(response => response.json())
    .then(responseData => {
         registroHTML = '<h2>Registro de Asistencia</h2>';
        if (responseData.length > 0) {
            registroHTML += '<ul>';
            responseData.forEach(function (entrada) {
                registroHTML += '<li>' + entrada.fecha + '</li>';
            });
            registroHTML += '</ul>';
        } else {
            registroHTML += '<p>No hay registros de asistencia.</p>';
        }
    })
    .catch(error => {
        console.error('Error al llamar al servicio:', error);
    });;

    

    document.getElementById('registro').innerHTML = registroHTML;
}

// Mostrar el registro al cargar la página
mostrarRegistro();