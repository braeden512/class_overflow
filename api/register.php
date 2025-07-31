<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'db.php'; // Include the database connection

// If it's a preflight request, return early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

// Get the input data from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Check if all required fields are provided
if (isset($data['email']) && isset($data['password']) && isset($data['displayName']) && isset($data['college'])) {
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT); // Hash the password
    $username = $data['displayName'];
    $college = $data['college']; // The school name
    
    // Check if the college (school) exists
    $stmt = $conn->prepare("SELECT id FROM schools WHERE name = ?");
    $stmt->bind_param("s", $college);
    $stmt->execute();
    $result = $stmt->get_result();
    $school = $result->fetch_assoc();
    
    // If the school exists, get the school_id
    if ($school) {
        $school_id = $school['id'];
    } else {
        // If the school doesn't exist, insert it
        $stmt = $conn->prepare("INSERT INTO schools (name) VALUES (?)");
        $stmt->bind_param("s", $college);
        $stmt->execute();
        $school_id = $stmt->insert_id; // Get the last inserted school_id
    }

    // Prepare the SQL query to insert the new user
    $stmt = $conn->prepare("INSERT INTO users (username, password_hash, email, school_id) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $password, $email, $school_id); // Bind the parameters

    try {
        $stmt->execute(); // Execute the query
        echo json_encode([
            "success" => true,
            "user_id" => $stmt->insert_id, // Return user_id in response
            "school_id" => $school_id // Return school_id in response
        ]);
    } catch (mysqli_sql_exception $e) {
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Missing fields."]); // Missing data error
}
?>
