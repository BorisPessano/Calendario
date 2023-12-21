document.addEventListener("DOMContentLoaded", function () {
    const calendarContainer = document.getElementById("calendar");


    fetch('http://localhost:6001/api/clevendario/getAll', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
        .then(response => response.json())
        .then(presentDays => {
            const holidays = [
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
            ];

            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);

            let calendarHTML = '<table>';
            for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
                const formattedDate = day.toISOString().split("T")[0];

                if (day.getDay() !== 0 && day.getDay() !== 6) {
                    const holiday = holidays.find(h => h.date === formattedDate);
                    const isHoliday = holiday !== undefined;
                    const isAttendancePresent = presentDays.includes(formattedDate);
                    const cellClass = isHoliday ? "holiday" : isAttendancePresent ? "attendance-present" : "";

                    const cellContent = isHoliday ? holiday.description : day.getDate();
                    calendarHTML += `<td class="${cellClass}">${cellContent}</td>`;
                } else {
                    calendarHTML += '<td class="non-working"></td>';
                }

                if (day.getDay() === 5) {
                    calendarHTML += '</tr><tr>';
                }
            }
            calendarHTML += '</tr></table>';

            calendarContainer.innerHTML = calendarHTML;

            const workDays = lastDay.getDate();
            const presentDaysCount = presentDays.length;
            const presentPercentage = (presentDaysCount / workDays) * 100;

            if (presentPercentage < 60) {
                const remainingDays = Math.ceil((0.6 * workDays) - presentDaysCount);
                alert(`Te faltan ${remainingDays} días más de asistencia a la oficina`);
            }
        })
        .catch(error => {
            console.error('Error al llamar al servicio:', error);
        });
});
