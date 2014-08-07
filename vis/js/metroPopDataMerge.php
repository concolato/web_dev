<?php
function appendJson(){
	$filename1 = "metroAreaGeometry.json";
	$filename2 = "HawaiianAsianPop.json";
	$jsonStr1 = file_get_contents($filename1);
	$jsonObj1 = json_decode($jsonStr1);
	$jsonStr2 = file_get_contents($filename2);
	$jsonObj2 = json_decode($jsonStr2);

	if(file_exists($filename1) && file_exists($filename2)){
		foreach($jsonObj1->features as $metrodata){

			foreach($jsonObj2 as $populationObjStep){
				if($populationObjStep->MetroArea == $metrodata->properties->NAME){
					$metrodata->properties->hawaiian = $populationObjStep->Hawaiian;
					$metrodata->properties->asian = $populationObjStep->Asian;
					//echo $objStep->properties->violations." ".$objStep->id."<br />";
				}
			}
		}
		
		$jsonStr1 = json_encode($jsonObj1);
		//echo $jsonStr1;
		$cleanJsonStr = json_decode($jsonStr1);

		//Validate the JSON
		if($cleanJsonStr === NULL){
			error_log("There is an issue with your json in appendJson().\n");
		}else{
			return $jsonStr1;
		}
	}else{
		error_log("File: ".$filename1." or ".$filename2." does not exist in appendJson().\n");
	}
}
echo "<pre>".appendJson()."</pre>";
?>