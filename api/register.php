<?php

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'db.php'; // DB connection from db.php

// Get JSON input
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

// Validate input
$requiredFields = ['email', 'password', 'displayName', 'college'];
$missing = [];

foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        $missing[] = $field;
    }
}

if (!empty($missing)) {
    echo json_encode([
        "success" => false,
        "error" => "Missing fields: " . implode(', ', $missing)
    ]);
    exit();
}

$email = $data['email'];
$passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
$username = $data['displayName'];
$college = $data['college'];

try {
    // Check if school exists
    $stmt = $conn->prepare("SELECT id FROM schools WHERE name = ?");
    $stmt->bind_param("s", $college);
    $stmt->execute();
    $result = $stmt->get_result();
    $school = $result->fetch_assoc();

    if ($school) {
        $school_id = $school['id'];
    } else {
        // Insert school if not exists
        $stmt = $conn->prepare("INSERT INTO schools (name) VALUES (?)");
        $stmt->bind_param("s", $college);
        $stmt->execute();
        $school_id = $stmt->insert_id;
    }

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (username, password_hash, email, school_id) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $username, $passwordHash, $email, $school_id);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "user_id" => $stmt->insert_id,
        "school_id" => $school_id
    ]);

} catch (mysqli_sql_exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
