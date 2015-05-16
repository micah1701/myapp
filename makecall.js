$(document).ready(function(){

    $.get('http://micahj.com/code/webphone/getToken.php',{secure:'true'},function(data){
        var token = $.trim(data);
        var connection=null;
        
        Twilio.Device.setup( token ); 
        
        $("#call").click(function() {  
    		params = { "tocall" : $('#tocall').val()};
    		connection = Twilio.Device.connect(params);
    	});
    	$("#hangup").click(function() {  
    		Twilio.Device.disconnectAll();
    	});
    
    	Twilio.Device.ready(function (device) {
    		$('#status').text('Ready to start call');
    	});
    
    	Twilio.Device.incoming(function (conn) {
    		if (confirm('Accept incoming call from ' + conn.parameters.From + '?')){
    			connection=conn;
    		    conn.accept();
    		}
    	});
    
    	Twilio.Device.offline(function (device) {
    		$('#status').text('Offline');
    	});
    
    	Twilio.Device.error(function (error) {
    		$('#status').text(error);
    	});
    
    	Twilio.Device.connect(function (conn) {
    		$('#status').text("Successfully established call");
    		toggleCallStatus();
    	});
    
    	Twilio.Device.disconnect(function (conn) {
    		$('#status').text("Call ended");
    		toggleCallStatus();
    	});
    	
    	function toggleCallStatus(){
    		$('#call').toggle();
    		$('#hangup').toggle();
    		$('#dialpad').toggle();
    	}
    
    	$.each(['0','1','2','3','4','5','6','7','8','9','star','pound'], function(index, value) { 
        	$('#button' + value).click(function(){ 
    			if(connection) {
    				if (value=='star')
    					connection.sendDigits('*')
    				else if (value=='pound')
    					connection.sendDigits('#')
    				else
    					connection.sendDigits(value)
    				return false;
    			} 
			});
    	});
        
    });

});