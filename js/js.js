//** variables del formulario **//
var formContainer = null;
var nota = 0.0;

var questionsText = [];
var answersText = [];

var questionsSelect = [];
var answersSelect = [];
var answersvalueSelect = [];

var questionsMultiple = [];
var answersMultiple = [];
var answersvalueMultiple = [];

var questionsCheckBox = [];
var answersCheckBox = [];
var answersvalueCheckBox = [];

var questionsRadio = [];
var answersRadio = [];
var answersvalueRadio = [];

//** Onload website **//
window.onload = function(){
  //CORREGIR al apretar el botón
  formContainer=document.getElementById('myform');
  formContainer.onsubmit=function(){
    inicializar();
    if (comprobar()){
      document.getElementById('myform').style.display="none";
      presentarNota();
      dibujarSeparador('solution');
      corregirText();
      corregirSelect();
      corregirSelectMultiple();
      corregirCheckBox();
      corregirRadio();
      actualizarNota();
    }
    return false;
  }
  var url = "https://rawgit.com/BenjaminBeth/Formulario/master/xml/questions.xml"
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      gestionarXml(this);
    }
  };
  xhttp.open("GET", url , true);
  xhttp.send();
}

// xmlDOC es el documento leido XML.

function gestionarXml(dadesXml){
  //Parse XML to xmlDoc
	var xmlDoc = dadesXml.responseXML;
	var tipo = "";
	var numeroCajaTexto = 0;
	for (i = 0; i<10; i++) {
		tipo = xmlDoc.getElementsByTagName("type")[i].innerHTML;
  		switch(tipo) {
        //imprimimos las preguntas y respuestas de las preguntas tipo test
        case "text":
          createdivQuest(i);
          imprimirTituloPregunta(i, xmlDoc);
          imprimirCajaText(numeroCajaTexto, xmlDoc);
          numeroCajaTexto++;
          questionsText.push(i);
          answersText.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
          break;
        //imprimimos las preguntas y respuestas de las preguntas tipo select
        case "select":
          createdivQuest(i);
          imprimirTituloPregunta(i, xmlDoc);
          imprimirOpcionesSelect(i, xmlDoc);
          questionsSelect.push(i);
          answersSelect.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
          //Bug de InnerHTML con el valor [i]
          //console.log(answersSelect[i]);
          // parche //
          if (answersSelect[i] == undefined) {
            answersSelect[i] = 0;
          }
          //--//
          answersvalueSelect.push(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("option")[answersSelect[i]].innerHTML);
          break;
        //imprimimos las preguntas y respuestas de las preguntas tipo Multiple
        case "multiple":
          createdivQuest(i);
          imprimirTituloPregunta(i, xmlDoc);
          imprimirSelectMultiple(i, xmlDoc);
          questionsMultiple.push(i);
          addAnswers(i, xmlDoc, answersMultiple, answersvalueMultiple);
          break;
        //imprimimos las preguntas y respuestas de las preguntas tipo checkbox
			  case "checkbox":
				  createdivQuest(i);
				  imprimirTituloPregunta(i, xmlDoc);
				  imprimirCheckBox(i, xmlDoc);
				  questionsCheckBox.push(i);
				  addAnswers(i, xmlDoc, answersCheckBox, answersvalueCheckBox);
				  break;
        //imprimimos las preguntas y respuestas de las preguntas tipo radio
			  case "radio":
				  createdivQuest(i);
				  imprimirTituloPregunta(i, xmlDoc);
				  imprimirRadioButton(i, xmlDoc);
				  questionsRadio.push(i);
				  addanswersRadio(i, xmlDoc, answersRadio, answersvalueRadio);
				  break;
		}
	}
	imprimirEspacios(3);
	imprimirBotonCorregir();
	imprimirEspacios(2);
}

//-- Agregamos títulos y las diversas opciones en el formulario. --//

function imprimirTituloPregunta(i, xmlDoc){
  var titlequestion = document.createElement("h3");
  titlequestion.innerHTML=xmlDoc.getElementsByTagName("title")[i].innerHTML;
  document.getElementById('pregunta'+i).appendChild(titlequestion);
}

function imprimirOpcionesSelect(i, xmlDoc) {
  var numOptions = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
  var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
  var select = document.createElement("select");
  select.id = "select"+i;
  document.getElementById('pregunta'+i).appendChild(select);
  for (j = 0; j < numOptions; j++) {
    var option = document.createElement("option");
    option.text = opt[j].innerHTML;
    option.value = j ;
    select.options.add(option);
  }
}

function imprimirCajaText(numeroCajaTexto, xmlDoc) {
  var cajaTexto = document.createElement("input");
  cajaTexto.type = "text";
  cajaTexto.id = "cajaTexto" + numeroCajaTexto;
  document.getElementById('pregunta'+i).appendChild(cajaTexto);
}


function imprimirCheckBox(i, xmlDoc) {
  var numOptions = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
  var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
  for (j = 0; j < numOptions; j++) {
    var label = document.createElement("label");
    var input = document.createElement("input");
    label.innerHTML=opt[j].innerHTML;
    input.type="checkbox";
    input.name="preg"+i;
    input.id="preg"+i+"ans"+j;
    document.getElementById('pregunta'+i).appendChild(input);
    document.getElementById('pregunta'+i).appendChild(label);
    document.getElementById('pregunta'+i).appendChild(document.createElement("br"));
  }
}

function imprimirRadioButton(i, xmlDoc) {
  var numOptions = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
  var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
  for (j = 0; j < numOptions; j++) {
    var input = document.createElement("input");
    var answersTitle = opt[j].innerHTML;
    var span = document.createElement("span");
    span.innerHTML = answersTitle;
    input.type="radio";
    input.name="preg"+i;
    input.id="preg"+i+"ans"+j;
    document.getElementById('pregunta'+i).appendChild(input);
    document.getElementById('pregunta'+i).appendChild(span);
    document.getElementById('pregunta'+i).appendChild(document.createElement("br"));
  }
}

function imprimirSelectMultiple(i, xmlDoc) {
  var numOptions = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
  var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
  var selectMultiple = document.createElement("select");
  selectMultiple.multiple="true";
  for (j = 0; j < numOptions; j++) {
    var answersTitle = opt[j].innerHTML;
    var option = document.createElement("option");
    option.innerHTML = answersTitle;
    selectMultiple.appendChild(option);
  }
  document.getElementById('pregunta'+i).appendChild(selectMultiple);
}

function imprimirEspacios(numeroEspacios) {
  for (i=0; i<numeroEspacios; i++) {
    var espacio = document.createElement("br");
    formContainer.appendChild(espacio);
  }
}

function imprimirBotonCorregir() {
  var botonCorregir = document.createElement("input");
  botonCorregir.id = "botonCorregir";
  botonCorregir.type = "submit";
  botonCorregir.value = "Corregir";
  formContainer.appendChild(botonCorregir);
}

//-- Funciones de Solucionar los diversos tipos de pregunta --//

function solutionText() {
	for (i = 0; i<questionsText.length; i++) {
		var input = document.getElementById("pregunta"+questionsText[i]).getElementsByTagName("input")[0];
		var answer = answersText[i];
		if (input.value == answer){
			puntos = 1;
			darRespuestaCorrectaHtml("P" +questionsText[i]+": Correcto", " +"+puntos+" punto");
			nota += puntos;
		}
		else {
			darRespuestaIncorrectaHtml("P" +questionsText[i] + ": Incorrecto");
			darRespuestaHtml("La respuesta correcta es: "+answersText[i]);
		}
		dibujarSeparador('solution');
	}
}
function solutionSelect() {
  for (i = 0; i<questionsSelect.length; i++) {
  	var sel = document.getElementById("pregunta"+questionsSelect[i]).getElementsByTagName("select")[0];
  	var answer = questionsSelect[i];
  	if (sel.selectedIndex==answer) {
  		puntos = 1;
  		darRespuestaCorrectaHtml("P" +questionsSelect[i]+": Correcto", " +"+puntos+" punto");
  		nota += puntos;
  	}
  	else {
  		darRespuestaIncorrectaHtml("P" +questionsSelect[i]+ ": Incorrecto");
  		darRespuestaHtml("La respuesta correcta es: "+answersvalueSelect[i]);
  	}
  	dibujarSeparador('solution');
  }
}
function solutionMultiple() {
	for (i = 0; i<questionsMultiple.length; i++) {
	  	var sel = document.getElementById("pregunta"+questionsMultiple[i]).getElementsByTagName("select")[0];
	  	var flag = 0;
	  	var error = false;
	  	for (j = 0; j < sel.length; j++){
	  		var encontrado = false;
		  	if (sel[j].selected) {
		  		flag = 1;
		  		for (k = 0; k < answersMultiple[i].length; k++){
		  			if(j == answersMultiple[i][k])	{
		  				puntos = 1.0/answersMultiple[i].length;
		  				nota += puntos;
		  				darRespuestaCorrectaHtml("P"+questionsMultiple[i]+" opcion "+j+": correcta", " +"+puntos.toFixed(2)+" puntos");
		  				encontrado = true;
		  				break;
		  			}
		  		}
		  		if (!encontrado){
		  			error = true;
		  			puntos = 1.0/answersMultiple[i].length;
		  			nota -= puntos;
		  			darRespuestaIncorrectaHtml("P"+questionsMultiple[i]+" opcion "+j+": incorrecta", " -"+puntos.toFixed(2)+" puntos");
		  		}
		  	}
	  	}
	  	if (error) {
	  		if (answersvalueMultiple[i].length == 1){
	  			darRespuestaHtml("La respuesta correcta es: " + answersvalueMultiple[i]);
	  		} else{
	  			darRespuestaHtml("Las respuestas correctas son: " + answersvalueMultiple[i].join(', '));
	  		}
	  	}
	  	if (flag == 0){
			darRespuestaHtml("P"+questionsMultiple[i]+": No has seleccionado ninguna respuesta");
		}
		dibujarSeparador('solution');
	}
}
function solutionCheckBox(){
	for (i = 0; i<questionsCheckBox.length; i++) {
		var inputs = document.getElementById("pregunta"+questionsCheckBox[i]).getElementsByTagName("input");
	 	var flag = 0;
	 	var error = false;
	  	for (j = 0; j < inputs.length; j++){
	  		var encontrado = false;
		  	if (inputs[j].checked) {
		  		flag = 1;
		  		for (k = 0; k < answersCheckBox[i].length; k++){
		  			if(j == answersCheckBox[i][k])	{
		  				puntos = 1.0/answersCheckBox[i].length;
		  				nota += puntos;
		  				darRespuestaCorrectaHtml("P"+questionsCheckBox[i]+" opcion "+j+": correcta", " +"+puntos.toFixed(2)+" puntos");
		  				encontrado = true;
		  				break;
		  			}
		  		}
		  		if (!encontrado){
		  			error = true;
		  			puntos = 1.0/answersCheckBox[i].length;
		  			nota -= puntos;
		  			darRespuestaIncorrectaHtml("P"+questionsCheckBox[i]+" opcion "+j+": incorrecta", " -"+puntos.toFixed(2)+" puntos");
		  		}
		  	}
	  	}
	  	if (error) {
	  		if (answersvalueCheckBox[i].length == 1){
	  			darRespuestaHtml("La respuesta correcta es: " + answersvalueCheckBox[i]);
	  		} else{
	  			darRespuestaHtml("Las respuestas correctas son: " + answersvalueCheckBox[i].join(', '));
	  		}
	  	}
	  	if (flag == 0){
			darRespuestaHtml("P"+questionsCheckBox[i]+": No has seleccionado ninguna respuesta");
		}
		dibujarSeparador('solution');
	}
}
function solutionRadio() {
	for (i = 0; i<questionsRadio.length; i++) {
		var questionsRadio = document.getElementById('pregunta'+questionsRadio[i]);
		var flag = 0;
		for (j = 0; j<preguntaRadio.getElementsByTagName('input').length; j++) {
			if (preguntaRadio.getElementsByTagName('input')[j].checked){
				flag = 1;
				if (j == answersRadio[i]){
					puntos = 1;
					nota += puntos;
		    		darRespuestaCorrectaHtml("P"+questionsRadio[i]+" opcion "+j+": correcta", " +"+puntos+" punto");
				} else{
					puntos = 1;
					nota -= puntos;
					darRespuestaIncorrectaHtml("P"+questionsRadio[i]+" opcion "+j+": incorrecta", " -"+puntos+" punto");
					darRespuestaHtml("La respuesta correcta es: "+answersvalueRadio[i]);
				}
			}
		}
		if (flag == 0){
			darRespuestaHtml("P"+questionsRadio[i]+": No has seleccionado ninguna respuesta");
		}
		dibujarSeparador('solution');
	}
}

//-- Funciones auxiliares y diversas utilidades --//

function addAnswers(i, xmlDoc, arrayAnswers, arrayvalueAnswers) {
	var answersQuestion = [];
	var answersvalueQuestion = [];
	for (j = 0; j < xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer").length; j++) {
		answersQuestion.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[j].innerHTML));
	}
	for (j = 0; j < answersQuestion.length; j++){
		answersvalueQuestion.push(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("option")[answersQuestion[j]].innerHTML);
	}
	arrayAnswers.push(answersQuestion);
	arrayvalueAnswers.push(answersvalueQuestion);
}

function addanswersRadio(i, xmlDoc, arrayAnswers, arrayvalueAnswers) {
	arrayAnswers.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
	arrayvalueAnswers.push(xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option')[arrayAnswers[arrayAnswers.length - 1]].innerHTML);
}

function createdivQuest(i) {
	var div = document.createElement('div');
	div.id = "pregunta"+i;
	formContainer.appendChild(div);
}

function inicializar(){
	document.getElementById('solution').innerHTML = "";
	nota=0.0;
}
function addcorrectionicon(valoracion) {
	if (valoracion=="v") {
		var icon = document.createElement("img");
		icon.src="img/correct.png";
		document.getElementById('solution').appendChild(icon);
	} else {
		var icon = document.createElement("img");
		icon.src="img/incorrect.png";
		document.getElementById('solution').appendChild(icon);
	}
}

function darRespuestaHtml(r){
	var p = document.createElement("span");
	var node = document.createTextNode(r);
	p.appendChild(node);
	var br = document.createElement("br");
	document.getElementById('solution').appendChild(p);
	document.getElementById('solution').appendChild(br);
}

function darRespuestaCorrectaHtml(r, puntuacion) {
	var p = document.createElement("span");
	var node = document.createTextNode(r);
	p.appendChild(node);

	var puntos = document.createElement("span");
	var puntosNode = document.createTextNode(puntuacion);
	puntos.appendChild(puntosNode);
	puntos.className = "correct";

  var icon = document.createElement("img");
  icon.src = "img/correct.png";


	var br = document.createElement("br");

	document.getElementById('solution').appendChild(p);
	document.getElementById('solution').appendChild(icon);
	document.getElementById('solution').appendChild(puntos);
	document.getElementById('solution').appendChild(br);
}

function darRespuestaIncorrectaHtml(r, puntuacion){
	var p = document.createElement("span");
	var node = document.createTextNode(r);
	p.appendChild(node);

	var puntos = document.createElement("span");
	var puntosNode = document.createTextNode(puntuacion);
	puntos.appendChild(puntosNode);
	puntos.className = "incorrect";

	var icon = document.createElement("img");
	icon.src = "img/incorrect.png";

	var br = document.createElement("br");

	document.getElementById('solution').appendChild(p);
	document.getElementById('solution').appendChild(icon);
	if (puntuacion != null) {
		document.getElementById('solution').appendChild(puntos);
	}
	document.getElementById('solution').appendChild(br);
}

function presentarNota(){
	var p = document.createElement("span");
	var node = document.createTextNode("");
	p.appendChild(node);
	p.id = "nota";
	var br = document.createElement("br");
	document.getElementById('solution').appendChild(p);
	document.getElementById('solution').appendChild(br);
}

function actualizarNota() {
	document.getElementById("nota").textContent="Nota: "+nota.toFixed(2)+" puntos sobre 10";
	if (nota >=5) {
		document.getElementById("nota").style.color = "#27b63a";
	}
}

function dibujarSeparador(divName) {
	var p = document.createElement("p");
	p.className = "separador";
	document.getElementById(divName).appendChild(p);
}

function comprobar(){
	for (i = 0; i < questionsText.length; i++){
		var input = document.getElementById("pregunta"+questionsText[i]).getElementsByTagName("input")[0];
		if (input.value=="") {
			input.focus();
			alert("Escribe un numero en la pregunta "+questionsText[i]);
			return false;
		}
	}
	return true;
}
