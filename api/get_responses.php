<?php
require 'db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!isset($_GET['question_id'])) {
    echo json_encode(["success" => false, "error" => "Missing question_id"]);
    exit();
}

$question_id = intval($_GET['question_id']);

$query = "
    SELECT responses.id, responses.content, responses.created_at, users.username
    FROM responses
    LEFT JOIN users ON responses.user_id = users.id
    WHERE responses.question_id = ?
    ORDER BY responses.created_at ASC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $question_id);
$stmt->execute();
$result = $stmt->get_result();

$responses = [];
while ($row = $result->fetch_assoc()) {
    $responses[] = $row;
}

echo json_encode([
    "success" => true,
    "responses" => $responses
]);
?>