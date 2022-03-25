export function ValidaEmail(email){
  let respuesta = true;
  if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email) || email==''){
    respuesta = false;
  } else {
    respuesta = true;
  }
  return respuesta;
}

export function Edad(FechaNacimiento) {
  let fechaNace = new Date(FechaNacimiento);
  let fechaActual = new Date();

  let mes = fechaActual.getMonth();
  let dia = fechaActual.getDate();
  let año = fechaActual.getFullYear();

  fechaActual.setDate(dia);
  fechaActual.setMonth(mes);
  fechaActual.setFullYear(año);

  let edad = Math.floor(
    (fechaActual - fechaNace) / (1000 * 60 * 60 * 24) / 365
  );
  return edad;
}

export function FechaDMY(strFecha){
  let meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]
  let fecha = new Date(strFecha);
  let fechaConFormato = `${fecha.getDate()+1}-${meses[fecha.getMonth()]}-${fecha.getFullYear()}`;
  return fechaConFormato;

}
// function fechaDeHoy() {
//   let fechaActual = new Date();

//   let mes = (fechaActual.getMonth() + 1)<10 ? `0${fechaActual.getMonth() + 1}` : fechaActual.getMonth() + 1;
//   let dia = fechaActual.getDate()<10 ? `0${fechaActual.getDate()}` : fechaActual.getDate();
//   let año = fechaActual.getFullYear();

//   return año + "-" + mes + "-" + dia;
// }

// function horaActual(){
//   let fechaActual = new Date();
//   let hora = fechaActual.getHours()<10 ? `0${fechaActual.getHours()}` : fechaActual.getHours();
//   let minuto = fechaActual.getMinutes() < 10 ? `0${fechaActual.getMinutes()}` : fechaActual.getMinutes();
//   let segundos = fechaActual.getSeconds() < 10 ? `0${fechaActual.getSeconds()}` : fechaActual.getSeconds();
//   return `${hora}:${minuto}`;
// }

// function DiferenciaTiempo(FechaMasActualYMD, FechaPasadaYMD = Date()) {
//   // console.log(new Date(FechaPasada) + " " + new Date(FechaPasada).getUTCDate());
//   let fecha1 = new Date(FechaPasadaYMD);
//   let diaPasado = fecha1.getUTCDate() ;
//   let mesPasado = fecha1.getUTCMonth() + 1;
//   let añoPasado = fecha1.getUTCFullYear ();

//   let fecha2 = new Date(FechaMasActualYMD);
//   diaActual = fecha2.getUTCDate();
//   mesActual = fecha2.getUTCMonth();
//   añoActual = fecha2.getUTCFullYear();

//   // var fecha_pasada = new Date(parseInt(2020), parseInt(12), parseInt(4), 0, 0, 0, 0); //formamos la fecha pasada
//   var fecha_pasada = new Date(
//     parseInt(añoPasado),
//     parseInt(mesPasado),
//     parseInt(diaPasado),
//     0,
//     0,
//     0,
//     0
//   ); //formamos la fecha pasada
//   var fecha_futura = new Date(
//     parseInt(2020),
//     parseInt(12),
//     parseInt(10),
//     0,
//     0,
//     0,
//     0
//   ); //formamos la fecha futura

//   var total_dias = 0;
//   var total_meses = 0;
//   var total_anhos = 0;
//   var b = 0; //variable para finales de mes

//   if (fecha_pasada.getMonth() == 2) {
//     //mes de febrero
//     //if para saber si el año es bisiesto
//     if (
//       (fecha_futura.getYear() % 4 == 0 && fecha_futura.getYear() % 100 != 0) ||
//       fecha_futura.getYear() % 400 == 0
//     ) {
//       b = 29; //año bisiesto
//     } else {
//       b = 28; //año no bisiesto
//     }
//   } else if (fecha_pasada.getMonth() <= 7) {
//     //meses hasta julio
//     if (fecha_pasada.getMonth() == 0) {
//       b = 31;
//     } else if (fecha_pasada.getMonth() % 2 == 0) {
//       b = 30;
//     } else {
//       b = 31;
//     }
//   } else if (fecha_pasada.getMonth() > 7) {
//     //meses de Agosto a diciembre
//     if (fecha_pasada.getMonth() % 2 == 0) {
//       //si el més es divisible entre dos tiene 31 dias
//       b = 31;
//     } else {
//       b = 30;
//     }
//   }

//   //controlamos que la fecha de inicio no sea mayor que la fecha final
//   if (
//     fecha_pasada.getYear() > fecha_futura.getYear() ||
//     (fecha_pasada.getYear() == fecha_futura.getYear() &&
//       fecha_pasada.getMonth() > fecha_futura.getMonth) ||
//     (fecha_pasada.getYear() == fecha_futura.getYear() &&
//       fecha_pasada.getMonth() == fecha_futura.getMonth() &&
//       fecha_futura.getDate() == fecha_pasada.getDate())
//   ) {
//     // console.log("La fecha de inicio ha de ser anterior a la fecha Actual");
//     return "";
//   } else {
//     //si la fecha es correcta
//     if (fecha_pasada.getMonth() <= fecha_futura.getMonth()) {
//       total_anhos = fecha_futura.getYear() - fecha_pasada.getYear();
//       if (fecha_pasada.getDate() <= fecha_futura.getDate()) {
//         total_meses = fecha_futura.getMonth() - fecha_pasada.getMonth();
//         total_dias = fecha_futura.getDate() - fecha_pasada.getDate();
//       } else {
//         if (fecha_futura.getMonth() == fecha_pasada.getMonth()) {
//           total_anhos = total_anhos - 1;
//         }
//         total_meses =
//           (fecha_futura.getMonth() - fecha_pasada.getMonth() - 1 + 12) % 12;
//         total_dias = b - (fecha_pasada.getDate() - fecha_futura.getDate());
//       }
//     } else {
//       total_anhos = fecha_futura.getYear() - fecha_pasada.getYear() - 1;
//       if (fecha_pasada.getDate() > fecha_futura.getDate()) {
//         total_meses =
//           fecha_futura.getMonth() - fecha_pasada.getMonth() - 1 + 12;
//         total_dias = b - (fecha_pasada.getDate() - fecha_futura.getDate());
//       } else {
//         total_meses = fecha_futura.getMonth() - fecha_pasada.getMonth() + 12;
//         total_dias = fecha_futura.getDate() - fecha_pasada.getDate();
//       }
//     }

//     let txtAños = total_anhos == 0 ? "" : total_anhos + (total_anhos > 1 ? " años " : " año ");
//     let txtMeses = total_meses == 0 ? "" : total_meses + (total_meses > 1 ? " meses " : " mes ");
//     let txtDias = total_dias == 0 ? "" : total_dias + (total_dias > 1 ? " días " : " día ");
//     return " Hace " + txtAños + txtMeses + txtDias;
//   }
// }

// function Abrir_ventana(pagina) {
// 	var opciones="toolbar=no, location=no, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=yes, width=750, height=750, top=85, left=140";
// 	window.open(pagina,"",opciones);
// }