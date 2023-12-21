var calendar;

function marcarAsistencia() {
    
    var email = document.getElementById('email');
    var presencial = document.getElementById('presencial');
    let action = 0
    if (presencial.value == 1){
        action = 1
    } else {
        action = 2
    }

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
    });
    mostrarRegistro();
}

function mostrarRegistro() {
    var registro = document.getElementById('registro') || '[]';
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
                var date = new Date(entrada.createdAt);
                console.log(entrada);
                if (date.getMonth() === new Date().getMonth() && date.getYear() === new Date().getYear()) {
                    calendar.addEvent({
                        id: entrada.createdAt,
                        title: 'Feriado',
                        start: date,
                        backgroundColor: "red"
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