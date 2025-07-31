<?php
    require 'db.php';

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Content-Type: application/json");

    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['user_id']) && isset($data['post_id'])) {
        $user_id = intval($data['user_id']);
        $post_id = intval($data['post_id']);

        // sql query to delete post for user's id
        $stmt = $conn->prepare("DELETE FROM questions WHERE id = ?");
        $stmt->bind_param("i", $post_id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        }
        else {
            echo json_encode(["success" => false, "error" => "Database failed to delete"]);
        }
    }
    else {
        echo json_encode(["success" => false, "error" => "Missing data."]);
    }
?>