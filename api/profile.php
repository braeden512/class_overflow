<?php
    require 'db.php';

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Content-Type: application/json");

    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['user_id']) && isset($data['dark_mode'])) {
        $user_id = intval($data['user_id']);
        $dark_mode = intval($data['dark_mode']);

        // sql query to update the dark_mode value for user's id
        $stmt = $conn->prepare("UPDATE users SET dark_mode = ? WHERE id = ?");
        $stmt->bind_param("ii", $dark_mode, $user_id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        }
        else {
            echo json_encode(["success" => false, "error" => "Database update failed."]);
        }
    }
    else {
        echo json_encode(["success" => false, "error" => "Missing data."]);
    }
?>