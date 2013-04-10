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
	$("#file_rename_yes").bind("click",function(event){
		event.preventDefault();
		if(elemento_arenombrar!=null)
		{
			file_rename_fs(nombre_anterior,elemento_arenombrar.find("span").html());			
		}
	});
	$("#file_rename_no").bind("click",function(event){
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
	$("#"+div)[0].addEventListener('dragstart', folder_drags|tart, false);	
	$("#"+div)[0].addEventListener('dragover', index_DragOver, false);
	$("#"+div)[0].addEventListener('dragleave', index_dragleave, false);
	$("#"+div)[0].addEventListener('drop', folder_drop, false);
	$("#"+div)[0].addEventListener('dragend', index_DragEnd, false);
	$("#"+div)[0].addEventListener('mouseover', index_mouse_over, false);
	$("#"+div)[0].addEventListener('mouseout', index_mouse_out, false);
	$("#"+div).bind('click', index_click);
	$("#"+div).bind('dblclick', folder_dblclick);
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
function file_rename(event)
{	
	nombre_anterior=$("#"+event.target.id).attr("laurl");
	elemento_arenombrar=$("#"+event.target.id);
	controls_show();	
}
function file_rename_fs(original_,new_)
{
	//original_=original_.replace("/","");
	//new_=new_.replace("/","");
	console.log("reenmobrar de "+original_+" a "+new_);
	
	window.requestFileSystem(PERSISTENT, 50*1024*1024, function(fs){
		fs.root.getFile(original_, {}, function(fileEntry) {
	    fileEntry.moveTo(fs.root, new_);
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
	archivo="song.mp3";
	carpeta="/foldercuatro";
	window.requestFileSystem(PERSISTENT, 50*1024*1024, function(fs) {
	  fs.root.getFile(archivo, {}, function(fileEntry) {

	      fs.root.getDirectory(carpeta, {}, function(dirEntry) {
	        fileEntry.moveTo(dirEntry);
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
      getAllFileEntries(fs.root.createReader(), $("#directories"),0);
      /*filelist=$("#directories");
      var dirReader = fs.root.createReader();
      dirReader.readEntries(function(entries) {
        if (!entries.length) {
          filelist.html('Filesystem is empty.') ;
        } else {
          filelist.html('') ;
        }
    

        
        for (var i = 0, entry; entry = entries[i]; ++i) {
          var img="";
          var cadena=""          
          if(entry.isDirectory)
          {
            img = '<img src="http://www.html5rocks.com/static/images/tutorials/icon-folder.gif">';
            cadena="<div id='file_folder_"+entry.name+"' class='columna5 file_folder index_dragt' laurl='"+entry.fullPath+"' dirurl='"+entry.fullPath.replace(entry.name,"")+"'>";
            cadena+= [img, '<span>', entry.name, '</span>'].join('');
          	cadena+="</div>";
          	filelist.append(cadena);
          	//folder_asign_actions("file_folder_"+entry.name);
          	
          } 
          else
          {
            var name=entry.name;
            var name_file=(entry.name).replace(".","_");
            img = '<img src="http://www.html5rocks.com/static/images/tutorials/icon-file.gif">';
            cadena="<div id='file_file_"+name_file+"' class='columna5 file_file index_dragt' draggable='true' laurl='"+entry.fullPath+"' dirurl='"+entry.fullPath.replace(entry.name,"")+"'>";
            cadena+= [img, '<span>', name, '</span>'].join('');
          	cadena+="</div>";
          	filelist.append(cadena);
          	file_asign_actions("file_file_"+name_file);
          	
          }
          
        }
        
      }, errorHandler);
    
    
    
    /*
      var dirReader = fs.root.createReader();
      dirReader.readEntries(function(entries) {
        for (var i = 0, entry; entry = entries[i]; ++i) {
          if (entry.isDirectory) {
            entry.removeRecursively(function() {}, errorHandler);
          } else {
            entry.remove(function() {}, errorHandler);
          }
        }
        filelist.innerHTML = 'Directory emptied.';
      }, errorHandler);
    }, false); */
  }

  function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}
  function listResults(entries) {
  // Document fragments can improve performance since they're only appended
  // to the DOM once. Only one browser reflow occurs.
  var fragment = document.createDocumentFragment();

  entries.forEach(function(entry, i) {
    var img = entry.isDirectory ? '<img src="folder-icon.gif">' :
                                  '<img src="file-icon.gif">';
    var li = document.createElement('li');
    li.innerHTML = [img, '<span>', entry.name, '</span>'].join('');
    fragment.appendChild(li);
  });

  document.querySelector('#new_folder').appendChild(fragment);
}
  /*function read_directory()
  {
  	window.requestFileSystem(PERSISTENT, 50*1024*1024, function(fs)
  	{
  		var dirReader = fs.root.createReader();
  		  var entries = [];

  		  // Call the reader.readEntries() until no more results are returned.
  		  var readEntries = function() {
  		     dirReader.readEntries (function(results) {
  		      if (!results.length) {
  		        listResults(entries.sort());
  		      } else {
  		        entries = entries.concat(toArray(results));
  		        readEntries();
  		      }
  		    }, errorHandler);
  		  };

  		  readEntries(); // Start reading dirs.
  	}
  		, errorHandler);
  }*/
  
function getAllFileEntries(dirReader, eldiv,lvl_) 
{	
  lvl_interno=lvl_+1;
  dirReader.readEntries(function(entries)
  {
  	for (var i = 0, entry; entry = entries[i]; ++i) {
  	  if (entry.isDirectory) 
  	  {
  	  img = '<img src="http://www.html5rocks.com/static/images/tutorials/icon-folder.gif">';
            cadena="<div id='file_folder_"+entry.name+"' class='columna5 file_folder index_dragt' laurl='"+entry.fullPath+"' dirurl='"+entry.fullPath.replace(entry.name,"")+"'>";
            cadena+=  '<span style="margin-left:'+(lvl_interno*20)+'px">'+ entry.name+ '</span>';
          	cadena+="</div>";
          	eldiv.append(cadena);

  	    getAllFileEntries(entry.createReader(), $("#file_folder_"+entry.name),lvl_interno);
  	  } 
  	  else 
  	  {
  	    var name=entry.name;
        var name_file=(entry.name).replace(".","_");
        img = '<img src="http://www.html5rocks.com/static/images/tutorials/icon-file.gif">';
        cadena="<div id='file_file_"+name_file+"' class='columna5 file_file index_dragt' draggable='true' laurl='"+entry.fullPath+"' dirurl='"+entry.fullPath.replace(entry.name,"")+"'>";
        cadena+= '<span style="margin-left:'+(lvl_interno*20)+'px">'+ name+ '</span>';
        cadena+="</div>";
        eldiv.append(cadena);
        file_asign_actions("file_file_"+name_file);
  	    console.log(entry.name)
  	  }
  	}	
  });

  
}
 