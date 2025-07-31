<?php
require 'db.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $question_id = $_POST['question_id'] ?? null;
    $user_id = $_POST['user_id'] ?? null;
    $action = $_POST['action'] ?? null; // 'like' or 'dislike'

    if (!$question_id || !$user_id || !in_array($action, ['like', 'dislike'])) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
        exit;
    }

    $like_table = 'likes_question';
    $dislike_table = 'dislikes_question';

    $conn->begin_transaction();

    try {
        // Check if user already liked
        $stmt = $conn->prepare("SELECT 1 FROM $like_table WHERE user_id = ? AND question_id = ?");
        $stmt->bind_param("ii", $user_id, $question_id);
        $stmt->execute();
        $alreadyLiked = $stmt->get_result()->num_rows > 0;
        $stmt->close();

        // Check if user already disliked
        $stmt = $conn->prepare("SELECT 1 FROM $dislike_table WHERE user_id = ? AND question_id = ?");
        $stmt->bind_param("ii", $user_id, $question_id);
        $stmt->execute();
        $alreadyDisliked = $stmt->get_result()->num_rows > 0;
        $stmt->close();

        if ($action === 'like') {
            if ($alreadyLiked) {
                throw new Exception("You already liked this post.");
            }

            if ($alreadyDisliked) {
                // Remove the dislike
                $stmt = $conn->prepare("DELETE FROM $dislike_table WHERE user_id = ? AND question_id = ?");
                $stmt->bind_param("ii", $user_id, $question_id);
                $stmt->execute();
                $stmt->close();

                // Decrease dislike count
                $stmt = $conn->prepare("UPDATE questions SET dislike_count = dislike_count - 1 WHERE id = ?");
                $stmt->bind_param("i", $question_id);
                $stmt->execute();
                $stmt->close();
            }

            // Insert like
            $stmt = $conn->prepare("INSERT INTO $like_table (user_id, question_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $user_id, $question_id);
            $stmt->execute();
            $stmt->close();

            // Increase like count
            $stmt = $conn->prepare("UPDATE questions SET like_count = like_count + 1 WHERE id = ?");
            $stmt->bind_param("i", $question_id);
            $stmt->execute();
            $stmt->close();

        } else { // action === 'dislike'
            if ($alreadyDisliked) {
                throw new Exception("You already disliked this post.");
            }

            if ($alreadyLiked) {
                // Remove the like
                $stmt = $conn->prepare("DELETE FROM $like_table WHERE user_id = ? AND question_id = ?");
                $stmt->bind_param("ii", $user_id, $question_id);
                $stmt->execute();
                $stmt->close();

                // Decrease like count
                $stmt = $conn->prepare("UPDATE questions SET like_count = like_count - 1 WHERE id = ?");
                $stmt->bind_param("i", $question_id);
                $stmt->execute();
                $stmt->close();
            }

            // Insert dislike
            $stmt = $conn->prepare("INSERT INTO $dislike_table (user_id, question_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $user_id, $question_id);
            $stmt->execute();
            $stmt->close();

            // Increase dislike count
            $stmt = $conn->prepare("UPDATE questions SET dislike_count = dislike_count + 1 WHERE id = ?");
            $stmt->bind_param("i", $question_id);
            $stmt->execute();
            $stmt->close();
        }

        $conn->commit();
        echo json_encode(['status' => 'success', 'message' => ucfirst($action) . ' registered']);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
