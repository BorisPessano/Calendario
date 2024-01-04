var calendar;

var holidays = [
    { start: "2024-01-01", title: "Año Nuevo", color: "blue" },
    { start: "2024-02-12", title: "Carnaval", color: "blue" },
    { start: "2024-02-13", title: "Carnaval", color: "blue" },
    { start: "2024-03-28", title: "Semana de turismo", color: "blue" },
    { start: "2024-03-29", title: "Semana de turismo", color: "blue" },
    { start: "2024-04-22", title: "Desembarco de los 33. Feriado corrido de fecha", color: "blue" },
    { start: "2024-05-01", title: "Día de los trabajadores", color: "blue" },
    { start: "2024-06-19", title: "Natalicio de Artigas", color: "blue" },
    { start: "2024-07-18", title: "Jura de la Constitución", color: "blue" },
    { start: "2024-12-25", title: "Navidad", color: "blue" },
    { start: "2023-12-25", title: "Navidad", color: "blue" },
];

const token = obtenerCookie('token');

if (token) {
    let email = obtenerCookie('email')
    let emailCampo = document.getElementById('email');
    emailCampo.value = email;

}
/* 
else {
    window.location.href = "login.html"
}
*/
ocultarSpinner();

function marcarAsistencia() {

    var email = document.getElementById('email');
    var presencial = document.getElementById('presencial');
    let action = 0
    if (presencial.checked == true) {
        action = 1
    } else {
        action = 2
    }
    let body = {
        email: email.value,
        action: action
    }
    mostrarSpinner()
    fetch('https://clevendario-api.fly.dev/api/clevendario/action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(body)

    }).then(response => response.json())
        .then(responseData => {
            if (!responseData.message) {
                mostrarRegistro();
            } else {
                alert("Ya existe un registro para este dia")
                actualizarRegistro();
            }
            ocultarSpinner();
        })
        .catch(error => {
            ocultarSpinner();
            console.error('Error al llamar al servicio:', error);
        });
    mostrarRegistro();
}

function calculateRemainingDays(presentDays) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const weekends = calculateWeekends(year, month);
    const workDays = totalDays - weekends;
    const presentDaysCount = presentDays.filter(val => val.action.id  === 1).length;
    const presentPercentage = (presentDaysCount / workDays) * 100;

    return remainingDays = Math.ceil((0.6 * workDays) - presentDaysCount);
}

function calculateWeekends(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weekends = Math.floor((lastDay.getDate() + firstDay.getDay()) / 7) * 2;
    return weekends;
}

function mostrarFeriados() {
    holidays.filter(val => {
        var date = new Date(val.date);
        return date.getMonth() === new Date().getMonth() || date.getYear() === new Date().getYear();
    }).forEach(val => {
        var date = new Date(val.date);
        calendar.addEvent({
            id: date,
            title: "Feriado",
            start: date.toISOString().split('T')[0],
            backgroundColor: "blue"
        });
    })
}

function clearEvents() {
    var listEvent = calendar.getEvents();
    listEvent.forEach(event => {
        event.remove()
    });
}

function mostrarRegistro() {
    //clearEvents();
    //mostrarFeriados();
    var registro = document.getElementById('registro') || '[]';
    var email = document.getElementById('email');
    registro = registro.value;
    mostrarSpinner()
    if (email.value != '') {
        fetch(`https://clevendario-api.fly.dev/api/clevendario/action/getByEmail?email=${email.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }

        }).then(response => response.json())
            .then(responseData => {
                var filteredData = responseData.filter(val => {
                    var date = new Date(val.createdAt);
                    ocultarSpinner();
                    return date.getMonth() === new Date().getMonth() && date.getYear() === new Date().getYear();
                    
                });
                document.getElementById("remaining-days").innerText = calculateRemainingDays(filteredData);
                filteredData.forEach(function (entrada) {
                    var date = new Date(entrada.createdAt);
                    calendar.addEvent({
                        id: entrada.createdAt,
                        title: entrada.action.name === "REMOTE" ? "Remoto" : "Presencial",
                        start: date.toISOString().split('T')[0],
                        backgroundColor: entrada.action.name === "REMOTE" ? "red" : "green"
                    });
                });
            })
            .catch(error => {
                ocultarSpinner();
                console.error('Error al llamar al servicio:', error);
            });


    }
}


document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: "ES",
        firstDay: 1,
        events: holidays,
        eventClick: function (info) {
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

function limpiarCookies() {
    let cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var igualPos = cookie.indexOf("=");
        var nombre = igualPos > -1 ? cookie.substr(0, igualPos) : cookie;
        document.cookie = nombre + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

function actualizarRegistro() {
    let modificar = confirm("Desea actualizar el registro existente con esta nueva informacion");

    if (modificar) {
        console.log('llamar servicio de update');
        let email = document.getElementById('email');
        let presencial = document.getElementById('presencial');
        let action = presencial.checked ? 1 : 2;

        let body = {
            email: email.value,
            action: action
        }

        fetch(`https://clevendario-api.fly.dev/api/clevendario/action/update/${email.value}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(responseData => {
                console.log(responseData);
                alert("El registro se ha actualizado correctamente");
                location.replace(location.href);
            })
            .catch(error => {
                console.error(error)
            });
    } else {
        console.log('no pasa nada');
    }
}

function mostrarSpinner() {
    var spinner = document.getElementById("spinner");
    spinner.style.display = "block";
    var spinner2 = document.getElementById("spinner2");
    spinner2.style.display = "block";
}

function ocultarSpinner() {
    var spinner = document.getElementById("spinner");
    spinner.style.display = "none";
    var spinner2 = document.getElementById("spinner2");
    spinner2.style.display = "none";
}


function obtenerRol (){
    let role = obtenerCookie('sesion')

    console.log(role.Role)
}

function mostrarRegistroPorUsuario() {
    clearEvents();
    mostrarFeriados();
    var userSelect = document.getElementById('userSelect');
    var selectedEmail = userSelect.value;

    if (selectedEmail != '') {
        fetch(`https://clevendario-api.fly.dev/api/clevendario/action/getByEmail?email=${selectedEmail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }).then(response => response.json())
            .then(responseData => {
                var filteredData = responseData.filter(val => {
                    var date = new Date(val.createdAt);
                    ocultarSpinner();
                    return date.getMonth() === new Date().getMonth() && date.getYear() === new Date().getYear();
                });
                document.getElementById("remaining-days").innerText = calculateRemainingDays(filteredData);
                filteredData.forEach(function (entrada) {
                    var date = new Date(entrada.createdAt);
                    calendar.addEvent({
                        id: entrada.createdAt,
                        title: entrada.action.name === "REMOTE" ? "Remoto" : "Presencial",
                        start: date.toISOString().split('T')[0],
                        backgroundColor: entrada.action.name === "REMOTE" ? "red" : "green"
                    });
                });
            })
        }
}