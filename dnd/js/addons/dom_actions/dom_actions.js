//variable para que los divs de los links no se repitan

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
		  
	dom_actions_menu();
});

function dom_actions()
{
	
	
}
//funcion para que el js sepa que hacer cuando dropea el cuadro de link del menu al stage
function file_actions_menu()
{
	
}

function file_asign_actions(div)
{
	$("#"+div)[0].addEventListener('dragstart', file_dragstart, false);	
	$("#"+div)[0].addEventListener('dragover', index_DragOver, false);
	$("#"+div)[0].addEventListener('dragleave', index_dragleave, false);
	$("#"+div)[0].addEventListener('drop', file_drop, false);
	$("#"+div)[0].addEventListener('dragend', index_DragEnd, false);
	$("#"+div)[0].addEventListener('mouseover', index_mouse_over, false);
	$("#"+div)[0].addEventListener('mouseout', index_mouse_out, false);
	$("#"+div).bind('click', index_click);
	//$("#"+div).bind('dblclick', file_dblclick);
	$("#"+div).bind('focusout', file_rename);
}
function folder_asign_actions(div)
{
	
}

  
  
function getAllDomEntries(dirReader, eldiv,lvl_) 
{	
  
  

  
}





 