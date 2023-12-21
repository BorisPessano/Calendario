function Registrarse() {
    var fecha = new Date();
    var name = document.getElementById('Name').value;
    var surname = document.getElementById('Surname').value;
    var email = document.getElementById('Email').value;
    var password = document.getElementById('Password').value;
    var phone = document.getElementById('Phone').value;
    
    var body = {
        name,
        surname,
        email,
        password,
        phone,
    }

    fetch('http://localhost:6001/api/clevendario/user/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(body)

    }).then(response => response.json())
    .then(responseData => {
        alert("Usuario creado");
    })
    .catch(error => {
        console.error('Error al llamar al servicio:', error);
    });

    // Llamo al magico
    
}

function onBack() {
    window.location.href = 'login.html';

}