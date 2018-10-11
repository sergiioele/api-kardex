/**
    token 
    1)encabezado 
    2)payload (datos) 
    3) firma de verificacion

    encabezado 
        tipo de token
        algortmo de codificacion

---jwt.io---

*/


var express = require('express');
var jwt = require('jsonwebtoken');
var puerto = process.env.PORT || 3000; //subirlo a heroku o puerto 3000
var app = express();

app.use(express.json());//middleware

app.get('/calificaciones', function (req, res) {
    console.log('token recibido: ' + req.query.token);//query objeto que reciben los paramatros
    jwt.verify(req.query.token, 'clavesupersecreta', function (error,token) {//verificar que el token sea valido
        if (error) {
            res.status(403).json({ mensaje: 'Autorizacion no valida' });
        }
        else {
            res.json({ mensaje: 'Bienvenido '+token.usuario+' Aqui estan las calificaciones...' });
        }
    });

});


app.post('/login', function (req, res) {
    var alumno = {//simular base de datos
        email: 'alumno@uaslp.mx',
        password: '123'
    };
    var profesor = {//simular base de datos
        email: 'profesor@uaslp.mx',
        password: 'abc'
    };
    if (req.body.email == alumno.email && req.body.password == alumno.password) {
        //payload        , clave             ,opciones adicionales
        var token = jwt.sign({
            usuario: 'alumno',
            nombre: 'Raul',
            claveUnica: '123456'
        }, 'clavesupersecreta', { expiresIn: '1h' });//crear token
        console.log("token generador " + token);
        res.json({mensaje:'Bienvenido alumno', elToken: token });
    }
    else if (req.body.email == profesor.email && req.body.password == profesor.password) {
        //payload        , clave             ,opciones adicionales
        var token = jwt.sign({
            usuario: 'profesor',
        }, 'clavesupersecreta', { expiresIn: '1h' });//crear token
        console.log("token generador " + token);
        res.json({mensaje:'Bienvenido profesor', elToken: token });
    }
    else{
        res.status(401).json({mensaje:'Credenciales no validas',elToken:null});
    }
});

app.listen(puerto, function () {
    console.log('Servidor corriendo en el puerto: ' + puerto);
});