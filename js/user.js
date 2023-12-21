ocultarSpinner();

function Registrarse() {
    var fecha = new Date();
    var name = document.getElementById('Name').value;
    var surname = document.getElementById('Surname').value;
    var email = document.getElementById('Email').value;
    var password = document.getElementById('Password').value;
    var phone = document.getElementById('Phone').value;
    var role = document.getElementById('slcRole').value === "dev" ? 1 : 2;
    
    var body = {
        name,
        surname,
        email,
        password,
        phone,
        role,
    }
    mostrarSpinner();
    fetch('http://localhost:6001/api/clevendario/user/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(body)

    }).then(response => response.json())
    .then(responseData => {
        if(!responseData.message){
            alert("Usuario creado");
        }else{
            alert("Este correo ya esta registrado")
        }
        ocultarSpinner();
    })
    .catch(error => {
        console.error('Error al llamar al servicio:', error);
        ocultarSpinner();
    });
}

function onBack() {
    window.location.href = 'login.html';
}

function mostrarSpinner() {
    var spinner = document.getElementById("spinner");
    spinner.style.display = "block";
  }
  
  function ocultarSpinner() {
    var spinner = document.getElementById("spinner");
    spinner.style.display = "none";
  }