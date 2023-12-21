function Login() {
   
    var email = document.getElementById('Email');
    var pass  = document.getElementById('Password');
    
    let body = {
        email: email.value,
        password: pass.value
    }
    
    // Llamo al magico
    fetch('http://localhost:6001/api/clevendario/user/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(body)

    }).then(response => response.json())
    .then(responseData => {
        establecerCookie('token',responseData.access_token,3600);
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Error al llamar al servicio:', error);
    });
    
    
    
    
}

function establecerCookie(nombre, valor, expiracion) {
    const fechaExpiracion = new Date();
    fechaExpiracion.setTime(fechaExpiracion.getTime() + expiracion * 1000); // expiracion en segundos

    const opciones = {
      expires: fechaExpiracion.toUTCString(),
      path: '/', // Ruta para la cual la cookie es válida
      sameSite: 'strict', // Restringir la cookie a solicitudes del mismo sitio
      secure: window.location.protocol === 'https:', // Solo enviar la cookie en conexiones seguras (https)
    };

    document.cookie = `${nombre}=${valor}; ${Object.entries(opciones).map(([key, value]) => `${key}=${value}`).join('; ')}`;
  }
