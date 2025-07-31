<?php
    $servername = getenv('DB_HOST'); // e.g. gateway01.us-west-2.aws.tidbcloud.com
    $username = getenv('DB_USER');
    $password = getenv('DB_PASS');
    $dbname = getenv('DB_NAME');

    $conn = mysqli_init();

    // Enable SSL
    mysqli_ssl_set($conn, NULL, NULL, "/app/isrgrootx1.pem", NULL, NULL);

    // Then connect
    $conn->real_connect($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        echo json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]);
        exit();
    }
?>