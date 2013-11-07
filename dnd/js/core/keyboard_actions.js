var target_resizable=false;

var keyboard_input=new Object();

//esta funcion-objeto es para poder asignar acciones desde otro js si se llegara a necesitar
var Action_Keyboard=function(keycode,key_down,key_up,element)
 	{
 		this.keycode=keycode;//# tecla
 		this.active=false;
 		this.keydown_action=key_down;
 		this.keyup_action=key_up;
 		this.element=element;
 	}
function inicia_teclado()
{
	keyboard_input[17]=new Action_Keyboard(17,
	  	function(){		
		this.element=target_actual;
		this.active=true;
		assistant_active=true;
		assistant_show();
		assistant(target_actual.width()+" x "+target_actual.height());
		this.element.addClass("selected");
		this.element.resizable({resize: function( event, ui )
		{				
			assistant(ui.size.width+" x "+ui.size.height);
		}
			});
	},function()
		{									
				assistant_hide();
				assistant_active=false;
				this.element.removeClass("selected");
				this.element.resizable("destroy");			
				target_actual=null;
				this.element=null;
				this.active=false;
	},null);
	keyboard_input[18]=new Action_Keyboard(18,
	  	function(){				
	  		var that=this;//just for use it on resizeable because the inherit propblem
			this.element=target_actual;
			this.active=true;
			assistant_active=true;			
			assistant_show();
			var classes=target_actual.attr('class');			
			var strpos=classes.indexOf("columna")+7;			
			var columna=parseInt(classes.substring(strpos,strpos+2));
			assistant("columna"+columna+" x "+target_actual.height());
			this.element.addClass("selected");
			this.element.resizable({grid: cssgrid,handles: 'e',resize: function( event, ui )
			{
								
				var elspan=parseInt(ui.size.width/cssgrid)+1;
				assistant("columna"+elspan+" x "+ui.size.height);
				var classes=that.element.attr('class');				
				var strpos=classes.indexOf("columna")+7;				
				var columna=parseInt(classes.substring(strpos,strpos+2));
				that.element.removeClass('columna'+columna);				
				that.element.addClass("columna"+elspan);
				that.element.css("width",(elspan*cssgrid)+"px");
			},stop: function( event, ui )
			{								
				var elspan=parseInt(ui.size.width/cssgrid)+1;
				$("#asistente").html("columna"+elspan+" x "+ui.size.height);
				var classes=that.element.attr('class');				
				var strpos=classes.indexOf("columna")+7;				
				var columna=parseInt(classes.substring(strpos,strpos+2));
				that.element.removeClass('columna'+columna);				
				that.element.addClass("columna"+elspan);				
				that.element.css("width",(elspan*cssgrid)+"px");				
			}

				});
	},function()
		{									
				assistant_hide();
				assistant_active=false;
				this.element.removeClass("selected");
				this.element.resizable("destroy");			
				target_actual=null;
				this.element=null;
				this.active=false;
	},null)
keyboard_input[84]=new Action_Keyboard(84,
	function(){
	
			this.active=true;
			this.element=target_actual;
			assistant_active=true;
			assistant_show();									
			this.element.addClass("selected");
			this.element.sortable();
		},
		function(){			
			this.active=false;	
			assistant_active=false;		
			assistant_hide();
			this.element.removeClass("selected");
			console.log("unsortable");
			this.element.sortable("destroy");
			$(".ui-sortable").sortable("destroy");
			this.element=null;			
			
		},null);
//menu
keyboard_input[67]=new Action_Keyboard(67,
	function(){

			this.active=true;
			this.element=target_actual;
			target_menu=this.element;
			var str_clase=this.element.attr('class');			
			var inicia=str_clase.indexOf("ismenu_");
			var fin=str_clase.indexOf(" ",inicia);
			muestra_clase=(str_clase.substring(inicia,fin)).replace("ismenu_","");
			console.log("muestra_clase->"+muestra_clase)
			controls_active=true;
			controls_show(str_clase);
		},
		function(){			
			this.active=false;
			controls_active=false;			
			controls_hide();
			this.element.removeClass("selected");
			this.element=null;
			target_menu=null;		
			
		},null);

//r rename 
keyboard_input[82]=new Action_Keyboard(82,
	function(){

			this.active=true;
			this.element=target_actual;
			target_menu=this.element;
		$("body").unbind("keyup");
		$("body").unbind("keydown");
		controls_show();
		$("#controls_div_rename_input").focus();
			controls_active=true;
			
		},
		function(){			
			this.active=false;
			controls_active=false;			
			controls_hide();
			this.element.removeClass("selected");
			this.element=null;
			target_menu=null;		
			
		},null);

//o open 
keyboard_input[79]=new Action_Keyboard(79,
	function(){
					
			this.active=true;
			this.element=target_actual;
			target_menu=this.element;
		$("body").unbind("keyup");
		$("body").unbind("keydown");
		controls_show();
		$("#controls_div_save_input").focus();
			controls_active=true;			
		},
		function(){			

		},null);

//s save 
keyboard_input[83]=new Action_Keyboard(83,
	function(){
					
			this.active=true;
			this.element=target_actual;
			target_menu=this.element;
		$("body").unbind("keyup");
		$("body").unbind("keydown");
		controls_show();
		$("#controls_div_save_input").focus();
			controls_active=true;	
		},
		function(){			
		},null);
//m move 
keyboard_input[77]=new Action_Keyboard(77,
	function(){
								
			this.active=true;
			this.element=target_actual;
			target_menu=this.element;
			margin_primera=true;
			tecla_m_presionada=true;
			target_menu.attr("draggable",false);
			target_menu.bind("mousedown",function(ex){
				ex.preventDefault();
				ex.stopPropagation();
				console.log("bind");
				mouse_down=true;
				mouse_move_x=ex.pageX;
				mouse_move_y=ex.pageY;				
			});
			
			target_menu.bind("mouseup",function(ex){
				ex.preventDefault();
				ex.stopPropagation();
				mouse_down=false;				
				mouse_move_x=0;
				mouse_move_y=0;				
				console.log("unbind");				
			});			
	
		},
		function(){
			this.active=false;
		target_menu.unbind("mousedown");			
		target_menu.unbind("mouseup");
		mouse_move_x=0;
		mouse_move_y=0;
		mouse_down=false;							
		target_menu.removeClass("selected");
		target_menu.attr("draggable",true);
		target_menu=null;	
		tecla_m_presionada=false;			
		},null);


}
 		
			
function index_key_down(event)
{	
	event.preventDefault();	
	var keycode = (event.keyCode ? event.keyCode : event.which);
	console.log(keycode);	

	if(keyboard_input[keycode]!=undefined)
	{
		if(keyboard_input[keycode].active)
			return false;
		if(target_actual==null)
			return false;
		console.log("si clickea");
		keyboard_input[keycode].active=true;
		keyboard_input[keycode].keydown_action();
	}
	/*switch(keycode)
	{
		case 17://ctrl
		if(tecla_ctrl_presionada)
		{
			return false;
		}
		else
		{
			if(target_actual==null)
				return false;
			target_resizable=target_actual;
			tecla_ctrl_presionada=true;
			$("#asistente").show();			
			$("#asistente").css("top",mousey);
			$("#asistente").css("left",mousex);
			$("#asistente").html(target_actual.width()+" x "+target_actual.height());
			target_resizable.addClass("selected");
			target_resizable.resizable({resize: function( event, ui )
			{
				$("#asistente").css("top",event.pageY+25);
				$("#asistente").css("left",event.pageX+25);
				$("#asistente").html(ui.size.width+" x "+ui.size.height);
			}
				});

		}	
	break;
	case 18://alt	
		if(tecla_alt_presionada)
		{
			return false;
		}
		else
		{
			if(target_actual==null)
				return false;
			target_resizable=target_actual;
			tecla_alt_presionada=true;			
			$("#asistente").show();			
			$("#asistente").css("top",mousey);
			$("#asistente").css("left",mousex);
			var classes=target_actual.attr('class');			
			var strpos=classes.indexOf("columna")+7;			
			var columna=parseInt(classes.substring(strpos,strpos+2));
			$("#asistente").html("columna"+columna+" x "+target_actual.height());
			target_resizable.addClass("selected");
			target_resizable.resizable({grid: cssgrid,handles: 'e',resize: function( event, ui )
			{
				
				var elid=$("#"+event.target.id);
				$("#asistente").css("top",event.pageY+25);
				$("#asistente").css("left",event.pageX+25);
				var elspan=parseInt(ui.size.width/cssgrid)+1;
				$("#asistente").html("columna"+elspan+" x "+ui.size.height);
				var classes=elid.attr('class');				
				var strpos=classes.indexOf("columna")+7;				
				var columna=parseInt(classes.substring(strpos,strpos+2));
				elid.removeClass('columna'+columna);				
				elid.addClass("columna"+elspan);
				elid.css("width",(elspan*cssgrid)+"px");
			},stop: function( event, ui )
			{
				
				var elid=$("#"+event.target.id);
				$("#asistente").css("top",event.pageY+25);
				$("#asistente").css("left",event.pageX+25);
				var elspan=parseInt(ui.size.width/cssgrid)+1;
				$("#asistente").html("columna"+elspan+" x "+ui.size.height);
				var classes=elid.attr('class');				
				var strpos=classes.indexOf("columna")+7;				
				var columna=parseInt(classes.substring(strpos,strpos+2));
				elid.removeClass('columna'+columna);				
				elid.addClass("columna"+elspan);
				//elid.attr("width",0);
				elid.css("width",(elspan*cssgrid)+"px");
				console.log("width=",(elspan*cssgrid)+"px");
			}

				});

		}	
	break;
	case 84://t sort
	if(tecla_t_presionada)
		{
			return false;
		}
		else
		{
			if(target_actual==null)
				return false;
			tecla_t_presionada=true;
			target_sortable=target_actual;
			$("#asistente").show();			
			$("#asistente").css("top",mousey);
			$("#asistente").css("left",mousex);			
			$("#asistente").html("sortable= on");
			console.log("sortable");
			console.log(target_sortable.attr("id"));
			target_sortable.addClass("selected");
			target_sortable.sortable();

		}
	break;
	case 67://c centrar
	if(tecla_c_presionada)
		{
			return false;
		}
		else
		{
			if(target_actual==null)
				return false;
			tecla_c_presionada=true;
			target_menu=target_actual;
			//target_menu.addClass("selected");
			$("#controles_div").css("top",mousey);
			$("#controles_div").css("left",mousex);
			$("#controles_div").show();

		}
	break;
	case 77://v mover
	if(tecla_m_presionada)
		{
			return false;
		}
		else
		{
			if(target_actual==null)
				return false;
			tecla_m_presionada=true;
			target_margin=target_actual;
			margin_primera=true;
			target_margin.attr("draggable",false);
			target_margin.bind("mousedown",function(ex){
				ex.preventDefault();
				ex.stopPropagation();
				console.log("bind");
				mouse_down=true;
				mouse_move_x=ex.pageX;
				mouse_move_y=ex.pageY;
			});
			
			target_margin.bind("mouseup",function(ex){
				ex.preventDefault();
				ex.stopPropagation();
				mouse_down=false;				
				mouse_move_x=0;
				mouse_move_y=0;
				console.log("unbind");				
			});			

		}
	break;
	case 82://r rename
	if(tecla_r_presionada)
		{
			return false;
		}
		else
		{
			if(target_actual==null)
				return false;
			tecla_r_presionada=true;
			target_menu=target_actual;
			$("#controles_div").css("top",mousey);
			$("#controles_div").css("left",mousex);
			$("#controles_div").show();
			$("body").unbind("keyup");
			$("body").unbind("keydown");
			$("#controles_div_rename_input").focus();

		}
	break;
	case 83://s save
	if(tecla_s_presionada)
		{
			return false;
		}
		else
		{
			if(target_actual==null)
				return false;
			tecla_s_presionada=true;
			target_menu=target_actual;
			$("#controles_div").css("top",mousey);
			$("#controles_div").css("left",mousex);
			$("#controles_div").show();
			$("body").unbind("keyup");
			$("body").unbind("keydown");
			$("#controles_div_save_input").focus();

		}
	break;
	case 79://o open
	if(tecla_o_presionada)
		{
			return false;
		}
		else
		{
			if(target_actual==null)
				return false;
			tecla_o_presionada=true;
			target_menu=target_actual;
			$("#controles_div").css("top",mousey);
			$("#controles_div").css("left",mousex);
			$("#controles_div").show();
			$("body").unbind("keyup");
			$("body").unbind("keydown");
			$("#controles_div_save_input").focus();

		}
	break;
	case 88://x delete
	if(tecla_x_presionada)
		{
			return false;
		}
		else
		{
			if(target_actual==null)
				return false;
			tecla_x_presionada=true;
			target_menu=target_actual;
			$("#controles_div").css("top",mousey);
			$("#controles_div").css("left",mousex);
			$("#controles_div").show();						
		}
	break;			
	case 80://p position
	if(tecla_p_presionada)
		{
			return false;
		}
		else
		{
			if(target_actual==null)
				return false;
			tecla_p_presionada=true;
			target_menu=target_actual;
			target_margin=target_actual;
			$("#controles_div").css("top",mousey);
			$("#controles_div").css("left",mousex);
			$("#controles_div").show();						
		}
	break;
		
	}*/	
}
function index_key_up(event)
{
	
	var keycode = (event.keyCode ? event.keyCode : event.which);
	tecla_ctrl_presionada=false;
	if(keyboard_input[keycode]!=undefined)
	{
		keyboard_input[keycode].keyup_action();
	}
	/*

	if(keyboard_input[keycode]!=undefined)
	{
		if(keyboard_input[keycode].active)
			return false;
		if(target_actual==null)
			return false;
		console.log("si clickea");
		keyboard_input[keycode].active=true;
		keyboard_input[keycode].keydown_action;
	}
/*
	switch(keycode)
	{
	case 17://ctrl resize
	event.preventDefault();
	event.stopPropagation();
		tecla_ctrl_presionada=false;
		if(target_actual!=null)
		{			
			$("#asistente").hide();
			target_resizable.removeClass("selected");
			target_resizable.resizable("destroy");			
			target_actual=null;
			target_resizable=null;
		}
	break;
	case 18://alt resize on grid
	event.preventDefault();
	event.stopPropagation();
		tecla_alt_presionada=false;
		if(target_actual!=null)
		{
			$("#asistente").hide();
			target_resizable.removeClass("selected");
			target_resizable.resizable("destroy");
			target_actual=null;
			target_resizable=null;			
		}
	break;
	case 84://t sortear
	event.preventDefault();
	event.stopPropagation();
		tecla_t_presionada=false;
		if(target_sortable!=null)
		{
			$("#asistente").hide();
			target_sortable.removeClass("selected");
			console.log("unsortable");
			target_sortable.sortable("destroy");
			$(".ui-sortable").sortable("destroy");
			target_sortable=null;			
		}
	break;
	case 67://c centrar
	event.preventDefault();
	event.stopPropagation();
		tecla_c_presionada=false;
		if(target_actual!=null)
		{
			$("#controles_div").hide();
			target_menu.removeClass("selected");
			target_menu=null;
		}
	break;
	case 77://m cc
	event.preventDefault();
	event.stopPropagation();
		tecla_m_presionada=false;
		if(target_actual!=null)
		{
			target_margin.unbind("mousedown");			
			target_margin.unbind("mouseup");
			mouse_move_x=0;
			mouse_move_y=0;
			mouse_down=false;							
			target_margin.removeClass("selected");
			target_margin.attr("draggable",true);
			target_margin=null;
		}
	break;	
	case 88://x delete
	event.preventDefault();
	event.stopPropagation();
		tecla_x_presionada=false;
		if(target_actual!=null)
		{												
			$("#controles_div").hide();
			target_menu=null;
		}
	break;
	case 80://p position
	event.preventDefault();
	event.stopPropagation();
		tecla_p_presionada=false;
		if(target_actual!=null)
		{												
			$("#controles_div").hide();
			target_menu=null;
			target_margin=null;
		}
	break;
	}*/
}
function restart_keyboard_actions()
{
	tecla_ctrl_presionada=false;
	tecla_alt_presionada=false;
	tecla_s_presionada=false;
	tecla_c_presionada=false;
	tecla_m_presionada=false;
	tecla_r_presionada=false;
	tecla_x_presionada=false;
}

