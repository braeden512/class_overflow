<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['content']) && isset($data['user_id'])) {
    $content = $data['content'];
    $user_id = $data['user_id'];
    $question_id = isset($data['question_id']) ? $data['question_id'] : null;

    $stmt = $conn->prepare("INSERT INTO responses (content, user_id, question_id) VALUES (?, ?, ?)");
    $stmt->bind_param("sii", $content, $user_id, $question_id);

    try {
        $stmt->execute();
        echo json_encode([
            "success" => true,
            "post_id" => $stmt->insert_id,
        ]);
    } catch (mysqli_sql_exception $e) {
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Missing fields."]);
}
?>
