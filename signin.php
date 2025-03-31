<?php
include 'db.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($id, $hashed_password);
    
    if ($stmt->num_rows > 0) {
        $stmt->fetch();
        if (password_verify($password, $hashed_password)) {
            $_SESSION['user_id'] = $id;
            header("Location: game.html"); // Redirect after login
            exit();
        } else {
            echo "Invalid email or password!";
        }
    } else {
        echo "Invalid email or password!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Signin</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="game-container">
        <h2>Signin</h2>
        <form method="POST">
            <input type="email" name="email" placeholder="Email" required><br>
            <input type="password" name="password" placeholder="Password" required><br>
            <button type="submit" class="answer-btn">Signin</button>
        </form>
        <p>Don't have an account? <a href="signup.php">Signup</a></p>
    </div>
</body>
</html>
