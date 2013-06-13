//variable para que los divs de los links no se repitan
var margin_left=0;
var cont_dom=0;
$(function() {
	//read_directory();
	//getAllFileEntries();
	
		//carga el menu del editor visual
		  if($("#controls")[0])
		  {
		  $.ajax({
		 		url: PATH+'dnd/js/addons/dom_actions/dom_actions.html',
		 		type: 'get',
		 		data: {},
		 		dataType: "text",
		 		success: function(data) {		 			
		 			$("#controls").append(data);
		 			dom_actions();
		 			//$("#controls_link").hide();
		 		}
		 	});//fin de ajax
		}
			//carga el boton para el menu del editor visual
		  if($("#ckmenu_container")[0])
		  {
		  	 $.ajax({
		  			url: PATH+'/dnd/js/addons/dom_actions/dom_actions_menu.html',
		  			type: 'get',
		  			data: {},
		  			dataType: "text",
		  			success: function(data) {		 			
		  				
		  			}
		  		});//fin de ajax	
		  }
		  body_live_updates.push(show_dom);
				
		  
		  
	dom_actions_menu();
	show_dom();

});

function dom_actions()
{
	
	
}
//funcion para que el js sepa que hacer cuando dropea el cuadro de link del menu al stage
function dom_actions_menu()
{
	
	drop_actions["dom_element"]=new DropActions("dom_element",function(eldiv,event_){
		console.log("dom_drag");
		eldiv.removeClass("selected");
		if(eldiv.hasClass("empty"))
		{
			eldiv.html('');
			eldiv.removeClass('empty');
		}
		var target_id=$("#"+event_.target.id.replace("dom_",""));
		console.log(event_.target);
		
		$(top.document).find("#editor_main").contents().find("#"+target_id).appendChild(document.getElementById(event_.dataTransfer.getData("elid")));
	});
	$("#reload_dom").bind("click",function(event){
		event.preventDefault();
		
		show_dom();
	});
	$("#dom_tree .domdragt").each(function()
	{
		dom_asign_actions($(this).attr("id"));
	});

}

function dom_asign_actions(div)
{
	//console.log(div);
	$("#"+div)[0].addEventListener('dragstart', dom_DragStart, false);	
	$("#"+div)[0].addEventListener('dragover', index_DragOver, false);
	$("#"+div)[0].addEventListener('dragleave', index_dragleave, false);
	$("#"+div)[0].addEventListener('drop', dom_Drop, false);
	$("#"+div)[0].addEventListener('dragend', index_DragEnd, false);
	$("#"+div)[0].addEventListener('mouseover', dom_mouse_over, false);
	$("#"+div)[0].addEventListener('mouseout', dom_mouse_out, false);
	$("#"+div)[0].addEventListener('mousedown', dom_mouse_down, false);
	$("#"+div).bind('click', index_click);
	//$("#"+div).bind('dblclick', file_dblclick);
	//$("#"+div).bind('focusout', file_rename);
}
function folder_asign_actions(div)
{
	
}

  
  
function show_dom() 
{	
  
  
  
 
  /*var parsehtml=$(top.document).find("#editor_main").contents().find("body");
  
  var kids=parsehtml.children();
  var elhtml="";
  for(var i=0;i<kids.length;i++)
  {
  	console.log(kids[i]);
  	//elhtml+="<div style='float:left;background-color:red'>"+kids[i].attr
  }*/
  var cadena=htmlTree();
  //console.log(cadena);
  $("#dom_tree").html(cadena);
	dom_actions_menu();
  
  
}


function htmlTree(obj){

    var obj = obj || $(top.document).find("#editor_main").contents().find("body")[0];
    var str ="";
    
    if(obj.id!="")
    {
    	str = "<div id='dom_"+obj.id+"' class='domdragt domleft"+margin_left+"' draggable='true'>" + obj.tagName;
    	str+="_"+obj.id;
    }
    else
    {
    	str = "<div id='dom_"+cont_dom+"' class='domdragt domleft"+margin_left+"' draggable='true'>" + obj.tagName;
    	cont_dom++;
    }
    	
    if (obj.hasChildNodes()) {
      var child = obj.firstChild;
      while (child) {
        if (child.nodeType === 1  && child.nodeName != 'SCRIPT') {
        	     	
        	switch(child.id)
        	{
        		case "controls":
        		break;
        		default:
				margin_left++;
        		str += htmlTree(child);
        		margin_left--;
        		break;
        	}
          

          
        }
        child = child.nextSibling;
      }
    }
    str += "</div>";
    return str;
  }
  //dom_tree.html(htmlTree());
  //document.write(htmlTree())

function dom_mouse_over(event)
{
	/*
	event.preventDefault();
	event.stopPropagation();
	var target_id=$("#"+event.target.id);
	target_id.addClass("mouseover").addClass("selected");
	target_padre=event.target.id.replace("dom_","");	
	//console.log(target_padre);
	//target_actual=target_id;
	target_actual=$(top.document).find("#editor_main").contents().find("#"+target_padre);
	target_menu=$(top.document).find("#editor_main").contents().find("#"+target_padre);
	console.log("-----------------------------------");
	console.log(target_menu);
	$(top.document).find("#editor_main").contents().find("#"+target_padre).addClass("mouseover").addClass("selected");
	*/
	var target_id=$("#"+event.target.id);
	target_id.addClass("mouseover").addClass("selected");
	event.target.id=event.target.id.replace("dom_","");
	//console.log($(top.document).find("#editor_main"));
	$(top.document).find("#editor_main")[0].contentWindow.index_mouse_over(event);
}	
function dom_mouse_out(event)
{
	/*e.preventDefault();
	e.stopPropagation();
	var target_id=$("#"+event.target.id);
	target_padre=event.target.id.replace("dom_","");
	$("#"+e.target.id).removeClass("mouseover").removeClass("selected");
	$(top.document).find("#editor_main").contents().find("#"+target_padre).removeClass("mouseover").removeClass("selected");
	if(target_id==target_actual)
		target_actual=null;
	*/
	//console.log(event);
	$("#"+event.target.id).removeClass("mouseover").removeClass("selected");
	event.target.id=event.target.id.replace("dom_","");	
	$(top.document).find("#editor_main")[0].contentWindow.index_mouse_out(event);
}
function dom_mouse_down(event)
{
	//event.preventDefault();
	//event.stopPropagation();
	//console.log("click "+event.which);
	/*
	var target_id=$("#"+event.target.id);
	if(event.which==3)
	{		
		console.log("click dom"+event.which);
		
		target_padre=event.target.id.replace("dom_","");
		target_menu=$(top.document).find("#editor_main").contents().find("#"+target_padre);
		var str_clase=target_menu.attr('class');			
		var inicia=str_clase.indexOf("ismenu_");
		var fin=str_clase.indexOf(" ",inicia);
		muestra_clase=(str_clase.substring(inicia,fin)).replace("ismenu_","");
		console.log("muestra_clase->"+muestra_clase)
		controls_active=true;
		console.log("------>");
		console.log(target_menu)
		console.log("------>");
		controls_show(muestra_clase);
		event.stopPropagation();
	}
	*/
	event.stopPropagation();
	event.target.id=event.target.id.replace("dom_","");	
	$(top.document).find("#editor_main")[0].contentWindow.index_mouse_down(event);
}
function dom_DragStart(event)
{
	//event.preventDefault();
	event.stopPropagation();
	console.log("draaag  dom" +event.target.id);
	event.dataTransfer.setData('text', "dom_element");
	event.dataTransfer.setData('elid', event.target.id);
}
function dom_Drop(event)
{
	//event.preventDefault();
	//event.stopPropagation();
	//console.log("click "+event.which);
	/*
	var target_id=$("#"+event.target.id);
	if(event.which==3)
	{		
		console.log("click dom"+event.which);
		
		target_padre=event.target.id.replace("dom_","");
		target_menu=$(top.document).find("#editor_main").contents().find("#"+target_padre);
		var str_clase=target_menu.attr('class');			
		var inicia=str_clase.indexOf("ismenu_");
		var fin=str_clase.indexOf(" ",inicia);
		muestra_clase=(str_clase.substring(inicia,fin)).replace("ismenu_","");
		console.log("muestra_clase->"+muestra_clase)
		controls_active=true;
		console.log("------>");
		console.log(target_menu)
		console.log("------>");
		controls_show(muestra_clase);
		event.stopPropagation();
	}
	*/
	event.stopPropagation();
	event.target.id=event.target.id.replace("dom_","");	
	console.log();
	$(top.document).find("#editor_main")[0].contentWindow.index_Drop(event);
}

 