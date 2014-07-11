<?php
//Multi image file uploader with no sql injection security. It is assumed that $pid has been sanitized
//Claude C - 10/2009

class file_upload extends DBconnect{
		public function image_upload($files, $pid, $userName){ 
		 //query db for article id first
	 	$query = "SELECT Pre_ID FROM Article_Preview WHERE Pre_ID = '$pid' ";	
		$qry_result = $this->connection($query);
		$article_id = mysql_fetch_array($qry_result);
		$Art_ID = $article_id['Pre_ID'];
		// then look up user	
		$user_query = "Select userID FROM User WHERE LoginCode = '$userName' ;";
	  	$Uid = $this->connection($user_query);
	  	$ID = mysql_fetch_array($Uid);	
		$userID = $ID['userID'];
		

		for($i=0; $i < 7; $i++){
			if ((($files["type"][$i] == "image/gif") || ($files["type"][$i] == "image/jpeg") 
			|| ($files["type"][$i] == "image/jpg") || ($files["type"][$i] == "image/pjpeg") 
			|| ($files["type"][$i] == "image/png")) ){
			
			if($files["size"][$i] < 5000000){//5mb
			  if ($files["error"][$i] > 0){
			    	echo "Return Code: " . $files["error"][$i] . "<br />";
			    }else{
				    $success_file =  "Upload: " . $files["name"][$i]. "<br />";
					//check if  file exists
				    if (file_exists("uploads/images/" . $files["name"][$i])){
				      	echo $files["name"][$i] . " already exists. ";
				    }else{
						$imgDate = date("Y-m-d");
						$img_file = $imgDate."_". $files["name"][$i];
						
				     	 move_uploaded_file($files["tmp_name"][$i],  "uploads/images/".$img_file);
				      	$path =  "uploads/images/". $img_file;
				      	
						if(!empty($userID) && !empty($Art_ID)){
							$img_query = "INSERT INTO Img (article_ID, Path, userID) VALUES ('$Art_ID', '$path', '$userID')";	
							$this->connection($img_query);	
							echo "<h2>Images Uploaded Successfully!</h2>";	
						}
				    }//end check if  file exists
			    }
		    }else{
		    	echo "Sorry, your image is too big. Please resize it to less than 5MBs, thanks.";
		    }
		  }else{
		  	$file_error =  "Invalid file";
		  }
		}//end for loop
	}

	public function doc_upload($files, $pid, $userName){
		//query db for article id first
	 	$query = "SELECT Pre_ID FROM Article_Preview WHERE Pre_ID = '$pid' ;";	
		$qry_result = $this->connection($query);
		$article_id = mysql_fetch_array($qry_result);
		$Art_ID = $article_id['Pre_ID'];
		// then look up user	
		$user_query = "Select userID FROM User WHERE LoginCode = '$userName' ;";
	  	$Uid = $this->connection($user_query);
	  	$ID = mysql_fetch_array($Uid);	
		$userID = $ID['userID'];
		
		$valid_ext = array("doc","docx","xls","xlsx","pdf","pptx","ppt", "pps");
		
		for($i=0; $i < 3; $i++){
			$blank_file_count = $i +1;
			
			if($files["size"][$i] < 5000000){//5mb
				$fileExt = explode(".", strtolower($files["name"][$i]));

				if (!in_array($fileExt[1], $valid_ext)){ 
			  		echo "File: $blank_file_count Not uploaded.<br />";
			  	}else{
			  		//check for errors
				  if ($file["error"][$i] > 0){
				    	echo "Return Code: " . $files["error"][$i] . "<br />";
				    }else{
					    $success_file =  "Upload: " . $files["name"][$i] . "<br />";
					
					    if (file_exists("uploads/docs/" . $files["name"][$i])){
					      	echo $files["name"][$i] . " already exists. ";
					      }else{
							$imgDate = date("Y-m-d");
							$img_file = $imgDate. "-".$files["name"][$i];
							
					     	 move_uploaded_file($files["tmp_name"][$i],  "uploads/docs/".$img_file);
					      	$path =  "uploads/docs/". $img_file;
					      	
					      	if(!empty($userID) && !empty($Art_ID)){
								$img_query = "INSERT INTO Docs (article_ID, Path, userID) VALUES ('$Art_ID', '$path', '$userID')";		 
								$this->connection($img_query);	
								echo "<h2>File $blank_file_count Uploaded Successfully!</h2>";	
							}
					    }// end  file exists check	
				    }// end  file error check	
				}// end  file ext check	
			}else{
				echo "Sorry, file #$blank_file_count is too big. Please resize it to less than 5MBs, thanks.<br />";
			}	
		}//end for loop
	}//end method

}//end class
?>