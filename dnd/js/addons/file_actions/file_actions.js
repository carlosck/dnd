//variable para que los divs de los links no se repitan
var file_count=0;
var fs_temp=null;
var zipWriter2=null;
//variable para editar nombre de archivo
var nombre_anterior="";
var elemento_arenombrar="";
var zip=null;
var menu_file=false;
var file_exist=false;
$(function() {
	//read_directory();
	//getAllFileEntries();
	
		//carga el menu del editor visual
		  if($("#controls")[0])
		  {
		  $.ajax({
		 		url: PATH+'dnd/js/addons/file_actions/file_actions.html',
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
		  			url: PATH+'/dnd/js/addons/file_actions/file_actions_menu.html',
		  			type: 'get',
		  			data: {},
		  			dataType: "text",
		  			success: function(data) {		 			
		  				if(!menu_file)
		  				{
		  					$("#ckmenu_container").append(data);
		  					menu_file=true;
		  				}
		  				
		  				
		  				$("#new_folder")[0].addEventListener('dragstart', menu_file_dragStart, false);   
		  				$("#new_folder")[0].addEventListener('drop', menu_file_drop, false);
		  				$("#new_folder").attr("draggable",'true');
		  				
		  				$("#directories").attr("draggable",'false');
		  				$("#directories")[0].addEventListener('drop', folder_drop, false);		  				
		  				$("#directories")[0].addEventListener('dragover', index_DragOver, false);
		  				$("#directories")[0].addEventListener('dragleave', index_dragleave, false);
		  						  				
		  				$("#directories")[0].addEventListener('mouseover', index_mouse_over, false);
		  				$("#directories")[0].addEventListener('mouseout', index_mouse_out, false);
		  				$("#export_files").bind("click",function(event){
		  					event.preventDefault();
		  					/*/
		  					zip.useWebWorkers = true;
		  					zip.workerScriptsPath = "";
		  					root_zip=new zip.fs.FS();
		  					zip.createWriter(new zip.BlobWriter("application/zip"), function(zipWriter) {
		  						zipWriter2=zipWriter;
			  					fs.root.getDirectory(PROYECT_NAME, {create: true}, function(dirEntry)
							    {
							  		var dirReader = dirEntry.createReader();
							  		
							  		console.log(root_zip);
							  		zipAllFileEntries(dirReader,zipWriter2,root_zip.root);
							  	}, errorHandler);
		  							  					
		  					}, errorHandler);
		  				//*/
		  				//export_files();
		  				zip = new JSZip();
		  				fs.root.getDirectory(PROYECT_NAME, {create: true}, function(dirEntry)
							    {
							  		var dirReader = dirEntry.createReader();
							  		
							  		//console.log(zip);
							  		zipAllFileEntries(dirReader,zip,null);
							  	}, errorHandler);
		  				});
		  				$("#export_close").bind("click",function(event)
		  				{
							event.preventDefault();
							close_zip(zip);
						});
						//zip.useWebWorkers = false;
		  			}
		  		});//fin de ajax	
		  }
		  
	file_actions_menu();
});

function file_actions()
{
	$("#file_container_submit").bind("click",function(event){
		event.preventDefault();
		var ruta=$("#file_container_input").attr("laurl")+$("#file_container_input").val();
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

	$("#file_folder_replace_yes").bind("click",function(event){
		event.preventDefault();
		fromurl=$(this).attr("fromurl")
		tourl=$(this).attr("tourl")
		file_move_fs(fromurl,tourl);
		controls_hide();
	});
	$("#file_folder_replace_no").bind("click",function(event){
		event.preventDefault();
		$(this).attr("fromurl","")
		$(this).attr("tourl","")		
		controls_hide();
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
	drop_actions["file_file"]=new DropActions("file_file",function(eldiv,event_)
	{
		if(event_.target.id==undefined || event_.target.id.length==0)
		{				
			event_.target.id="404"+parseInt(Math.random()*5000);
			eldiv=$("#"+event_.target.id).closest(".file_folder");		
		}
			var encontrado=false;
			
			var found=false;
			if(eldiv.hasClass("file_folder"))
			{
				console.log(event_);
				var data=event_.dataTransfer.getData("Text");
				var elid=event_.dataTransfer.getData("elid");	
				var folder_name=eldiv.attr("laurl");
				var folder_url_name=eldiv.attr("dirurl");

				var file_name=$("#"+event_.dataTransfer.getData("elid")).attr("laurl");
				var file_url_name=eldiv.attr("dirurl");
				console.log("mover archivo 1->"+file_name+" a"+folder_name);
				//filexist
				array_names=file_name.split("/");
				nombre=array_names[array_names.length-1]

				//nombre=file_name;
				// if(nombre.indexOf(PROYECT_NAME+"/")==1)
				// {	
				// 	nombre=nombre.replace(PROYECT_NAME+"/","")
				// }
				// nombre=nombre.trim();
				file_exist= false;
				if(folder_name=="/")
					folder_name="/"+PROYECT_NAME
				
				url=(folder_name+"/"+nombre).trim();
				console.log("url=->" +url);
				fs.root.getFile(url, {create: false, exclusive: false}, function(fileEntry) {				 
				  file_exist=true;
				  console.log("=========="+file_exist+"==========");
				  laurl=url
				  $("#file_folder_replace_yes").attr("fromurl",file_name);
				  $("#file_folder_replace_yes").attr("tourl",folder_name);
				  controls_show("controls_files_cont","file_folder_replace")
				 // console.log(fileEntry);
				  
				},function(){
					console.log("=====d====="+file_exist+"=====s=====");
					file_move_fs(file_name,folder_name);
				});
				

				//
				found=true;
				return false;
			}
			if(eldiv.hasClass("file_file"))
			{
				console.log(event_);
				var data=event_.dataTransfer.getData("Text");
				var elid=event_.dataTransfer.getData("elid");	
				var folder_name=$("#"+event_.target.id).parent().attr("laurl");
				var folder_url_name=$("#"+event_.target.id).parent().attr("dirurl");

				var file_name=$("#"+event_.dataTransfer.getData("elid")).attr("laurl");
				var file_url_name=eldiv.attr("dirurl");
				console.log("mover archivo "+file_name+" a"+folder_url_name);
				file_move_fs(file_name,folder_name);
				found=true;
				return false;
			}
			if(eldiv.hasClass("index_dragt"))
			{
				console.log("index_dragt");
				console.log(event_);
				
				var laurl=event_.dataTransfer.getData("Laurl");
				console.log(event_.dataTransfer.getData("Text"));
				console.log("|laurl|"+laurl+"|");

				
				switch(laurl.substring(laurl.indexOf(".")))
				{
				case ".jpg":
				case ".jpeg":
				case ".png":
						clases=eldiv.attr("class");
						console.log("clases ---->"+clases)

						ruta_imagen_temporal="filesystem:http://localhost/persistent"+laurl;
						target_menu=eldiv;
						console.log("este")
						//aqui uso este object global para poder accesar a el desde cualquier addon
						object_data.div_actual=eldiv
						object_data.ruta_imagen=ruta_imagen_temporal
						//despues muestro el menu que le corresponde a su tipo de objeto, link div slider
						controls_show(clases)
						// if(clases.indexOf("controls_link")!= -1)
						// {
						// 	$("#controls_div_image_background").attr("ruta",ruta_imagen_temporal);
						// 	$("#controls_div_image_image").attr("ruta",ruta_imagen_temporal);
						// 	controls_show(clases,"controls_link_background");
						// }							
						// else
						// {
						// 	$("#controls_link_background").attr("ruta",ruta_imagen_temporal);
						// 	$("#controls_link_rollover").attr("ruta",ruta_imagen_temporal);
						// 	controls_show(clases,"controls_div_image");
						// }
							
				break;
				case ".html":
				case ".php":
						if(eldiv.is("a"))
						{
							eldiv.attr("href",laurl);
						}
						if(eldiv.is("body"))
						{
							window.requestFileSystem(PERSISTENT, 5*1024*1024, function(fs){lee_archivo(fs,laurl.replace(PROYECT_NAME+"/",""))}, errorHandler);
						}
				}
				return false;
				
			}
			if(found)
			{
				return false;
				event_.preventDefault();
				event_.stopPropagation();
			}

			
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
		file_folder_move_fs(file_name,folder_name);
	});
}
function file_create(e)
{
	console.log("file_create");
	var laurl=$("#"+e.target.id).attr("laurl");
	if(laurl=="undefined")
	{
		return false
	}
	console.log("crear una carpeta en "+laurl);
	if(laurl!="/")
	{
		laurl+="/";
	}
	$("#file_container_input").attr("laurl",laurl);
	$("#file_container_input").val('');
	$("#file_container_input").focus();
	body_keyoff();
	controls_show("controls_files_cont","file_create_new");
	//$("#"+e.target.id).append("<a id='link_"+file_count+"' href='#' class='index_dragt ismenu_link columna4 relative empty block' draggable='true' style=''>link_"+link_count+" ...</div>");
	//file_asign_actions("file_"+file_count);
	//file_count++;
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
	$("#"+div)[0].addEventListener('dragstart', folder_dragstart, false);	
	$("#"+div)[0].addEventListener('dragover', index_DragOver, false);
	$("#"+div)[0].addEventListener('dragleave', index_dragleave, false);
	$("#"+div)[0].addEventListener('drop', folder_drop, false);
	$("#"+div)[0].addEventListener('dragend', index_DragEnd, false);
	$("#"+div)[0].addEventListener('mouseover', index_mouse_over, false);
	$("#"+div)[0].addEventListener('mouseout', index_mouse_out, false);
	$("#"+div).bind('click', index_click);
	$("#"+div).bind('focusout', folder_rename);
}
function file_drop(event)
{
	console.log("file_drop");
	console.log(event.target.id);
	if(event.target.id==undefined || event.target.id.length==0)
	{
		event.target=event.target.parentNode;
		return true;
	}
	
	
	
		event.preventDefault();
		event.stopPropagation();
		var data=event.dataTransfer.getData("Text");
		var elid=event.dataTransfer.getData("elid");	
		console.log("origin="+event.target.id);
		var eldiv=$("#"+event.target.id).parent();
		console.log("parent final->"+eldiv.attr("id"));
		
		
		
		console.log(eldiv);
		if(event.dataTransfer.getData("elid")==event.target.id)
		{
			console.log("es el mismo->");
			return false;
		}
		var files = event.dataTransfer.files;
		console.log("files.length="+files.length);
		if(files.length>0)
		{
			window.webkitStorageInfo.requestQuota(PERSISTENT, 5*1024*1024, function(grantedBytes) 
			{			
				window.requestFileSystem(PERSISTENT, grantedBytes, function(fs){folder_import_image(fs,files,eldiv,null)}, errorHandler);														
			}, function(e) {
					  console.log('Error', e);
					});				
			event.preventDefault();
			event.stopPropagation();
			return false;
				
		}
		
		//ev.target.appendChild(document.getElementById(data));	
		if(drop_actions[data]!=null)
		{
			drop_actions[data].action_(eldiv,event);
		}
}
function folder_drop(event)
{
	console.log("folder_drop");
	console.log(event);
	var data=event.dataTransfer.getData("Text");
	var elid=event.dataTransfer.getData("elid");	
	var eldom=event.target;
	var eldiv=$("#"+eldom.id);
	if(event.target.id==undefined || event.target.id.length==0)
	{				
		event.target.id="404"+parseInt(Math.random()*5000);
		eldiv=$("#"+event.target.id).closest(".file_folder");		
	}
	event.preventDefault();
	event.stopPropagation();
	
	var found=false;
	console.log("---------------");
	console.log(data);
	console.log(eldom.id);
	
	if(event.dataTransfer.getData("elid")==eldom.id)
	{
		console.log("es el mismo->");
		return false;
	}
	var files = event.dataTransfer.files;
	console.log("files.length="+files.length);
	if(files.length>0)
	{
		window.webkitStorageInfo.requestQuota(PERSISTENT, 5*1024*1024, function(grantedBytes) 
		{			
			window.requestFileSystem(PERSISTENT, grantedBytes, function(fs){folder_import_image(fs,files,eldiv,null)}, errorHandler);														
		}, function(e) {
				  console.log('Error', e);
				});				
		event.preventDefault();
		event.stopPropagation();
		return false;
		
	}
	
	//ev.target.appendChild(document.getElementById(data));	
	if(drop_actions[data]!=null)
	{
		drop_actions[data].action_(eldiv,event);
	}
}
function menu_file_dragStart(event)
{
	event.stopPropagation();	
	event.dataTransfer.setData('text', event.target.id);
	event.dataTransfer.setData('laurl', $("#"+event.target.id).attr("laurl"));
	console.log("laurl Start "+$("#"+event.target.id).attr("laurl"))
	console.log("draaag file " +event.target.id);
}
function file_dragstart(event)
{
	if(event.target.id==undefined || event.target.id.length==0)
	{				
		event.target.id="404"+parseInt(Math.random()*5000);
		eldiv=$("#"+event.target.id).closest(".file_file");	
		event.dataTransfer.setData('elid', eldiv.attr("id"));		
	}
	else
	{
		event.dataTransfer.setData('elid', event.target.id);
	}
	event.stopPropagation();	
	event.dataTransfer.setData('text', "file_file");	
	event.dataTransfer.setData('laurl', $("#"+event.target.id).attr("laurl"));
	console.log("laurl Start "+$("#"+event.target.id).attr("laurl"))
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
	console.log("creando directorio en "+PROYECT_NAME+"/"+nombre)
	console.log(nombre.indexOf(PROYECT_NAME+"/"))
	if(nombre.indexOf(PROYECT_NAME+"/")==1)
	{	
		nombre=nombre.replace(PROYECT_NAME+"/","")
	}
	nombre=nombre.trim();
	window.webkitStorageInfo.requestQuota(PERSISTENT, 5*1024*1024, function(grantedBytes) {
	  window.requestFileSystem(PERSISTENT, grantedBytes, function(fs){
	  	fs.root.getDirectory(PROYECT_NAME+"/"+nombre, {create: true}, function(dirEntry) {
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
	console.log("renombrar de "+original_+" a "+new_);
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
	  	console.log(fileEntry);
	  	
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
	controls_show("file_container");
}

function load_files_fs(fs)
{
    //console.log("load_files_fs");
    $("#directories").html(" ");
    fs.root.getDirectory(PROYECT_NAME, {create: true}, function(dirEntry)
    {
  		var dirReader = dirEntry.createReader();
  		getAllFileEntries(dirReader, $("#directories"),0);
  	}, errorHandler);
	
          
}
  
  
function getAllFileEntries(dirReader, eldiv,lvl_) 
{	
  
  dirReader.readEntries(function(entries)
  {
  	for (var i = 0, entry; entry = entries[i]; ++i) {
  	  if (entry.isDirectory) 
  	  {
  	 		var name=entry.name;
  	 		if($("#file_folder_"+entry.name).length>0)
  	 		{
  	 			name=entry.name+"_"+parseInt(Math.random()*1000);
  	 		}
  	 		
            cadena="<div id='file_folder_"+name+"' style='margin-left:"+(lvl_*20)+"px' class='columna5 file_folder controls_file_folder index_dragt' draggable='true' laurl='"+entry.fullPath+"' dirurl='"+entry.fullPath.replace(entry.name,"")+"'>";
            cadena+=  '<span >'+ entry.name+ '</span>';
          	cadena+="</div>";
          	//console.log(entry.name+" "+lvl_);
          	eldiv.append(cadena);
          	folder_asign_actions("file_folder_"+entry.name);
          	lvl_interno=lvl_+1;
  	    getAllFileEntries(entry.createReader(), $("#file_folder_"+name),lvl_interno);
  	    lvl_interno=lvl_-1;
  	  } 
  	  else 
  	  {
  	    var name=entry.name;
        var name_file=(entry.name).replace(".","_");
        if($("#file_file_"+name_file).length>0)
        {
        	name_file=name_file+"_"+parseInt(Math.random()*1000);
        }
        cadena="<div id='file_file_"+name_file+"' style='margin-left:"+(lvl_*20)+"px' class='columna5 file_file controls_file_file index_dragt' draggable='true' laurl='"+entry.fullPath+"' dirurl='"+entry.fullPath.replace(entry.name,"")+"'>";
        cadena+= '<span ><a href="'+entry.toURL()+'" target="_blank">'+ name+ '</a></span>';
        cadena+="</div>";
        eldiv.append(cadena);
        file_asign_actions("file_file_"+name_file);
  	    //console.log(entry.name +" "+lvl_);
  	  }
  	}	
  });

  
}
function folder_import_image(fs,files,eldivs,lafuncion) {
console.log("folder_import_image");
var files_loaded=0;
var laurl=eldivs.attr("laurl");
if(laurl.length>1)
{
	laurl=laurl+'/';
}
if(laurl.indexOf(PROYECT_NAME+"/")==1)
{	
	laurl=laurl.replace(PROYECT_NAME+"/","")
}
laurl=laurl.trim();
 for(var i=0;i<files.length;i++)
 {
 	
 	var file=files[i];
 	console.log("crear "+laurl+file.name);
  fs.root.getFile(PROYECT_NAME+laurl+file.name, {create: true}, function(fileEntry) {

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
         files_loaded++;
         console.log("files_loaded="+files_loaded);
       	if(files_loaded==files.length)
       	{
       		load_files_fs(fs);	
       	}
       	
       }
      
      fileWriter.seek(fileWriter.length); // Start write position at EOF.
  	  fileWriter.truncate(1);
      
      

    }, errorHandler);

  }, errorHandler);
}

}

function export_files() 
{	
  console.log("export_files");
  fs.root.getFile(PROYECT_NAME+"/index.html", {}, function(fileEntry) 
    {
  		
  		    fileEntry.file(function(file) {
  		       var reader = new FileReader();
  		       console.log(file);
  		       reader.onloadend = function(e) {
  		         //var txtArea = document.createElement('textarea');
  		         blobs = this.result;
  		         blob = new Blob([ blobs ], {
  		         	type : file.type
  		         });
  		         zip.createWriter(new zip.BlobWriter("application/zip"), function(zipWriter) {
  		             
  		             // use a BlobReader object to read the data stored into blob variable
  		             zipWriter.add("index.html", new zip.BlobReader(blob), function() {
  		               // close the writer and calls callback function
  		               zipWriter.close(function(blob) 
  		               {
						var blobURL= URL.createObjectURL(blob) ;
						console.log(blobURL);
						zipWriter = null;
						});
  		             });
  		           }, onerror);

  		         
  		       };

  		       reader.readAsText(file);
  		    }, errorHandler);

  		
  	}, errorHandler);

  
}
function zipAllFileEntries(dirReader,zipWriter,carpeta) 
{	
  
  dirReader.readEntries(function(entries)
  {
  	for (var i = 0, entry; entry = entries[i]; ++i) {
  		console.log(entry.name);
  	  if (entry.isDirectory) 
  	  {
  	 		console.log(entry.name);
  	 		//carpeta.addDirectory(entry.name);
  	 		/*/
  	 		zipWriter.add(entry.name,null,function(){
  	 		zipAllFileEntries(entry.createReader(),zipWriter ,carpeta);
  	 	},null,
  	 	{"directory":true} );
		//*/
		var folder = zipWriter.folder(entry.name);
  	 		zipAllFileEntries(entry.createReader(),folder ,null);
  	      	    
  	  } 
  	  else 
  	  {
  	      
  	      
  	      fs.root.getFile(entry.fullPath, {}, function(fileEntry) 
  	        {
  	      		console.log(fileEntry);
  	      		    fileEntry.file(function(file) {
  	      		       var reader = new FileReader();

  	      		       reader.onloadend = function(e) {
  	      		         //var txtArea = document.createElement('textarea');
  	      		         blobs = reader.result;
  	      		         var name=file.name;
  	      		         console.log(file.name);
  	      		         console.log(file.type);
  	      		         if(name.trim()=="index.html")
  	      		         {
							blobs=blobs.replace("filesystem:http://localhost/persistent/"+PROYECT_NAME,".")
							blobs="<html><head>"+blobs+"</body></html>";
							blobs.replace("document.write('<script src=\"dnd/js/core/menu_actions.js\"><\/script>');","")
							name="_index.html";
							console.log("el index");
  	      		         }
  	      		         
  	      		         
  	      		         blob = new Blob([blobs], {
  	      		         	type : file.type
  	      		         	//type : "text/plain"
  	      		         });

						 console.log("------");
  	      		         
  	      		         
  	      		         zipWriter.file(name, blobs,{base64: false, binary: true});
  	      		         //carpeta.addBlob(file.name, blob)
  	      		           	//*/      		             
  	      		             // use a BlobReader object to read the data stored into blob variable  	      		             
  	      		            // zipWriter.add(file.name, new zip.BlobReader(blob), function() {
  	      		               // close the writer and calls callback function
  	      		               
  	      		            // });
							//*/
  	      		           

  	      		         
  	      		       };

  	      		       reader.readAsBinaryString(file);
  	      		    }, errorHandler);

  	      		
  	      	}, errorHandler);

  	  }
  	}

  });
 
}//fin de la función

function close_zip(zipWriter)
{
	var blobLink = document.getElementById('export_download');
	  try {
	    blobLink.download = "hello.zip";
	    blobLink.href = window.URL.createObjectURL(zipWriter.generate({type:"blob"}));
	  } catch(e) {
	    blobLink.innerHTML += " (not supported on this browser)";
	  }
}




 