
var cont=0;
var imagen_contador=0;

var target_actual=null;
var target_resizable=null;
var target_sortable=null;
var target_menu=null;
var target_margin=null;
var cssgrid=55;
var mousex=0;
var mousey=0;
var mouse_move_x=0;
var mouse_move_y=0;
var mouse_down=false;
var margin_primera=false;
var inicio=true;
var ruta_imagen_temporal=null;
var escribiendo=false;
var target_id_escribiendo=null;
var drop_actions=new Object();

//esta funcion-objeto es para poder asignar acciones desde otro js si se llegara a necesitar

var DropActions=function(idcode,action_)
 	{
 		this.idcode=idcode;//# tecla
 		this.eldiv=null;
 		this.event_=null;
 		this.action_=action_; 		
 	}

$(function() {
	
	drop_actions["div_element"]=new DropActions("div_element",function(eldiv,event_){
		eldiv.removeClass("selected");
		if(eldiv.hasClass("empty"))
		{
			eldiv.html('');
			eldiv.removeClass('empty');
		}
		crea_div(event_);
	});
	
	
	drop_actions["div_interno"]=new DropActions("div_element",function(eldiv,event_){
		eldiv.removeClass("selected");
		if(eldiv.hasClass("empty"))
		{
			eldiv.html('');
			eldiv.removeClass('empty');
		}
		event_.target.appendChild(document.getElementById(event_.dataTransfer.getData("elid")));
	});
	
	inicia();
	inicia_teclado();
	agrega_menu();
	
	
});
if (Modernizr.draganddrop) 
{
  // Browser supports HTML5 DnD.
  
} else {
  // Fallback to a library solution.
  
}
var keyStr = "ABCDEFGHIJKLMNOP" +
               "QRSTUVWXYZabcdef" +
               "ghijklmnopqrstuv" +
               "wxyz0123456789+/" +
               "=";

function menu_DragStart(event)
{
	event.stopPropagation();	
	event.dataTransfer.setData('text', event.target.id);
	console.log("draaag menu " +event.target.id);
}
function menu_Drop(event)
{
	event.preventDefault();
	event.stopPropagation();		
}
function index_DragStart(event)
{
	//event.preventDefault();
	console.log("draaag  " +event.target.id);
	event.dataTransfer.setData('text', "div_interno");
	event.dataTransfer.setData('elid', event.target.id);
}
function index_Drop(event)
{
	
	drop_generic(event);
}
function drop_generic(event)
{
	console.log("drop_generic");
	event.preventDefault();
	event.stopPropagation();
	var data=event.dataTransfer.getData("Text");
	var elid=event.dataTransfer.getData("elid");	
	var eldiv=$("#"+event.target.id);
	console.log(data);
	console.log(event.target.id);
	if(event.dataTransfer.getData("elid")==event.target.id)
	{
		console.log("es el mismo->");
		return false;
	}
	var files = event.dataTransfer.files;
	if(files.length>0)
	{
		var file=files[0];
		console.log(file);
		switch(file.type)
		{
			case "text/html":
			var reader = new FileReader();		 		
			reader.onload = handleReaderLoad_html;		 
			reader.readAsDataURL(file);
			break;
			case "image/jpeg":
			case "image/png":
			case "image/gif":
			window.webkitStorageInfo.requestQuota(PERSISTENT, 5*1024*1024, function(grantedBytes) {
			  window.requestFileSystem(PERSISTENT, grantedBytes, function(fs){div_importa_images(fs,file,eldiv,null)}, errorHandler);
			}, function(e) {
			  console.log('Error', e);
			});
			event.preventDefault();
			event.stopPropagation();
			return false;
			break;
		}
		
	}
	
	//ev.target.appendChild(document.getElementById(data));	
	if(drop_actions[data]!=null)
	{
		drop_actions[data].action_(eldiv,event);
	}
}
function index_DragOver(ev)
{
	ev.preventDefault();	
	$("#"+ev.target.id).addClass('selected');
	
}
function index_dragleave(ev)
{
	ev.preventDefault();
	
	$("#"+ev.target.id).removeClass('selected');
}
function index_DragEnd(ev)
{
	ev.preventDefault();
}
function index_mouse_over(event)
{
	event.preventDefault();
	event.stopPropagation();
	var target_id=$("#"+event.target.id);
	target_id.addClass("mouseover").addClass("selected");
	target_actual=target_id;
	
}
function index_mouse_out(e)
{
	e.preventDefault();
	e.stopPropagation();
	var target_id=$("#"+event.target.id);
	
	$("#"+e.target.id).removeClass("mouseover").removeClass("selected");

	if(target_id==target_actual)
		target_actual=null;
}
function index_mouse_down(event)
{
	//event.preventDefault();
	//event.stopPropagation();
	//console.log("click "+event.which);
	var target_id=$("#"+event.target.id);
	if(event.which==3)
	{		
		console.log("click "+event.which);
		target_menu=target_id;
		var str_clase=target_menu.attr('class');			
		var inicia=str_clase.indexOf("ismenu_");
		var fin=str_clase.indexOf(" ",inicia);
		muestra_clase=(str_clase.substring(inicia,fin)).replace("ismenu_","");
		console.log("muestra_clase->"+muestra_clase)
		controls_active=true;
		controls_show(muestra_clase);
	}
}
function index_click(event)
{
	event.preventDefault();
	event.stopPropagation();
	var target_id=$("#"+event.target.id);
		
	
	if(escribiendo && target_id_escribiendo.attr("id")!=event.target.id)
	{						
		target_id_escribiendo.attr("draggable","true");
		target_id_escribiendo.attr("contenteditable","false");
		body_keyon();
		escribiendo=false;
		
		if(target_id_escribiendo.parent().attr("draggable"))
		{
			target_id_escribiendo.parents().attr("draggable","true");
			//target_id_escribiendo.parent().attr("contenteditable","false");
		}				
		target_id_escribiendo=null;	
	}
	
}
function index_dblclick(event)
{
	event.preventDefault();
	var target_id=$("#"+event.target.id);
	//evita que reenombren el menu
	if(keyboard_input[67].active)
	{
		return false;
	}
	if(target_id.hasClass("mouseover"))
	{
		target_id.attr("draggable","false");
		target_id.attr("contenteditable","true");
		$("body").unbind("keyup");
		$("body").unbind("keydown");
		escribiendo=true;
		target_id_escribiendo=target_id;		
		
		if(target_id_escribiendo.parent().attr("draggable"))
		{
			target_id_escribiendo.parents().attr("draggable","false");			
		}
		target_id_escribiendo.focus();
	}	
}



function asigna_acciones(div)
{
	console.log("asigna "+div);	
	$("#"+div)[0].addEventListener('dragstart', index_DragStart, false);	
	$("#"+div)[0].addEventListener('dragover', index_DragOver, false);
	$("#"+div)[0].addEventListener('dragleave', index_dragleave, false);
	$("#"+div)[0].addEventListener('drop', index_Drop, false);
	$("#"+div)[0].addEventListener('dragend', index_DragEnd, false);
	$("#"+div)[0].addEventListener('mouseover', index_mouse_over, false);
	$("#"+div)[0].addEventListener('mouseout', index_mouse_out, false);
	$("#"+div)[0].addEventListener('mousedown', index_mouse_down, false);
	$("#"+div).bind('click', index_click);
	$("#"+div).bind('dblclick', index_dblclick);
	
}
function asigna_acciones_imagenes(div)
{
	console.log("asigna imagenes");
	$("#"+div)[0].addEventListener('dragstart', index_DragStart_img, false);
	
	$("#"+div)[0].addEventListener('dragover', index_DragOver, false);
	$("#"+div)[0].addEventListener('dragleave', index_dragleave, false);
	
	$("#"+div)[0].addEventListener('dragend', index_DragEnd, false);
	$("#"+div)[0].addEventListener('mouseover', index_mouse_over, false);
	$("#"+div)[0].addEventListener('mouseout', index_mouse_out, false);
	$("#"+div).bind('click', index_click);	
}

function crea_div(e)
{
	
	$("#"+e.target.id).append("<div id='div_"+cont+"' class='index_dragt ismenu_div columna4 relative empty' draggable='true' style=''>div_"+cont+" ...</div>");
	asigna_acciones("div_"+cont);
	cont++;
}

function inicia()
{
restart_keyboard_actions();
target_actual=null;
target_resizable=null;
target_sortable=null;
target_menu=null;

cssgrid=55;
mousex=0;
mousey=0;
mouse_move_x=0;
mouse_move_y=0;
mouse_down=false;
margin_primera=false;
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

$("body").attr("id",'body');
$("body").addClass('index_dragt');

$("div").each(function(){
	if(!$(this).hasClass("menu_div") && !$(this).hasClass("menu_link") && !$(this).hasClass("no_dragt"))
	$(this).addClass('index_dragt');
	$(this).attr("draggable",'true')
});

$(".index_dragt").each(function(){
	if($(this).attr("id")==undefined)
	{
		$(this).attr("id",'div_'+cont);
		cont++;
	}
 asigna_acciones($(this).attr("id"));
});

$(".menu_element").each(function(){
  this.addEventListener('dragstart', menu_DragStart);   
  this.addEventListener('drop', menu_DragStart);
});
 
$("body").bind('keydown', index_key_down);
$("body").bind('keyup', index_key_up);
$("body").bind("mousemove",function(event){
	mousex=event.pageX;
	mousey=event.pageY;
	if(assistant_active)
	{
		var left=(mousex+50);
		var top=(mousey+50);
		$("#assistant").css("top",top+"px");
		$("#assistant").css("left",left+"px");
	}
	if(tecla_m_presionada)
	{
		event.preventDefault();
		event.stopPropagation();
		if(mouse_down)
		{								
			var x = event.pageX;  
			var y = event.pageY;				 
			var distancia_x=x-mouse_move_x;
			var distancia_y=y-mouse_move_y;
			if(target_menu.hasClass("relative"))
			{
				if(!target_menu.hasClass("right"))
				{
					var margin_top=parseInt(target_menu.css("margin-top"));	
					var margin_left=parseInt(target_menu.css("margin-left"));
					target_menu.css("margin-top",(margin_top+distancia_y)+"px");
					target_menu.css("margin-left",(margin_left+distancia_x)+"px");
				}
				else
				{
					var margin_top=parseInt(target_menu.css("margin-top"));	
					var margin_left=parseInt(target_menu.css("margin-right"));
					target_menu.css("margin-top",(margin_top+distancia_y)+"px");
					target_menu.css("margin-right",(margin_left-distancia_x)+"px");
				}
				
			}
			else
			{
				if(target_margin.hasClass("absolute"))
				{
					if(!target_margin.hasClass("right"))
					{						
						var margin_top=parseInt(target_margin.css("top"));	
						var margin_left=parseInt(target_margin.css("left"));
						if(!$.isNumeric(margin_top)){margin_top=0;}
						if(!$.isNumeric(margin_left)){margin_left=0;}
						target_margin.css("top",(margin_top+distancia_y)+"px");
						target_margin.css("left",(margin_left+distancia_x)+"px");
						
					}
					else
					{
						var margin_top=parseInt(target_margin.css("top"));	
						var margin_left=parseInt(target_margin.css("right"));
						if(!$.isNumeric(margin_top)){margin_top=0;}
						if(!$.isNumeric(margin_left)){margin_left=0;}
						target_margin.css("top",(margin_top+distancia_y)+"px");
						target_margin.css("right",(margin_left-distancia_x)+"px");
						
					}
				}
			}			
			mouse_move_x=event.pageX;
			mouse_move_y=event.pageY;
		}
	}
});


}//fin de inicia



function body_restart()
{
	$("body").unbind("keyup");
	$("body").unbind("keydown");
	$("body").unbind("mousemove");
}


function handleReaderLoad_div(evt,eldiv) {
	console.log(evt);
  eldiv.css('background-url',evt.target.result);
  console.log(evt.target.result);
  //img.src = evt.target.result;
}
function handleReaderLoad_html(evt)
{
	var html=decode64(evt.target.result.replace("data:text/html;base64,",""));
	//var inicio_body=html.indexOf("<body>");
	//var fin_body=html.indexOf("</body>");
	//console.log("inicio="+inicio_body);
	//console.log("fin="+fin_body);
	//$("body").html(html.substring(inicio_body+6,fin_body));
	$("html").html(html);
	//$("html").html(html);
	if(!$("body").hasClass("index_dragt"))
	{
		$("body").addClass("index_dragt")
	}
	inicia();
}



function decode64(input) {
     var output = "";
     var chr1, chr2, chr3 = "";
     var enc1, enc2, enc3, enc4 = "";
     var i = 0;

     // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
     var base64test = /[^A-Za-z0-9\+\/\=]/g;
     if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
              "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
              "Expect errors in decoding.");
     }
     input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

     do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
           output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
           output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

     } while (i < input.length);

     return unescape(output);
  }

//***********************************************************************************files
//***********************************************************************************files
//***********************************************************************************files
//***********************************************************************************files
//***********************************************************************************files
//***********************************************************************************files
//***********************************************************************************files
//***********************************************************************************files
//***********************************************************************************files
function escribe_archivo(fs,nombre) {

  fs.root.getFile(nombre, {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      fileWriter.onwriteend = function(trunc) {
         fileWriter.onwriteend = null; // Avoid an infinite loop.
         // Create a new Blob and write it to log.txt.         
         var blob = new Blob([$("head").html()+"<11111111>"+$("body").html()]);
         //var blob = new Blob([$("html").html()]);
         //var blob2 = new Blob([]);
         fileWriter.write(blob);
         
         $("#controles_div").hide();
		 $("body").bind('keydown', index_key_down);
		 $("body").bind('keyup', index_key_up);
         $("body").focus();
         tecla_s_presionada=false;
       }
      
      fileWriter.seek(fileWriter.length); // Start write position at EOF.
  	  fileWriter.truncate(1);
      
      

    }, errorHandler);

  }, errorHandler);

}
function lee_archivo(fs,nombre)
{
	fs.root.getFile(nombre, {}, function(fileEntry) {

    // Get a File object representing the file,
    // then use FileReader to read its contents.
    fileEntry.file(function(file) {
       var reader = new FileReader();

       reader.onloadend = function(e) {
         //var txtArea = document.createElement('textarea');
         //txtArea.value = this.result;
         //document.body.appendChild(txtArea);
         $("html").html("");
         var lapos=this.result.indexOf("<11111111>");
         var elhead=this.result.substring(1,lapos);
         var elbody=this.result.substring(lapos+11);
         $("head").html(elhead);
         $("body").html(elbody);
         console.log("-----lapos----");
         console.log(lapos);
         console.log("-----head----");
         console.log(elhead);
         console.log("------elbody-----");
         console.log(elbody);
         body_restart();
         $("#controles_div").remove();
         $("#asistente").remove();
        cont=$("body").find('div[id^=div_]').length;
		console.log("contador ="+cont);
         //setTimeout(inicia,2000);
         inicia();
        $("#controles_div").hide();
        $("body").bind('keydown', index_key_down);
		$("body").bind('keyup', index_key_up);
        tecla_o_presionada=false;

         
       };

       reader.readAsText(file);
    }, errorHandler);

  }, errorHandler);
}
function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}
function div_importa_images(fs,file,eldivs,lafuncion) {
console.log("div_importa_images");
  fs.root.getFile(file.name, {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      fileWriter.onwriteend = function(trunc) {
         fileWriter.onwriteend = null; // Avoid an infinite loop.        
         fileWriter.write(file);
         console.log(eldivs);
         ruta_imagen_temporal=fileEntry.toURL();
         
        controls_show();
        
		target_menu=eldivs;
		console.log(fileEntry.toURL());
		if(lafuncion!=null)
		lafuncion(fileEntry.toURL());
       }
      
      fileWriter.seek(fileWriter.length); // Start write position at EOF.
  	  fileWriter.truncate(1);
      
      

    }, errorHandler);

  }, errorHandler);

}
function body_keyoff()
{
	$("body").unbind("keyup");
	$("body").unbind("keydown");	
}
function body_keyon()
{
	$("body").bind('keydown', index_key_down);
	$("body").bind('keyup', index_key_up);	
}