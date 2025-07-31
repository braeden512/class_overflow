<?php
require 'db.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $question_id = $_POST['question_id'] ?? null;

    if (!$question_id) {
        echo json_encode(['error' => 'Missing question_id']);
        exit;
    }

    // Use prepared statement to avoid SQL injection
    $stmt = $conn->prepare("SELECT like_count, dislike_count FROM questions WHERE id = ?");
    $stmt->bind_param("i", $question_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode([
            'like_count' => $row['like_count'],
            'dislike_count' => $row['dislike_count']
        ]);
    } else {
        echo json_encode(['error' => 'Question not found']);
    }

    $stmt->close();
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
