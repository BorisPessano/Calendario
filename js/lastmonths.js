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

ocultarSpinner();

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
    clearEvents();
    mostrarFeriados();
    var registro = document.getElementById('registro') || '[]';
    let email = obtenerCookie('email');
    registro = registro.value;
    mostrarSpinner()
    if (email != '') {
        fetch(`https://clevendario-api.fly.dev/api/clevendario/action/getByEmail?email=${email}`, {
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

        ocultarSpinner();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: "ES",
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
    });
    calendar.render();
    mostrarRegistro();
});

function ocultarSpinner() {
    var spinner = document.getElementById("spinner");
    spinner.style.display = "none";
}

function clearEvents() {
    var listEvent = calendar.getEvents();
    listEvent.forEach(event => {
        event.remove()
    });
}

function mostrarSpinner() {
    var spinner = document.getElementById("spinner");
    spinner.style.display = "block";
}

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

    return remainingDays = Math.ceil((0.6 * workDays) - presentDaysCount);
}

function calculateWeekends(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weekends = Math.floor((lastDay.getDate() + firstDay.getDay()) / 7) * 2;
    return weekends;
}