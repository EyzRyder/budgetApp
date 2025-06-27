<?php
$response = file_get_contents("http://localhost/WEB/api/get-budgets.php");
echo $response;
$data = json_decode($response, true); // Converts JSON to associative array
echo $data;


// $ch = curl_init("http://localhost/WEB/api/get-budgets.php");

// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
// curl_setopt($ch, CURLOPT_HTTPHEADER, [
//     "Accept: application/json",
// ]);

// $response = curl_exec($ch);
// curl_close($ch);

// $data = json_decode($response, true);

// echo $response;
// echo $data["budgets"][0]["id"];