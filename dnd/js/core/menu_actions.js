var controls_active=false;
var assistant_active=false;
function agrega_menu()
{
	 $.ajax({
	 		url: PATH+'dnd/templates/menu.html',
	 		type: 'get',
	 		data: {},
	 		dataType: "text",
	 		success: function(data) {
	 			$("#controls").append(data);
	 			bind_menu_actions();
	 		}
	 	});//fin de ajax
	
	$("#controls").hide();

}
function bind_menu_actions()
{

	$("#controls_div_cerrar_btn").bind('click', function (e) {
		e.preventDefault();
		target_menu=null;
		controls_hide();
	});
	$("#controls_div_centrar_izquierda").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,align_types);
		target_menu.addClass("left");

	});// fin de live 
	$("#controls_div_centrar_centro").bind('click', function(e) {
		e.preventDefault();
		//console.log("clickkk");
		delete_properties(target_menu,align_types);
		target_menu.addClass("center");
		target_menu.css("margin-left","auto");
	});// fin de live 
	$("#controls_div_centrar_derecha").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,align_types);
		target_menu.addClass("right");
	});// fin de live
	$("#controls_div_clear_both").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,clear_types);
		target_menu.addClass("clear_both");
	});// fin de live 
	$("#controls_div_clear_none").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,clear_types);
		target_menu.addClass("clear_none");
	});// fin de live 

	$("#controls_div_save_save").bind('click', function(e) {
		e.preventDefault();
		var valor=$("#controls_div_save_input").val();
		if(valor.length>1)
		{
			window.webkitStorageInfo.requestQuota(PERSISTENT, 5*1024*1024, function(grantedBytes) {
			  window.requestFileSystem(PERSISTENT, grantedBytes, function(fs){escribe_archivo(fs,valor)}, errorHandler);
			}, function(e) {
			  console.log('Error', e);
			});
		}	
	});// fin de live
	$("#controls_div_save_open").bind('click', function(e) {
		e.preventDefault();
		var valor=$("#controls_div_save_input").val();
		if(valor.length>1)
		{
			window.requestFileSystem(PERSISTENT, 5*1024*1024, function(fs){lee_archivo(fs,valor)}, errorHandler);
		}
	  
	});
	$("#controls_div_rename_input").bind('focus',function(event){
		event.preventDefault();
		body_keyoff();
	});
	$("#controls_div_rename_input").bind('lostfocus',function(event){
		event.preventDefault();
		body_keyon();
	});
	$("#controls_div_rename_save").bind('click', function(e) {
		e.preventDefault();
		var valor=$("#controls_div_rename_input").val();
		if(valor.length>1)
		{
			target_menu.attr("id",valor);
			$("body").bind('keydown', index_key_down);
			$("body").bind('keyup', index_key_up);
			controls_hide();
		}
		if(target_menu.hasClass("empty"))
		{
			target_menu.html(valor);
		}
		tecla_r_presionada=false;	
	});// fin de live 
	$("#controls_div_rename_cancel").bind('click', function(e) {
		e.preventDefault();
		
			$("body").bind('keydown', index_key_down);
			$("body").bind('keyup', index_key_up);
			controls_hide();
			tecla_r_presionada=false;	
			
	});// fin de live 
	$("#controls_div_delete_save").bind('click', function(e) {
		e.preventDefault();	
			controls_hide();
			console.log("--------<");
			console.log(target_menu);
			console.log("--------<");
			target_menu.remove();
			target_menu=null;			
	});// fin de live 
	$("#controls_div_delete_cancel").bind('click', function(e) {
		e.preventDefault();	
			controls_hide();					
	});// fin de live 
	$("#controls_div_image_background").bind('click', function(e) {
		e.preventDefault();	
			controls_hide();
			console.log(target_menu.css("background-image"))
			
			eldiv=object_data.div_actual;
			ruta=object_data.ruta_imagen
			eldiv.css({"background-image":"url('"+ruta+"')"});
			eldiv.hide(100,function(){
				$(this).show();
			});
			if(eldiv.hasClass("empty")) eldiv.html("")
			target_menu=null;
			$("body").bind('keydown', index_key_down);
			$("body").bind('keyup', index_key_up);			
	});// fin de live 
	$("#controls_div_image_image").bind('click', function(e) {
		e.preventDefault();	
			controls_hide();
			eldiv=object_data.div_actual;
			ruta=object_data.ruta_imagen
			if(eldiv.hasClass("empty")) eldiv.html("")
			eldiv.append("<img id='img_"+imagen_contador+"' src='"+ruta+"' class='index_drag_img' />");
			eldiv.removeClass("empty");
			imagen_contador++;		
			target_menu=null;
			$("body").bind('keydown', index_key_down);
			$("body").bind('keyup', index_key_up);		
	});// fin de live 
	$("#controls_div_position_absolute").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,position_array);	
		target_menu.addClass("absolute");
		var margin_top=parseInt(target_menu.css("margin-top"));	
		var margin_left=parseInt(target_menu.css("margin-left"));
		if(!$.isNumeric(margin_top)){margin_top=0;}
		if(!$.isNumeric(margin_left)){margin_left=0;}
		target_menu.css("top",(margin_top)+"px");
		target_menu.css("left",(margin_left)+"px");
		target_menu.css("margin-top","0px");
		target_menu.css("margin-left","0px");
	});// fin de live 

	$("#controls_div_position_relative").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,position_array);
		target_menu.addClass("relative");
		var margin_top=parseInt(target_menu.css("top"));	
		var margin_left=parseInt(target_menu.css("left"));
		if(!$.isNumeric(margin_top)){margin_top=0;}
		if(!$.isNumeric(margin_left)){margin_left=0;}
		target_menu.css("margin-top",(margin_top)+"px");
		target_menu.css("margin-left",(margin_left)+"px");
		target_menu.css("top","0px");
		target_menu.css("left","0px");
	});//fin de live 

	$("#controls_div_overflow_hidden").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,overflow_array);
		target_menu.addClass("overflow_hidden");	
	});//fin de live 
	$("#controls_div_overflow_visible").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,overflow_array);
		target_menu.addClass("overflow_visible");	
	});//fin de live
	$("#controls_div_overflow_scroll").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,overflow_array);
		target_menu.addClass("overflow_scroll");	
	});//fin de live
	$("#controls_div_overflowx_hidden").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,overflow_array);
		target_menu.addClass("overflow_x_hidden");	
	});//fin de live
	$("#controls_div_overflowx_visible").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,overflow_array);
		target_menu.addClass("overflow_x_visible");	
	});//fin de live
	$("#controls_div_overflowx_scroll").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,overflow_array);
		target_menu.addClass("overflow_x_scroll");	
	});//fin de live
	$("#controls_div_overflowy_hidden").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,overflow_array);
		target_menu.addClass("overflow_y_hidden");	
	});//fin de live
	$("#controls_div_overflowy_visible").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,overflow_array);
		target_menu.addClass("overflow_y_visible");	
	});//fin de live
	$("#controls_div_overflowy_scroll").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,overflow_array);
		target_menu.addClass("overflow_y_scroll");	
	});//fin de live
	$("#controls_div_overflow_wrapnormal").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,overflow_array);
		target_menu.addClass("overflow_wrapnormal");	
	});//fin de live
	$("#controls_div_overflow_wraphyphenate").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,overflow_array);
		target_menu.addClass("wraphyphenate");	
	});//fin de live
	$("#controls_div_overflow_break_word").bind('click', function(e) {
		e.preventDefault();
		delete_properties(target_menu,overflow_array);
		target_menu.addClass("break_word");	
	});//fin de live
}
function assistant_show()
{
	$("#assistant").show();
}
function assistant_hide()
{
	$("#assistant").hide();
}

function assistant(content)
{
	$("#assistant").html(content);
}

function controls_show(tipo,element_to_show)
{
	console.log("tipo= "+tipo)
	if(tipo!=null)		
	{
		$(".controls_item").css("display","none");
		var array_menu=tipo.split(" ")
		for(var i=0;i<array_menu.length;i++)
		{			
			if(array_menu[i].indexOf("controls_")==0)
			{
				tipomenu=array_menu[i].replace("controls_","").trim();
				console.log(tipomenu);
				$(".controls_"+tipomenu).find(".section").css("display","none");
				$(".controls_"+tipomenu).css("display","block");		
			}
			
		}
		if(element_to_show!=null)
		$("#"+element_to_show).show();
		
		
	}
	else
	{
		$(".controls_item").show();
	}
	//var left=mousex-(parseInt($("#controls").css("width"))/2);
	var left=mousex;
	if(left>$(document).width())
	{
		left=left-parseInt($("#controls").css("width"));
	}
	if(left<0)
	{
		left=left+parseInt($("#controls").css("width"));
	}
	var top=mousey+15;
	if(top+parseInt($("#controls").css("height"))>$(document).height())
	{
		top=top-parseInt($("#controls").css("height"));
	}
	$("#controls").css("left",left+'px');
	$("#controls").css("top",top+'px');
	$("#controls").show();
}
function controls_hide()
{
	console.log("controls_hide");
	console.log(body_live_updates.length);
	if(body_live_updates.length>0)
	{
		for(var i=0;i<body_live_updates;i++)
		{
			console.log("funciona");
			body_live_updates[i]();
		}
	}
	$("#controls").hide();
}
