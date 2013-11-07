//variable para que los divs de los links no se repitan
var link_count=0;
$(function() {
	
		//carga el menu del editor visual
		  if($("#controls")[0])
		  {
		  $.ajax({
		 		url: PATH+'dnd/js/addons/link_actions/link_actions.html',
		 		type: 'get',
		 		data: {},
		 		dataType: "text",
		 		success: function(data) {		 			
		 			$("#controls").append(data);
		 			link_actions();
		 			$("#controls_link").hide();
		 		}
		 	});//fin de ajax
		}
			//carga el boton para el menu del editor visual
		  if($("#ckmenu_container")[0])
		  {
		  	 $.ajax({
		  			url: PATH+'dnd/js/addons/link_actions/link_actions_menu.html',
		  			type: 'get',
		  			data: {},
		  			dataType: "text",
		  			success: function(data) {		 			
		  				$("#ckmenu_container").append(data);
		  				
		  				console.log($("#link_element"));
		  				$("#link_element")[0].addEventListener('dragstart', menu_DragStart, false);   
		  				$("#link_element")[0].addEventListener('drop', menu_DragStart, false);
		  			}
		  		});//fin de ajax	
		  }
		  
	link_actions_menu();
});

function link_actions()
{
	$("#controls_link_cancel").bind('click', function(e) {
		e.preventDefault();
		controls_hide();
		target_menu=null;	
	});//fin de live

	$("#controls_link_save").bind('click', function(e) {
		e.preventDefault();
		var valor=$("#controls_link_input").val();
		target_menu.attr("href",valor);	
		controls_hide();
		target_menu=null;
	});//fin de live
	$("#controls_link_target_change").bind('click', function(e) {
		e.preventDefault();
		var valor=$("#controls_link_target_input").val();
		target_menu.attr("target",valor);	
		controls_hide();
		target_menu=null;
	});//fin de live
	$("#controls_link_target_self").bind('click', function(e) {
		e.preventDefault();
		controls_hide();
		target_menu.attr("target","_self");
		target_menu=null;	
	});//fin de live
	$("#controls_link_target_blank").bind('click', function(e) {
		e.preventDefault();
		controls_hide();
		target_menu.attr("target","_blank");
		target_menu=null;	
	});//fin de live

	$("#controls_link_target_blank").bind('click', function(e) {
		e.preventDefault();
		controls_hide();
		target_menu.css({"background-image":"url('"+ruta_imagen_temporal+"')"});
		target_menu.hide(100,function(){
			$(this).show();
		});
		target_menu=null;	
	});//fin de live
	$("#controls_link_background").bind('click', function(e) {
		e.preventDefault();
		controls_hide();
		console.log(target_menu.css("background-image"))
		if(target_menu.css("background-image")!="none")
		{
			eldiv=target_menu;
			ruta=object_data.ruta_imagen
			ruta_imagen_temporal=target_menu.css("background-image");
			eldiv=target_menu.css("background-image")
			var pos_inicial=ruta.indexOf("(")+1;
			var pos_final=ruta.indexOf(")");
			ruta=ruta.substring(pos_inicial,pos_final);
			eldiv.css({"background-image":"url('"+ruta+"')"});
			eldiv.removeClass("roll_over");
		}
		else
		{
			eldiv.css({"background-image":"url('"+ruta+"')"});	
		}
		
		console.log(eldiv);
		console.log(ruta);
		eldiv.hide(100,function(){
			$(this).show();
		});
		
		controls_hide();	
	});//fin de live
	$("#controls_link_rollover").bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		controls_hide();
		console.log("------------------------")
		console.log(target_menu.css("background-image"))
		target_menu.html("");
		if(target_menu.css("background-image")!="none")
		{
			ruta_imagen_temporal=target_menu.css("background-image");
			var pos_inicial=ruta_imagen_temporal.indexOf("(")+1;
			var pos_final=ruta_imagen_temporal.indexOf(")");
			ruta_imagen_temporal=ruta_imagen_temporal.substring(pos_inicial,pos_final);
			
			target_menu.css({"background-image":"url('"+ruta_imagen_temporal+"')"});
			target_menu.addClass("roll_over");
		}
		else
		{
			eldiv=object_data.div_actual;
			ruta=object_data.ruta_imagen
			eldiv.css({"background-image":"url('"+ruta+"')"});
			eldiv.addClass("roll_over");	
		}
		
		
		
		var width=0;
		var height=0;
		var img=new Image();
		img.onload=function()
		{
			console.log("oimagen cargada" +this.width+" "+this.height);
			var width=this.width;
			var height=this.height;
			eldiv.css("width",width+"px");			
			eldiv.css("height",parseInt((height/2))+"px");
			eldiv.hide(100,function(){
				$(this).show();
			});
			
			console.log(eldiv.css("width"));			
			console.log(eldiv.css("height"));
			
			target_menu=null;
			/*target_menu_local.hover(function(){
			$(this).css({"background-position":"bottom"});
			console.log("hover")			;
			})*/
			target_menu=null;
			target_menu_local=null;
		}
		img.src=ruta;
		
			
	});//fin de live
}
//funcion para que el js sepa que hacer cuando dropea el cuadro de link del menu al stage
function link_actions_menu()
{
	drop_actions["link_element"]=new DropActions("link_element",function(eldiv,event_){
		eldiv.removeClass("selected");
		if(eldiv.hasClass("empty"))
		{
			eldiv.html('');
			eldiv.removeClass('empty');
		}
		crea_link(event);
	});
}
function crea_link(e)
{
	
	$("#"+e.target.id).append("<a id='link_"+link_count+"' href='#' class='index_dragt controls_div controls_link columna4 relative empty block' draggable='true' style=''>link_"+link_count+" ...</div>");
	link_asign_actions("link_"+link_count);
	link_count++;
}
function link_asign_actions(div)
{
	$("#"+div)[0].addEventListener('dragstart', index_DragStart, false);	
	$("#"+div)[0].addEventListener('dragover', index_DragOver, false);
	$("#"+div)[0].addEventListener('dragleave', index_dragleave, false);
	$("#"+div)[0].addEventListener('drop', link_drop, false);
	$("#"+div)[0].addEventListener('dragend', index_DragEnd, false);
	$("#"+div)[0].addEventListener('mouseover', index_mouse_over, false);
	$("#"+div)[0].addEventListener('mouseout', index_mouse_out, false);
	$("#"+div).bind('click', index_click);
	$("#"+div).bind('dblclick', index_dblclick);
}
function link_drop(event)
{
	
	var data=event.dataTransfer.getData("Text");
	var elid=event.dataTransfer.getData("elid");	
	var eldiv=$("#"+event.target.id);
	
	if(data.indexOf("http")!=-1)
	{						
		eldiv.attr("href",data);
		event.preventDefault();
		event.stopPropagation();
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
	drop_generic(event);
}
