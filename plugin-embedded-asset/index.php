<?php
require('vendor/autoload.php');

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

// Should optimally be read from $_ENV with .env support
$secret = 'abc123';

// Valudate the ?jwt=... value added to the iframe src, the secret must match the one set in the plugin configuration
try {
    JWT::decode($_GET['jwt'] ?? null, new Key($secret, 'HS256'));
} catch (\Throwable $e) {
    http_response_code(401);
    exit;
}

?><!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="cache-control" content="no-store"/>
        <title>JWT protected plugin allowing insert/update/delete of embedded assets</title>
        <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
        <script type="module" src="js/main.js"></script>
        <style type="text/css">
            button[data-action="update"] {
                display: none;
            }

            body[data-current-asset] button[data-action="update"] {
                display: initial;
            }
            
            body[data-current-asset] button[data-action="insert"] {
                display: none;
            }
        </style>
    </head>
    <body>
        <p>JWT protected plugin allowing insert/update/delete of embedded assets</p>
        <div id="form">
            <div class="mb-3">
                <label class="form-label">Title</label>
                <input data-name="title" class="form-control" type="text" />
            </div>
            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea data-name="description" class="form-control" rows="3"></textarea>
            </div>
            <button data-action="insert" class="btn btn-primary">Insert</button>
            <button data-action="update" class="btn btn-primary">Update</button>
            <button data-action="delete" class="btn btn-primary">Delete</button>
        </div>
    </body>
</html>