<?php
require 'db.php'; // Database connection

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email']) && isset($data['password'])) {
    $email = $data['email'];
    $password = $data['password'];

    // Query to join users table with schools table to fetch school name
    $stmt = $conn->prepare("
        SELECT users.id, users.username, users.password_hash, users.school_id, users.dark_mode, schools.name AS school
        FROM users
        JOIN schools ON users.school_id = schools.id
        WHERE users.email = ?
    ");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verify password
        if (password_verify($password, $user['password_hash'])) {
            // Successful login
            echo json_encode([
                "success" => true, 
                "user" => [
                    "id" => $user['id'], 
                    "username" => $user['username'], 
                    "school" => $user['school'],  // School name from the query
                    "school_id" => $user['school_id'], // School ID
                    "dark_mode" => $user['dark_mode'],
                ]
            ]);
        } else {
            // Incorrect password
            echo json_encode(["success" => false, "error" => "Incorrect password."]);
        }
    } else {
        // User not found
        echo json_encode(["success" => false, "error" => "User not found."]);
    }
} else {
    // Missing email or password
    echo json_encode(["success" => false, "error" => "Missing email or password."]);
}
?>
