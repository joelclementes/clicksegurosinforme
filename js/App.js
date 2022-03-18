class App {
    constructor(reset = false) {
        sessionStorage.removeItem('asegurados')
        let arrayAseguradosGastosMedicos = [];
        let tarjetasAsegurados = document.getElementById("tarjetasGastosMedicos");
        let totalPorcentaje = 0;

        const urlGet = "http://localhost/clicksegurosbackend/proceso.php/";

        if (reset) {
            fnSolicitudSelect();
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

        function construyeInforme(datos) {
            const solicitudes = JSON.parse(datos.sDatos);
            const solicitudesGastosMedicos = JSON.parse(datos.sGastosMedicos);
            const solicitudesVehiculos = JSON.parse(datos.sVehiculos);
            const solicitudesVidaAhorro = JSON.parse(datos.sVidaAhorro);
            
            let strCards =``;
            for(let s of solicitudes) {
                switch (s.tiposeguro) {
                    // case 'Vehículo':
                    //     break;

                        case 'Gastos médicos':
                            strCards = strCards + cardGastosMedicos(s,solicitudesGastosMedicos);
                        break;
                    // case 'VidaAhorro':

                    //     break;
                    // case 'Otro':

                    //     break;
                }
                console.log(`${s.id} ${s.nombre}`);
            }
            strCards += strCards;
            document.getElementById("cardsSolicitudes").innerHTML = strCards;
        }

        function cardGastosMedicos(solicitud,asegurados){
            let cadena = `
            <div class="card flex-fill card-asegurado" style="width: 18rem;">
                <div class="card-body ">
                    <h5 class="card-title">${solicitud.nombre} ${solicitud.apellidos}</h5>
                    <p class="card-text">
                        Fecha: <b>${solicitud.fecha}</b></br>
                        Tipo de seguro: <b>${solicitud.tiposeguro}</b></br>
                        Pais: <b>${solicitud.pais}</b> Código postal: <b>${solicitud.codigopostal}</b></br>
                        Celular: <b>${solicitud.celular}</b> Correo: <b>${solicitud.correo}</b>
                    </p>
                    <hr>
                    <h6>Beneficiarios</h6>
                    `;
                    let idSolicitud = solicitud.id;
                for(let a of asegurados){
                    if(a.idSolicitud==idSolicitud){
                        cadena += `
                        <p class="card-text">
                        Nombre: <b>${a.nombre}</b> Género: <b>${a.genero}</b></br>
                        Parentezco: <b>${a.parentezco}</b></br>
                        Fecha de nacimiento: <b>${a.fechanacimiento}</b> Ocupación: <b>${a.ocupacion}</b></br>
                        Practica deportes peligrosos:${a.practicadeportespeligrosos}
                    </p>
                        `;
                        console.log(a.nombre)
                    }
                }
                cadena += `</div>
            </div>
        </div>
            `;
            return cadena;
        }

    }
}
window.onload = () => new App(true);
