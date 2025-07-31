<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'db.php'; // Include the database connection

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

try {

    // get the user id 
    if (isset($_GET['user_id'])) {
        $user_id = intval($_GET['user_id']);

        // prepare SQL query to select post along with related user, school, and class information
        $stmt = $conn->prepare(
            "SELECT 
                questions.id AS question_id,
                questions.title,
                users.username,
                questions.content,
                schools.name AS school_name,
                classes.name AS class_name,
                DATE (questions.created_at) AS created_at
            FROM questions
                JOIN users ON questions.user_id = users.id
                JOIN schools ON questions.school_id = schools.id
                JOIN classes ON questions.class_id = classes.id
            WHERE questions.user_id = ?
            ORDER BY questions.created_at DESC
            ");
            $stmt->bind_param("i", $user_id);

            $stmt->execute();
            $result = $stmt->get_result();
            $posts = $result->fetch_all(MYSQLI_ASSOC);

            echo json_encode([
                "success" => true,
                "posts" => $posts,
            ]);
        } else {
        echo json_encode([
            "success" => false,
            "error" => "Invalid user_id",
        ]);
    }
} catch (mysqli_sql_exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>