function Login() {
   
    var email = document.getElementById('Email');
    var pass  = document.getElementById('Password');
    
    let body = {
        email: email.value,
        password: pass.value
    }
    console.log('intento de body: ', body)
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
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Error al llamar al servicio:', error);
    });
    
    
    
    
}