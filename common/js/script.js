/* - BASE HTML TEMPLATE
------------------------------------------------- 
	Description: JS Scripts
	Author:Shane Prendergast
	Author URL:http://www.webknit.co.uk
	Template URL:http://base.webknit.co.uk/
*/
/*$("#div_element").live("dragstart",function(e)
{
	e.dataTransfer.setData('text', e.target.id);
});*/
var cont=0;
if (Modernizr.draganddrop) {
  // Browser supports HTML5 DnD.
  
} else {
  // Fallback to a library solution.
  
}
/*
$("#div_element").live("drop",function(e){
	
	if (e.stopPropagation) {
	    e.stopPropagation(); // Stops some browsers from redirecting.
	    
	  }
	alert("este 1");  
	console.log(e.dataTransfer);
});

$("#drop_element").live("drop",function(e){
	alert("este");
	if (e.stopPropagation) {
	    e.stopPropagation(); // Stops some browsers from redirecting.
	    console.log(e.dataTransfer);
	  }
});*/
function menu_DragStart(e)
{
	e.dataTransfer.setData('text', e.target.id);
	console.log("draaag");
}
function index_DragStart(e)
{
	e.dataTransfer.setData('text', e.target.id);
}
function index_Drop(e)
{
	e.preventDefault();
	e.stopPropagation();
	var data=e.dataTransfer.getData("Text");
	//ev.target.appendChild(document.getElementById(data));
	console.log(e.target.id);
	if(data=="div_element")
	{
		$("#"+e.target.id).css('background-color','white');
		$("#"+e.target.id).css('background-color','none');
		crea_div(e);
	}
	console.log(data);
}
function index_DragOver(ev)
{
	ev.preventDefault();
	console.log(ev.target.id);
	$("#"+ev.target.id).css('border','1px solid #c1c1c1');
	$("#"+ev.target.id).css('background-color','lightgreen');
}
function index_dragleave(ev)
{
	ev.preventDefault();
	$("#"+ev.target.id).css('border',' none');
	$("#"+ev.target.id).css('background-color','white');
}
function index_DragEnd(ev)
{
	ev.preventDefault();
}
/*
var cols = document.querySelectorAll('.dragt');
[].forEach.call(cols, function(col) {
  col.addEventListener('dragstart', handleDragStart, false);
  //col.addEventListener('dragenter', handleDragEnter, false)
  col.addEventListener('dragover', handleDragOver, false);
  //col.addEventListener('dragleave', handleDragLeave, false);
  col.addEventListener('drop', handleDrop, false);
  col.addEventListener('dragend', handleDragEnd, false);
});
*/
$(".menu_dragt").each(function(){
  this.addEventListener('dragstart', function(e){
  	e.dataTransfer.setData('text', e.target.id);
  	console.log("draaag");
  });
  //col.addEventListener('dragenter', handleDragEnter, false)
  
});

$(".index_dragt").each(function(){
  $(this)[0].addEventListener('dragstart', index_DragStart, false);
  //col.addEventListener('dragenter', handleDragEnter, false)
  $(this)[0].addEventListener('dragover', index_DragOver, false);
  $(this)[0].addEventListener('dragleave', index_dragleave, false);
  $(this)[0].addEventListener('drop', index_Drop, false);
  $(this)[0].addEventListener('dragend', index_DragEnd, false);
});
function asigna_acciones(div)
{
	$("#"+div)[0].addEventListener('dragstart', index_DragStart, false);
	//col.addEventListener('dragenter', handleDragEnter, false)
	$("#"+div)[0].addEventListener('dragover', index_DragOver, false);
	$("#"+div)[0].addEventListener('dragleave', index_dragleave, false);
	$("#"+div)[0].addEventListener('drop', index_Drop, false);
	$("#"+div)[0].addEventListener('dragend', index_DragEnd, false);
}
function crea_div(e)
{
	
	$("#"+e.target.id).append("<div id='div_"+cont+"' class='index_dragt' draggable='true' style='border: 1px solid lightblue;'>div_"+cont+" ...</div>");
	asigna_acciones("div_"+cont);
	cont++;

}






