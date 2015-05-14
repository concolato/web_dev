<?php
function appendJson(){
	$filename1 = "oasp.json";
	$jsonStr1 = file_get_contents($filename1);
	$jsonObj1 = json_decode($jsonStr1);

	if(file_exists($filename1)){
		foreach($jsonObj1->features as $metrodata){
			$metrodata->properties->asian_indian = 132;
			$metrodata->properties->Bangladeshi = 114.2;
			$metrodata->properties->Bhutanese = 146.9;
			$metrodata->properties->Burmese = 117.9;
			$metrodata->properties->Cambodian = 110.5;
			$metrodata->properties->Chinese = 113;
			$metrodata->properties->Filipino = 117.4;
			$metrodata->properties->Hmong = 19.0;
			$metrodata->properties->Indonesian = 55.4;
			$metrodata->properties->Japanese = 19.2;
			$metrodata->properties->Korean = 21.8;
			$metrodata->properties->Laotian = 60.5;
			$metrodata->properties->Malaysian = 79.5;
			$metrodata->properties->Mongolian = 110.5;
			$metrodata->properties->Nepalese = 113;
			$metrodata->properties->Okinawan = 117.4;
			$metrodata->properties->Pakistani = 19.0;
			$metrodata->properties->Sri_Lankan = 55.4;
			$metrodata->properties->Taiwanese = 19.2;
			$metrodata->properties->Thai = 21.8;
			$metrodata->properties->Vietnamese = 60.5;
			$metrodata->properties->Other_Asian = 79.5;

			$metrodata->properties->black_lang_prof = 32;
			$metrodata->properties->black_age_18_24 = 14.2;
			$metrodata->properties->black_age_25_54 = 46.9;
			$metrodata->properties->black_age_55_over = 17.9;
			$metrodata->properties->black_unemployment = 10.5;
			$metrodata->properties->black_edu_less_than_high = 13;
			$metrodata->properties->black_edu_high_ged = 17.4;
			$metrodata->properties->black_edu_some_college = 9.0;
			$metrodata->properties->black_edu_college_higher = 25.4;
			$metrodata->properties->black_disability = 9.2;
			$metrodata->properties->black_poverty = 11.8;
			$metrodata->properties->black_male = 40.5;
			$metrodata->properties->black_female = 59.5;

			$metrodata->properties->hispanic_lang_prof = 312;
			$metrodata->properties->hispanic_age_18_24 = 4.2;
			$metrodata->properties->hispanic_age_25_54 = 26.9;
			$metrodata->properties->hispanic_age_55_over = 7.9;
			$metrodata->properties->hispanic_unemployment = 5.5;
			$metrodata->properties->hispanic_edu_less_than_high = 13;
			$metrodata->properties->hispanic_edu_high_ged = 17.4;
			$metrodata->properties->hispanic_edu_some_college = 9.0;
			$metrodata->properties->hispanic_edu_college_higher = 25.4;
			$metrodata->properties->hispanic_disability = 7.2;
			$metrodata->properties->hispanic_poverty = 10.8;
			$metrodata->properties->hispanic_male = 30.5;
			$metrodata->properties->hispanic_female = 49.5;
		}
		
		$jsonStr1 = json_encode($jsonObj1);
		//echo $jsonStr1;
		$cleanJsonStr = json_decode($jsonStr1);

		//Validate the JSON
		if($cleanJsonStr === NULL){
			error_log("There is an issue with your json in appendJson().\n");
		}else{
			//var_dump($jsonStr1);
			$destination = "oasp.json";
			file_put_contents($destination, minifyJson($jsonStr1));
			print_r($jsonStr1);
		}
	}else{
		error_log("File: ".$filename1." does not exist in appendJson().\n");
	}
}

function minifyJson($jsonStr){
	$string = trim($jsonStr);
	return $string;
}

function JSON_Obj_Transform(){
	$filename = "oshaReginalAndWhdDistrictOffices.json";

	if(file_exists($filename)){
		$jsonStr = file_get_contents($filename);

		$jsonObj = json_decode($jsonStr);
		$count = count($jsonObj);
		//var_dump($jsonObj);

		$jsonArrayOfObjs = "[";
			$jsonArrayOfObjs .= "{types:\"job_centers\", properties:{";
			//WHD District Offices, OSHA Area Office, Job Corps Center, Affiliate, Comprehensive,
			// EBSA Regional Office, EBSA District Office, OFCCP District Office, 
			//OFCCP Area Office, 
			foreach ($jsonObj as $info) {
				if($info->TYPE == "EBSA District Office"){
					$jsonArrayOfObjs .= "\"TYPE\": \"". htmlentities($info->TYPE, ENT_QUOTES)."\",
					\"NAME\": \"".htmlentities($info->NAME, ENT_QUOTES)."\",
				    \"Street_Address\": \"".htmlentities($info->Street_Address, ENT_QUOTES)."\",
				    \"City\": \"".htmlentities($info->City, ENT_QUOTES)."\",
				    \"State\": \"".htmlentities($info->State, ENT_QUOTES)."\",
				    \"Zip\": \"".htmlentities($info->Zip, ENT_QUOTES)."\",
				    \"LATITUDE\": ".$info->LATITUDE."\",
				    \"LONGITUDE\": ".$info->LONGITUDE."\",";
				}		
			}
			$jsonArrayOfObjs .= "}";
		$jsonArrayOfObjs .= "]";

		echo $jsonArrayOfObjs;
	}
}

function JSON_Node_String_Clearup(){
	$filename = "asianSubGroupsPerMSA.json";
	$filenameNew = "asianSubGroupsPerMSA_New.json";
	$patterns = array();
	$patterns[0] = '/\s+/';
	$patterns[1] = '/-/';

	if(file_exists($filename)){
		$jsonStr = file_get_contents($filename);
		$jsonObj = json_decode($jsonStr);

		foreach ($jsonObj as $info) {
			$info->Metro_Area = preg_replace($patterns, '', $info->Metro_Area);
		}

		$jsonStr1 = json_encode($jsonObj);
		//echo $jsonStr1;

		//Validate the JSON
		$cleanJsonStr = json_decode($jsonStr1);
		if($cleanJsonStr === NULL){
			error_log("There is an issue with your json in appendJson().\n");
		}else{
			file_put_contents($filenameNew, $jsonStr1);
			print_r($jsonStr1);
		}
	}else{
		error_log("File: ".$filename." does not exist in JSON_Node_String_Clearup().\n");
	}
}

function dataCal(){
	$filename = "asianSubGroupsPerMSA_New.json";

	if(file_exists($filename)){
		$jsonStr = file_get_contents($filename);
		$jsonObj = json_decode($jsonStr);
		
		$totalAsian_Indian = 0;
		$totalBangladeshi = 0;
		$totalCambodian = 0;
		$totalChinese_except_Taiwanese = 0;
		$totalFilipino = 0;
		$totalHmong = 0;
		$totalIndonesian = 0;
		$totalJapanese = 0;
		$totalKorean = 0;
		$totalLaotian = 0;
		$totalMalaysian = 0;
		$totalPakistani = 0;
		$totalSri_Lankan = 0;
		$totalTaiwanese = 0;
		$totalThai = 0;
		$totalVietnamese = 0;
		$totalOther_Asian = 0;
		$totalOther_Asian_not_specified = 0;

		foreach ($jsonObj as $info) {
			$info->Asian_Indian = (int) $info->Asian_Indian;
			$info->Bangladeshi = (int) $info->Bangladeshi;
			$info->Cambodian = (int) $info->Cambodian;
			$info->Chinese_except_Taiwanese = (int) $info->Chinese_except_Taiwanese;
			$info->Filipino = (int) $info->Filipino;
			$info->Hmong = (int) $info->Hmong;
			$info->Indonesian = (int) $info->Indonesian;
			$info->Japanese = (int) $info->Japanese;
			$info->Korean = (int) $info->Korean;
			$info->Laotian = (int) $info->Laotian;
			$info->Malaysian = (int) $info->Malaysian;
			$info->Pakistani = (int) $info->Pakistani;
			$info->Sri_Lankan = (int) $info->Sri_Lankan;
			$info->Taiwanese = (int) $info->Taiwanese;
			$info->Thai = (int) $info->Thai;
			$info->Vietnamese = (int) $info->Vietnamese;
			$info->Other_Asian = (int) $info->Other_Asian;
			$info->Other_Asian_not_specified = (int) $info->Other_Asian_not_specified;
			
			$totalAsian_Indian += $info->Asian_Indian;
			$totalBangladeshi += $info->Bangladeshi;
			$totalCambodian += $info->Cambodian;
			$totalChinese_except_Taiwanese += $info->Chinese_except_Taiwanese;
			$totalFilipino += $info->Filipino;
			$totalHmong += $info->Hmong;
			$totalIndonesian += $info->Indonesian;
			$totalJapanese += $info->Japanese;
			$totalKorean += $info->Korean;
			$totalLaotian += $info->Laotian;
			$totalMalaysian += $info->Malaysian;
			$totalPakistani += $info->Pakistani;
			$totalSri_Lankan += $info->Sri_Lankan;
			$totalTaiwanese += $info->Taiwanese;
			$totalThai += $info->Thai;
			$totalVietnamese += $info->Vietnamese;
			$totalOther_Asian += $info->Other_Asian;
			$totalOther_Asian_not_specified += $info->Other_Asian_not_specified;
			
			//var_dump($info);
		}

		echo "<br /> Asian_Indian: ".$totalAsian_Indian;
		echo "<br /> Bangladeshi: ".$totalBangladeshi;
		echo "<br /> Cambodian: ".$totalCambodian;
		echo "<br /> Chinese_except_Taiwanese: ".$totalChinese_except_Taiwanese;
		echo "<br /> Filipino: ".$totalFilipino;
		echo "<br /> Hmong: ".$totalHmong;
		echo "<br /> Indonesian: ".$totalIndonesian;
		echo "<br /> Japanese: ".$totalJapanese;
		echo "<br /> Korean: ".$totalKorean;
		echo "<br /> Laotian: ".$totalLaotian;
		echo "<br /> Malaysian: ".$totalMalaysian;
		echo "<br /> Pakistani: ".$totalPakistani;
		echo "<br /> Sri_Lankan: ".$totalSri_Lankan;
		echo "<br /> Taiwanese: ".$totalTaiwanese;
		echo "<br /> Thai: ".$totalThai;
		echo "<br /> Vietnamese: ".$totalVietnamese;
		echo "<br /> Other_Asian: ".$totalOther_Asian;
		echo "<br /> Other_Asian_not_specified: ".$totalOther_Asian_not_specified;
	}else{
		error_log("File: ".$filename." does not exist in dataCal().\n");
	}
}
//echo "<pre>".JSON_Obj_Transform()."</pre>";

dataCal();

class A{
	public function message($text){
		$dataText = $text;

		return $dataText;
	}

	public function calAdd($a, $b){
		return $a + $b;
	}
}

class B extends A{
	public function Foo(){
		$name = "Claude";

		return $this->message($name);
	}

	public function Bar(){
		$x = 14;
		$y = 20;

		return $this->calAdd($x, $y);
	}
}

$data = new B();

//echo $data->Bar()."<br />";
//echo $data->calAdd(111,22);

$oshaActivityNums = array();
$latitude = 123424.09;
$longitude = 123424.09;
$estabNameForArray;

//if(isset($latitude) || isset($longitude) || isset($estabNameForArray)){
	$data = $latitude.$longitude.$estabNameForArray;
	array_push($oshaActivityNums, $data);
	//var_dump($oshaActivityNums);
//}else{
	//echo "No all vars are set";
//}

?>