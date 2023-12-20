function marcarAsistencia() {
    var fecha = new Date();
    
    var email = document.getElementById('email');
    var name = document.getElementById('name');
    var surname = document.getElementById('lastname');
    var presencial = document.getElementById('Presencial');
    var remoto = document.getElementById('Remote');
    let action = 0
    if (presencial.value == 1){
        action = 1
    } else {
        action = 2
    }

    // Llamo al magico
    let body = {
        email: email.value,
        action: action
    }

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
    mostrarRegistro();
}

function mostrarRegistro() {
    var registro = document.getElementById('registro') || '[]';
    var registroHTML = "";
    var email = document.getElementById('email');
    registro = registro.value;
    if (email.value != ''){
        fetch(`http://localhost:6001/api/clevendario/action/getByEmail?email=${email.value}`,{
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
                registroHTML += '<li>' + entrada.createdAt + '</li>';
            });
            registroHTML += '</ul>';
        } else {
            registroHTML += '<p>No hay registros de asistencia.</p>';
        }

        document.getElementById('registro').innerHTML = registroHTML;
    })
    .catch(error => {
        console.error('Error al llamar al servicio:', error);
    });

    
    }
}

// Mostrar el registro al cargar la página
mostrarRegistro();