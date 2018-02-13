var perpage =4;
var page =1;
var pages =0;
var comments =[];
$("#messageBtn").on('click',function(){
	$.ajax({
		type: 'POST',
		url: 'api/comment/post',
		data:{
			contentid: $("#contentId").val(),
			content: $("#messageContent").val()
		},
		success: function(responseData){
			 $("#messageContent").val('');
			 comments =responseData.data.comments.reverse();
             renderComment();
		}
	})
});

function renderComment(){

    
    $("#messageCount").html("共"+comments.length+"条");
    pages = Math.max(Math.ceil( comments.length/perpage ),1);
    var start = Math.max(0,(page-1) * perpage);
    var end =Math.min(start + perpage, comments.length);
    var $lis =$('.pager li');

    $lis.eq(1).html(page + '/' + pages);
    if(page <= 1){
    	page =1;
    	$lis.eq(0).html("<span>没有上一页</span>");
    }else{
    	$lis.eq(0).html("<a href='javascript:;'>上一页</a>");
    }

    if(page >= pages){
    	page =pages;
    	$lis.eq(2).html("<span>没有下一页</span>");
    }else{
    	$lis.eq(2).html("<a href='javascript:;'>下一页</a>");
    }


    if(comments.length==0){
    	$(".messageList").html('<div class="messageBox"><p>还没有留言</p></div>');
    } else{
        var html ="";
	    for(var i=start; i<end; i++){
	    	html += '<div class="messageBox">'+
					'<p class="name clear"><span class="fl">'+comments[i].username+'</span><span class="fr">'+formDate(comments[i].postTime)+'</span></p>'+
				    '<p>'+comments[i].content+'</p>'+
				    '</div>';
	    }
	    $(".messageList").html(html);  	
    }
    


    

		
}


	$.ajax({
		type: 'get',
		url: 'api/comment',
		data:{
			contentid: $("#contentId").val()
		},
		success: function(responseData){
			 $("#messageCount").html("共"+responseData.data.comments.length+"条");
			 $("#messageContent").val('');
			 comments =responseData.data.comments.reverse();
             renderComment();
		}
	})

    $('.pager').delegate('a','click',function(){
    	 if($(this).parent().hasClass('previous')){
    	 	  console.log(111);
    	 	  page--;
    	 	  renderComment();
    	 }else{
    	 	console.log(222);
              page++;
              renderComment();
    	 }
    }) 

	function formDate(d){
       var date = new Date(d);
       return date.getFullYear()+'年' + (date.getMonth()+1) +'月' +date.getDate() +'日'+
       date.getHours() +':'+ date.getMinutes() +':'+ date.getSeconds();
	}