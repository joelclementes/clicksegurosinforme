import { FechaDMY } from "./funciones.js";
class App {
    constructor(reset = false) {

        // Usamos esta url porque solo necesitamos datos y los obtenemos por método GET
        const urlGet = "http://localhost/clicksegurosbackend/proceso.php/";
        const urlPost = "http://localhost/clicksegurosbackend/procesopost.php/";

        if (reset) {
            let usuario = document.querySelector("#usu");
            let clave = document.querySelector("#cla");
            usuario.addEventListener("keydown", (e) => {
                if (e.key == 'Enter') {
                    clave.value = "";
                    clave.focus();
                }
                if (e.key == 'Escape') {
                    usuario.value = "";
                }
            })
            clave.addEventListener("keydown", (e) => {
                if (e.key == 'Enter') {
                    fnConsultarUsuario(usuario.value, clave.value);
                }
                if (e.key == 'Escape') {
                    usuario.focus();
                    usuario.select();
                }
            })

            document.getElementById("btnOk").addEventListener("click", () => {
                fnConsultarUsuario(usuario.value, clave.value);
            })

            document.getElementById("cerrarSesion").addEventListener("click", () => {
                sessionStorage.removeItem("claveUsuario");
                inicio();
            })

            inicio();
        }

        function inicio(){
            if (sessionStorage.getItem("claveUsuario") == null) {
                document.getElementById("cardsSolicitudes").innerHTML = "";
                document.getElementById("formLogin").setAttribute("style","");
                document.querySelector(".nav").setAttribute("style","display:none");
                document.getElementById("usu").focus();
            } else {
                document.getElementById("usu").value="";
                document.getElementById("cla").value="";
                document.querySelector(".nav").setAttribute("style","");
                document.getElementById("formLogin").setAttribute("style","display:none");
                // fnConstruyeFiltros();
                fnSolicitudSelect();
            }
        }

        function fnConsultarUsuario(usuario, clave) {
            // Vamos a consultar el usuario que se quiere logear
            if (usuario == "" || clave == "") {
                return;
            }

            let claveLogin = usuario;
            var pwdLogin = md5(clave);
            // Establecemos la url para la petición get
            let url = urlGet + `?proceso=USUARIO_SELECT&clave=${claveLogin}`

            $.ajax({
                url: url,
                dataType: "json",
                success: function (informacion) {
                    // Validamos que exista el usuario y que esté correcta la contraseña
                    if (informacion == null) {
                        document.getElementById("mensajeLogin").innerHTML = "No existe el usuario. Intente de nuevo."
                        inicio();
                        return;
                    }
                    if (pwdLogin != informacion.pwd) {
                        document.getElementById("mensajeLogin").innerHTML = "Contraseña incorrecta. Intente de nuevo.";
                        inicio();
                        return;
                    }

                    // Si la validación es correcta guardamos en un log la sesión iniciada por el usuario
                    sessionStorage.setItem("claveUsuario",claveLogin);
                    loginicio_insert(informacion.nombreUsuario);

                    inicio();
                }, error: function (err) {
                    //alert(err);
                    // console.log(err);
                }
            })
        }

        function fnSolicitudSelect() {
            const PROCESO = "?proceso=SOLICITUD_SELECT";
            const url = urlGet + PROCESO;
            let strOpciones;
            $.ajax({
                url: url,
                dataType: "json",
                success: function (datos) {
                    construyeInforme(datos);
                }
            })
        }

        function loginicio_insert(usuario){
            var parametrosAjax = new FormData();
            parametrosAjax.append("proceso", "LOGINICIO_INSERT");
            parametrosAjax.append("usuario", usuario);
            $.ajax({
                url: urlPost,
                type: "POST",
                data: parametrosAjax,
                contentType: false,
                cache: false,
                processData: false,
                async: false,
                success: function (resultado) {
                    console.log(resultado);
                }
            })
        }

        function fnConstruyeFiltros(){
            const PROCESO = "?proceso=CATTIPOSEGURO_SELECT_DISTINCT";
            const url = urlGet + PROCESO;
            let strOpciones;
            $.ajax({
                url: url,
                dataType: "json",
                success: function (datos) {
                    let strFiltros = `
                    <input type="radio" class="btn-check" name="filtro" id="todos" checked>
                    <label class="btn btn-outline-light" for="todos">Todos</label>
                    `;
                    for (let d of datos) {
                        strFiltros += `
                        <input type="radio" class="btn-check" name="filtro" id="ts-${d.idSection}">
                        <label class="btn btn-outline-light" for="ts-${d.idSection}">${d.idSection}</label>`;
                    }
                    document.getElementById("btnFiltros").innerHTML = strFiltros;
                }
            })
        }

        function construyeInforme(datos) {
            /**
             * datos trae todos los datos de las tablas de la BD:
             * solicitud, solicitudsegurogastosmedicos, solicitudsegurovehiculos, solicitudsegurovidaahorro
             */
            const solicitudes = JSON.parse(datos.sDatos);
            const solicitudesGastosMedicos = JSON.parse(datos.sGastosMedicos);
            const solicitudesVehiculos = JSON.parse(datos.sVehiculos);
            const solicitudesVidaAhorro = JSON.parse(datos.sVidaAhorro);

            let strCards = ``;
            
            for (let s of solicitudes) {
                
                switch (s.tiposeguro) {
                    case 'Vehículo':
                        strCards = strCards + cardVehiculo(s, solicitudesVehiculos);
                        break;
                    case 'GastosMedicos':
                        strCards = strCards + cardGastosMedicos(s, solicitudesGastosMedicos);
                        break;
                    case 'VidaAhorro':
                        strCards = strCards + cardVidaAhorro(s, solicitudesVidaAhorro);
                        break;
                    case 'Otro':
                        strCards = strCards + cardOtro(s);
                        break;
                }
            }
            document.getElementById("cardsSolicitudes").innerHTML = strCards;
            
        }

        const encabezadoCard = (solicitud) => {
            return `
            <h5 class="card-title">${solicitud.nombre}</h5>
            <em>${FechaDMY(solicitud.fecha)}</em>
            <p class="card-text">
                Tipo de seguro: <span class="dato">${solicitud.cosaasegurada}</span> | 
                Pais: <span class="dato">${solicitud.pais}</span> | Código postal: <span class="dato">${solicitud.codigopostal}</span> |
                Celular: <span class="dato">${solicitud.celular}</span> | Correo: <span class="dato">${solicitud.correo}</span>
            </p>
            `;
        }

        function cardVehiculo(solicitud, vehi) {
            // let vehiculo = vehi[0]
            let cadena = ``;
            for (let vehiculo of vehi) {
                if (vehiculo.idSolicitud == solicitud.id) {
                    cadena = `
                    <div class="ts-${solicitud.tiposeguro}">
                        <div class="card card-asegurado" >
                            <div class="card-body ">
                                ${encabezadoCard(solicitud)}
                                <hr>
                                <h6>Datos del vehículo</h6>
                                <p class="card-text">
                                    Tipo de persona: <span class="detalle">${vehiculo.tipopersona}</span></br>
                                    Modelo: <span class="detalle">${vehiculo.modelo}</span> | 
                                    Marca: <span class="detalle">${vehiculo.marca}</span> | 
                                    Versión: <span class="detalle">${vehiculo.version}</span> | 
                                    Transmisión: <span class="detalle">${vehiculo.transmision}</span> | 
                                    Descripción: <span class="detalle">${vehiculo.descripcionversion}</span></br>
                                    Cobertura: <span class="detalle">${vehiculo.tipodecobertura}</span></br>
                                </p>
                            </div>
                        </div>
                    </div>
                    `;
                }
            }
            return cadena;
        }

        function cardGastosMedicos(solicitud, asegurados) {
            let cadena = ``;
            cadena = `
            <div class="ts-${solicitud.tiposeguro}">
            <div class="card  card-asegurado " >
                <div class="card-body ">
                ${encabezadoCard(solicitud)}
                    <hr>
                    <h6>Beneficiarios</h6>
                    `;
            let idSolicitud = solicitud.id;
            for (let a of asegurados) {
                if (a.idSolicitud == idSolicitud) {
                    cadena += `
                        <p class="card-text">
                        Nombre: <span class="detalle">${a.nombre}</span> Género: <span class="detalle">${a.genero}</span> | 
                        Fecha de nacimiento: <span class="detalle">${FechaDMY(a.fechanacimiento)}</span> | Ocupación: <span class="detalle">${a.ocupacion}</span></br>
                        Parentezco: <span class="detalle">${a.parentezco}</span> | 
                        Practica deportes peligrosos: <span class="detalle">${a.practicadeportespeligrosos}</span>
                    </p>
                        `;
                }
            }
            cadena += `
                </div>
            </div>
            </div>
            `;
            return cadena;
        }

        const proteccionalconyuge = (datos) => {
            let texto = ``;
            if (datos.conyugeproteccion == "Si") {
                texto += `
                Protección al cónyuge: <span class="detalle">${datos.conyugeproteccion}</span> | Fecha de nacimiento: <span class="detalle">${FechaDMY(datos.conyugefechadenacimiento)}</span> | Edad: <span class="detalle">${datos.conyugeedad}</span> | Género: <span class="detalle">${datos.conyugegenero}</span></br>
                `;
            }
            return texto;
        }

        function cardVidaAhorro(solicitud, asegurados) {
            let cadena = ``;
            cadena = `
            <div class="ts-${solicitud.tiposeguro}">
            <div class="card  card-asegurado " >
                <div class="card-body ">
                ${encabezadoCard(solicitud)}
                    <hr>
                    <h6>Datos</h6>
                    `;
            let idSolicitud = solicitud.id;
            for (let a of asegurados) {
                if (a.idSolicitud == idSolicitud) {
                    cadena += `
                        <p class="card-text">
                        Nombre contratante: <span class="detalle">${a.nombrecontratante}</span> Género: <span class="detalle">${a.generocontratante}</span> | 
                        Fecha de nacimiento: <span class="detalle">${FechaDMY(a.fechanacimientocontratante)}</span> | Ocupación: <span class="detalle">${a.ocupacioncontratante}</span></br>
                        ${proteccionalconyuge(a)}
                        Retorno de inversión: Baja <span class="detalle">${a.retornoinversionbaja}%</span>     Media: <span class="detalle">${a.retornoinversionmedia}%</span>     Alta: <span class="detalle">${a.retornoinversionalta}%</span>
                    </p>
                        `;
                }
            }
            cadena += `
                </div>
            </div>
            </div>
            `;
            return cadena;
        }

        function cardOtro(solicitud) {
            let cadena = ``;
            cadena = `
            <div class="ts-${solicitud.tiposeguro}">
                <div class="card  card-asegurado" >
                    <div class="card-body ">
                    ${encabezadoCard(solicitud)}
                        <hr>
                        <h6>Descripción</h6>
                        <p class="card-text detalle">
                            ${solicitud.descripcionotro}
                        </p>

                    </div>
                </div>
            </div>
            `;
            return cadena;
        }
    }
}
window.onload = () => new App(true);
