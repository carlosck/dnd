

var div_menu = function (athis) {
    
    athis.addEventListener('dragstart', athis.menu_DragStart)
    athis.prototype.menu_DragStart=function(event)
    {
        event.stopPropagation(); 
        event.dataTransfer.setData('text', event.target.id);
        console.log("draaag menu " +event.target.id);
    }
  };