//variable para que los divs de los links no se repitan
var file_count=0;
var fs_temp=null;
$(function() {
	
		//carga el menu del editor visual
		  if($("#controls")[0])
		  {
		  $.ajax({
		 		url: 'js/addons/file_actions/file_actions.html',
		 		type: 'get',
		 		data: {},
		 		dataType: "text",
		 		success: function(data) {		 			
		 			$("#controls").append(data);
		 			file_actions();
		 			//$("#controls_link").hide();
		 		}
		 	});//fin de ajax
		}
			//carga el boton para el menu del editor visual
		  if($("#ckmenu_container")[0])
		  {
		  	 $.ajax({
		  			url: 'js/addons/file_actions/file_actions_menu.html',
		  			type: 'get',
		  			data: {},
		  			dataType: "text",
		  			success: function(data) {		 			
		  				$("#ckmenu_container").append(data);
		  				
		  				//console.log($("#new_folder"));
		  				$("#new_folder")[0].addEventListener('dragstart', menu_file_dragStart, false);   
		  				$("#new_folder")[0].addEventListener('drop', menu_file_drop, false);
		  				$("#new_folder").attr("draggable",'true');

		  				$("#directories")[0].addEventListener('dragstart', directories_file_drag, false);
		  				$("#directories").attr("draggable",'false');
		  			}
		  		});//fin de ajax	
		  }
		  
	file_actions_menu();
});

function file_actions()
{
	$("#file_container_submit").bind("click",function(event){
		event.preventDefault();
		var ruta=$("#file_container_input").val();
		if(ruta!="/")
		create_directory(ruta);
		body_keyon();
	});
}
//funcion para que el js sepa que hacer cuando dropea el cuadro de link del menu al stage
function file_actions_menu()
{
	drop_actions["new_folder"]=new DropActions("new_folder",function(eldiv,event_){
		if(!eldiv.hasClass("file_folder"))
		{
			return false;
			event_.preventDefault();
			event_.stopPropagation();
		}
		/*eldiv.removeClass("selected");
		if(eldiv.hasClass("empty"))
		{
			eldiv.html('');
			eldiv.removeClass('empty');
		}*/
		file_create(event);
	});
}
function file_create(e)
{
	console.log("file_create");
	var laurl=$("#"+e.target.id).attr("laurl");
	console.log("crear una carpeta en "+laurl);
	$("#file_container_input").val(laurl);
	$("#file_container_input").focus();
	body_keyoff();
	show_file_popup();
	//$("#"+e.target.id).append("<a id='link_"+file_count+"' href='#' class='index_dragt ismenu_link columna4 relative empty block' draggable='true' style=''>link_"+link_count+" ...</div>");
	//file_asign_actions("file_"+file_count);
	//file_count++;
}
function file_asign_actions(div)
{
	$("#"+div)[0].addEventListener('dragstart', file_DragStart, false);	
	$("#"+div)[0].addEventListener('dragover', index_DragOver, false);
	$("#"+div)[0].addEventListener('dragleave', index_dragleave, false);
	$("#"+div)[0].addEventListener('drop', file_drop, false);
	$("#"+div)[0].addEventListener('dragend', index_DragEnd, false);
	$("#"+div)[0].addEventListener('mouseover', index_mouse_over, false);
	$("#"+div)[0].addEventListener('mouseout', index_mouse_out, false);
	$("#"+div).bind('click', index_click);
	$("#"+div).bind('dblclick', index_dblclick);
}
function file_drop(event)
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

function menu_file_dragStart(event)
{
	event.stopPropagation();	
	event.dataTransfer.setData('text', event.target.id);
	console.log("draaag file " +event.target.id);
}
function menu_file_drop(event)
{
	event.preventDefault();
	event.stopPropagation();		
}
function directories_file_drag(event)
{
	event.preventDefault();
	event.stopPropagation();		
}
function create_directory(nombre)
{
	window.webkitStorageInfo.requestQuota(PERSISTENT, 5*1024*1024, function(grantedBytes) {
	  window.requestFileSystem(PERSISTENT, grantedBytes, function(fs){
	  	fs.root.getDirectory(nombre, {create: true}, function(dirEntry) {
	  		controls_hide();
	  		load_files_fs(fs);

	  		}, errorHandler);
	  }, errorHandler);
	}, function(e) {
	  console.log('Error', e);
	});
	

}
function show_file_popup()
{
	controls_show();
}