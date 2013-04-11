//variable para que los divs de los links no se repitan
var file_count=0;
var fs_temp=null;

//variable para editar nombre de archivo
var nombre_anterior="";
var elemento_arenombrar="";
$(function() {
	//read_directory();
	//getAllFileEntries();
	
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
	$("#file_rename_yes").bind("click",function(event){
		event.preventDefault();
		if(elemento_arenombrar!=null)
		{
			file_rename_fs(elemento_arenombrar.attr("dirurl"),nombre_anterior,elemento_arenombrar.find("span a").html());			
		}
	});
	$("#file_rename_no").bind("click",function(event){
		event.preventDefault();
		controls_hide();
		  elemento_arenombrar=null;
	});
	$("#file_folder_rename_yes").bind("click",function(event){
		event.preventDefault();
		if(elemento_arenombrar!=null)
		{			
			file_folder_rename_fs(elemento_arenombrar.attr("dirurl"),nombre_anterior,elemento_arenombrar.find("span").html());			
		}
	});
	$("#file_folder_rename_no").bind("click",function(event){
		event.preventDefault();
		controls_hide();
		  elemento_arenombrar=null;
	});
	$("#file_folder_delete_yes").bind("click",function(event){
		event.preventDefault();
		console.log(target_menu);
		if(target_menu.hasClass("file_file"))
		{
			file_delete(target_menu);
			controls_hide();
		}
		else
		{
			if(target_menu.hasClass("file_folder"))
			{
				file_folder_delete(target_menu);
				controls_hide();
			}	
		}
	});
	$("#file_folder_rename_no").bind("click",function(event){
		event.preventDefault();
		controls_hide();

		  elemento_arenombrar=null;
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
	drop_actions["file_file"]=new DropActions("file_file",function(eldiv,event_){
		if(!eldiv.hasClass("file_folder"))
		{
			return false;
			event_.preventDefault();
			event_.stopPropagation();
		}
		console.log(event_);
		var data=event.dataTransfer.getData("Text");
		var elid=event.dataTransfer.getData("elid");	
		var folder_name=$("#"+event_.target.id).attr("laurl");
		var folder_url_name=$("#"+event_.target.id).attr("dirurl");

		var file_name=$("#"+event.dataTransfer.getData("elid")).attr("laurl");
		var file_url_name=eldiv.attr("dirurl");
		console.log("mover archivo "+file_name+" a"+folder_name);
		file_move_fs(file_name,folder_name);
	});
	drop_actions["file_folder"]=new DropActions("file_folder",function(eldiv,event_){
		if(!eldiv.hasClass("file_folder"))
		{
			return false;
			event_.preventDefault();
			event_.stopPropagation();
		}
		console.log(event_);
		var data=event.dataTransfer.getData("Text");
		var elid=event.dataTransfer.getData("elid");	
		var folder_name=$("#"+event_.target.id).attr("laurl");
		var folder_url_name=$("#"+event_.target.id).attr("dirurl");

		var file_name=$("#"+event.dataTransfer.getData("elid")).attr("laurl");
		var file_url_name=eldiv.attr("dirurl");
		console.log("mover fodler "+file_name+" a"+folder_name);
		file_folder_move_fs(file_name,folder_name);
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
	$("#"+div)[0].addEventListener('dragstart', file_dragstart, false);	
	$("#"+div)[0].addEventListener('dragover', index_DragOver, false);
	$("#"+div)[0].addEventListener('dragleave', index_dragleave, false);
	/*$("#"+div)[0].addEventListener('drop', file_drop, false);*/
	$("#"+div)[0].addEventListener('dragend', index_DragEnd, false);
	$("#"+div)[0].addEventListener('mouseover', index_mouse_over, false);
	$("#"+div)[0].addEventListener('mouseout', index_mouse_out, false);
	$("#"+div).bind('click', index_click);
	//$("#"+div).bind('dblclick', file_dblclick);
	$("#"+div).bind('focusout', file_rename);
}
function folder_asign_actions(div)
{
	$("#"+div)[0].addEventListener('dragstart', folder_dragstart, false);	
	$("#"+div)[0].addEventListener('dragover', index_DragOver, false);
	$("#"+div)[0].addEventListener('dragleave', index_dragleave, false);
	//$("#"+div)[0].addEventListener('drop', folder_drop, false);
	$("#"+div)[0].addEventListener('dragend', index_DragEnd, false);
	$("#"+div)[0].addEventListener('mouseover', index_mouse_over, false);
	$("#"+div)[0].addEventListener('mouseout', index_mouse_out, false);
	$("#"+div).bind('click', index_click);
	$("#"+div).bind('focusout', folder_rename);
}
function file_drop(event)
{
	
	var data=event.dataTransfer.getData("Text");
	var elid=event.dataTransfer.getData("elid");	
	var eldiv=$("#"+event.target.id);
	
	/*if(data.indexOf("http")!=-1)
	{						
		eldiv.attr("href",data);
		event.preventDefault();
		event.stopPropagation();
		return false;
	}*/
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
function file_dragstart(event)
{
	event.stopPropagation();	
	event.dataTransfer.setData('text', "file_file");	
	event.dataTransfer.setData('elid', event.target.id);
	console.log("draaag file " +event.target.id);
}

function folder_dragstart(event)
{
	event.stopPropagation();	
	event.dataTransfer.setData('text', "file_folder");	
	event.dataTransfer.setData('elid', event.target.id);
	console.log("drag folder " +event.target.id);
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
function file_rename(event)
{	
	nombre_anterior=$("#"+event.target.id).attr("laurl");
	elemento_arenombrar=$("#"+event.target.id);
	controls_show();	
}
function folder_rename(event)
{	
	nombre_anterior=$("#"+event.target.id).attr("laurl").replace($("#"+event.target.id).attr("dirurl"),"");
	nombre_anterior=$("#"+event.target.id).attr("laurl");
	elemento_arenombrar=$("#"+event.target.id);
	$("#file_folder_rename").show();
	controls_show();	
}
function file_rename_fs(pwd,original_,new_)
{
	console.log("renombrar de "+original_+" a "+new_);
	
	window.requestFileSystem(PERSISTENT, 50*1024*1024, function(fs){
		fs.root.getFile(original_, {}, function(fileEntry) {
			fs.root.getDirectory(pwd, {}, function(dirEntry2) {
	    fileEntry.moveTo(dirEntry2,new_);
	    }, errorHandler);	    
	    controls_hide();
	    elemento_arenombrar=null;
	  }, errorHandler);
	}, errorHandler);

}
function file_folder_rename_fs(pwd,original_,new_)
{	
	window.requestFileSystem(PERSISTENT, 50*1024*1024, function(fs){				
		fs.root.getDirectory(original_, {}, function(dirEntry) {
			fs.root.getDirectory(pwd, {}, function(dirEntry2) {
	    dirEntry.moveTo(dirEntry2,new_);
	    }, errorHandler);
	    controls_hide();
	    elemento_arenombrar=null;
	  }, errorHandler);
	}, errorHandler);
}

function file_move_fs(archivo,carpeta)
{
	carpeta=carpeta.replace("/","");
	carpeta=carpeta+"/";
	archivo=archivo.replace("/","");
	console.log("archivo  |"+archivo+"| carpeta |"+carpeta+"|");
	window.requestFileSystem(PERSISTENT, 50*1024*1024, function(fs) {
	  fs.root.getFile(archivo, {}, function(fileEntry) {

	      fs.root.getDirectory(carpeta, {}, function(dirEntry) {
	        fileEntry.moveTo(dirEntry);
	        load_files_fs(fs);
	      }, errorHandler);

	    }, errorHandler);
	}, errorHandler);
}
function file_folder_move_fs(archivo,carpeta)
{
	carpeta=carpeta.replace("/","");
	carpeta=carpeta+"/";
	archivo=archivo.replace("/","");
	
	window.requestFileSystem(PERSISTENT, 50*1024*1024, function(fs) {
	  fs.root.getDirectory(archivo, {}, function(dirEntry) {

	      fs.root.getDirectory(carpeta, {}, function(dirEntry_destino) {
	        dirEntry.moveTo(dirEntry_destino);
	        $("#directories").html("");	        
	        load_files_fs(fs)
	      }, errorHandler);
	    }, errorHandler);
	}, errorHandler);
}
function file_delete(eldiv)
{
	console.log(eldiv.attr("laurl"));
	window.requestFileSystem(PERSISTENT, 50*1024*1024, function(fs){				
		fs.root.getFile(eldiv.attr("laurl"), {}, function(fileEntry) {			
	    fileEntry.remove(function() {
      		load_files_fs(fs);
    }, errorHandler);    	    
	  }, errorHandler);
	}, errorHandler);
}
function file_folder_delete(eldiv)
{
	console.log(eldiv.attr("laurl"));
	window.requestFileSystem(PERSISTENT, 50*1024*1024, function(fs){				
		fs.root.getDirectory(eldiv.attr("laurl"), {}, function(dirEntry) {			
	    dirEntry.removeRecursively(function() {
      		load_files_fs(fs);
    }, errorHandler);    
	  }, errorHandler);
	}, errorHandler);

}
function show_file_popup()
{
	controls_show();
}

function load_files_fs(fs)
{
    //console.log("load_files_fs");
    $("#directories").html(" ");
    getAllFileEntries(fs.root.createReader(), $("#directories"),0);      
}
  
  
function getAllFileEntries(dirReader, eldiv,lvl_) 
{	
  
  dirReader.readEntries(function(entries)
  {
  	for (var i = 0, entry; entry = entries[i]; ++i) {
  	  if (entry.isDirectory) 
  	  {
  	 
            cadena="<div id='file_folder_"+entry.name+"' style='margin-left:"+(lvl_*20)+"px' class='columna5 file_folder index_dragt' draggable='true' laurl='"+entry.fullPath+"' dirurl='"+entry.fullPath.replace(entry.name,"")+"'>";
            cadena+=  '<span >'+ entry.name+ '</span>';
          	cadena+="</div>";
          	//console.log(entry.name+" "+lvl_);
          	eldiv.append(cadena);
          	folder_asign_actions("file_folder_"+entry.name);
          	lvl_interno=lvl_+1;
  	    getAllFileEntries(entry.createReader(), $("#file_folder_"+entry.name),lvl_interno);
  	    lvl_interno=lvl_-1;
  	  } 
  	  else 
  	  {
  	    var name=entry.name;
        var name_file=(entry.name).replace(".","_");
        
        cadena="<div id='file_file_"+name_file+"' style='margin-left:"+(lvl_*20)+"px' class='columna5 file_file index_dragt' draggable='true' laurl='"+entry.fullPath+"' dirurl='"+entry.fullPath.replace(entry.name,"")+"'>";
        cadena+= '<span ><a href="'+entry.toURL()+'" target="_blank">'+ name+ '</a></span>';
        cadena+="</div>";
        eldiv.append(cadena);
        file_asign_actions("file_file_"+name_file);
  	    //console.log(entry.name +" "+lvl_);
  	  }
  	}	
  });

  
}
 