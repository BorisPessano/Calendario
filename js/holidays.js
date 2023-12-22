var calendar;

var holidays = [
    { date: "2024-01-01", description: "Año Nuevo" },
    { date: "2024-02-12", description: "Carnaval" },
    { date: "2024-02-13", description: "Carnaval" },
    { date: "2024-03-28", description: "Semana de turismo" },
    { date: "2024-03-29", description: "Semana de turismo" },
    { date: "2024-04-22", description: "Desembarco de los 33. Feriado corrido de fecha" },
    { date: "2024-05-01", description: "Día de los trabajadores" },
    { date: "2024-06-19", description: "Natalicio de Artigas" },
    { date: "2024-07-18", description: "Jura de la Constitución" },
    { date: "2024-12-25", description: "Navidad" },
    { date: "2023-12-25", description: "Navidad" },
];

function marcarAsistencia() {

    var email = document.getElementById('email');
    var presencial = document.getElementById('presencial');
    let action = 0
    if (presencial.value == 1) {
        action = 1
    } else {
        action = 2
    }

    let body = {
        email: email.value,
        action: action
    }

    fetch('http://localhost:6001/api/clevendario/action', {
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

function calculateRemainingDays(presentDays) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const weekends = calculateWeekends(year, month);
    const workDays = totalDays - weekends;
    const presentDaysCount = presentDays.length;
    const presentPercentage = (presentDaysCount / workDays) * 100;

    if (presentPercentage < 60) {
        const remainingDays = Math.ceil((0.6 * workDays) - presentDaysCount);
        alert(`Te faltan ${remainingDays} días más de asistencia a la oficina`);
    }
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
        return date.getMonth() === new Date().getMonth() && date.getYear() === new Date().getYear();
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

function mostrarRegistro() {
    var registro = document.getElementById('registro') || '[]';
    var email = document.getElementById('email');
    registro = registro.value;
    if (email.value != '') {
        fetch(`http://localhost:6001/api/clevendario/action/getByEmail?email=${email.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }

        }).then(response => response.json())
            .then(responseData => {
                var filteredData = responseData.filter(val => {
                    var date = new Date(val.createdAt);
                    return date.getMonth() === new Date().getMonth() && date.getYear() === new Date().getYear();
                });
                calculateRemainingDays(filteredData);
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
                console.error('Error al llamar al servicio:', error);
            });


    }
}

// Mostrar el registro al cargar la página
mostrarRegistro();

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: "ES",
        firstDay: 1,
        eventClick: function (info) {
            info.jsEvent.preventDefault(); // don't let the browser navigate
            //redirect a pagina de edicion de actions
            console.log(info.event.id);
        }
    });
    calendar.render();
    mostrarFeriados();
    mostrarRegistro();
});