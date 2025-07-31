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
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (! isset($data['post_id'], $data['user_id'], $data['like'], $data['dislike'])) {
    echo json_encode(["success" => false, "error" => "Missing parameters"]);
    exit;
}

$post_id  = (int)$data['post_id'];
$user_id  = (int)$data['user_id'];
$like     = (int)$data['like'];
$dislike  = (int)$data['dislike'];

// Verify post exists
$stmt = $conn->prepare("SELECT 1 FROM questions WHERE id = ?");
$stmt->bind_param("i", $post_id);
$stmt->execute();
if ($stmt->get_result()->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "Post not found"]);
    exit;
}

// Check current reactions
$stmt = $conn->prepare("SELECT 1 FROM likes_question WHERE user_id = ? AND question_id = ?");
$stmt->bind_param("ii", $user_id, $post_id);
$stmt->execute();
$hadLike = $stmt->get_result()->num_rows > 0;

$stmt = $conn->prepare("SELECT 1 FROM dislikes_question WHERE user_id = ? AND question_id = ?");
$stmt->bind_param("ii", $user_id, $post_id);
$stmt->execute();
$hadDislike = $stmt->get_result()->num_rows > 0;

// 1) Toggle-off: like=0 & dislike=0
if ($like === 0 && $dislike === 0) {
    if ($hadLike) {
        $stmt = $conn->prepare("DELETE FROM likes_question WHERE user_id = ? AND question_id = ?");
        $stmt->bind_param("ii", $user_id, $post_id);
        $stmt->execute();
        $stmt = $conn->prepare("UPDATE questions SET like_count = like_count - 1 WHERE id = ?");
        $stmt->bind_param("i", $post_id);
        $stmt->execute();
    }
    if ($hadDislike) {
        $stmt = $conn->prepare("DELETE FROM dislikes_question WHERE user_id = ? AND question_id = ?");
        $stmt->bind_param("ii", $user_id, $post_id);
        $stmt->execute();
        $stmt = $conn->prepare("UPDATE questions SET dislike_count = dislike_count - 1 WHERE id = ?");
        $stmt->bind_param("i", $post_id);
        $stmt->execute();
    }

// 2) New like
} elseif ($like === 1) {
    if ($hadDislike) {
        $stmt = $conn->prepare("DELETE FROM dislikes_question WHERE user_id = ? AND question_id = ?");
        $stmt->bind_param("ii", $user_id, $post_id);
        $stmt->execute();
        $stmt = $conn->prepare("UPDATE questions SET dislike_count = dislike_count - 1 WHERE id = ?");
        $stmt->bind_param("i", $post_id);
        $stmt->execute();
    }
    if (! $hadLike) {
        $stmt = $conn->prepare("INSERT INTO likes_question (user_id, question_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $user_id, $post_id);
        $stmt->execute();
        $stmt = $conn->prepare("UPDATE questions SET like_count = like_count + 1 WHERE id = ?");
        $stmt->bind_param("i", $post_id);
        $stmt->execute();
    }

// 3) New dislike
} elseif ($dislike === 1) {
    if ($hadLike) {
        $stmt = $conn->prepare("DELETE FROM likes_question WHERE user_id = ? AND question_id = ?");
        $stmt->bind_param("ii", $user_id, $post_id);
        $stmt->execute();
        $stmt = $conn->prepare("UPDATE questions SET like_count = like_count - 1 WHERE id = ?");
        $stmt->bind_param("i", $post_id);
        $stmt->execute();
    }
    if (! $hadDislike) {
        $stmt = $conn->prepare("INSERT INTO dislikes_question (user_id, question_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $user_id, $post_id);
        $stmt->execute();
        $stmt = $conn->prepare("UPDATE questions SET dislike_count = dislike_count + 1 WHERE id = ?");
        $stmt->bind_param("i", $post_id);
        $stmt->execute();
    }
}

// Fetch and return updated counts
$stmt = $conn->prepare("SELECT like_count, dislike_count FROM questions WHERE id = ?");
$stmt->bind_param("i", $post_id);
$stmt->execute();
$counts = $stmt->get_result()->fetch_assoc();

echo json_encode([
    "success"       => true,
    "like_count"    => (int)$counts['like_count'],
    "dislike_count" => (int)$counts['dislike_count']
]);
