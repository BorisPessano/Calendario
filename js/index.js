var calendar;

const token = obtenerCookie('token');

if (token) {

  } else {

    window.location.href = "login.html"
  }

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
        if (responseData.length > 0) {
            responseData.forEach(function (entrada) {
                console.log(entrada);
                if (entrada.createdAt.getMonth() === Date.now().getMonth() && entrada.createdAt.getYear() === Date.now().getYear()) {
                    calendar.addEvent({
                        id: entrada.createdAt.toString(),
                        title: 'Feriado',
                        start: entrada.createdAt,
                        backgroundColor: "blue"
                    });
                }
            });
        }
    })
    .catch(error => {
        console.error('Error al llamar al servicio:', error);
    });

    
    }
}

// Mostrar el registro al cargar la página
mostrarRegistro();

//fetchear feriados y actions y crear eventos

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: "ES",
      firstDay: 1,
      eventClick: function(info) {
        info.jsEvent.preventDefault(); // don't let the browser navigate
        //redirect a pagina de edicion de actions
        console.log(info.event.id);
      }
    });
    calendar.render();
    mostrarRegistro();
  });

  function obtenerCookie(nombre) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieNombre, cookieValor] = cookie.trim().split('=');
      if (cookieNombre === nombre) {
        return cookieValor;
      }
    }
    return null;
  }
