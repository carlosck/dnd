var overflow_array=new Array('overflow_hidden','overflow_visible','overflow_scroll','overflow_x_visible','overflow_x_hidden','overflow_x_scroll'
					,'overflow_y_visible','overflow_y_hidden','overflow_y_scroll','overflow_wrapnormal','wraphyphenate','break_word');
var position_array=new Array('absolute','relative');	
var align_types=new Array('center','left','right');
var clear_types=new Array('clear_both','clear_none');

function delete_properties(eldiv,elarray)				
{
//aqui no se si poner un if(hasClass()) o que borre todas las clases 
	for(var i=0;i<elarray.length;i++)
	{
		eldiv.removeClass(elarray[i]);
	}
}