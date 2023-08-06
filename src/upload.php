<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $targetDir = 'https://wendy-kate.github.io/personaldairy/img/';
  $targetFile = $targetDir . basename($_FILES['image']['name']);

  if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
    // Image uploaded successfully
    http_response_code(200);
  } else {
    // Error occurred while uploading the image
    http_response_code(500);
  }
}
?>
