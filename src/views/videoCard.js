class VideoCard {
  render(data) {
    const { title, url } = data;
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TESTE</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
        }
        p {
            color: #666;
            margin-bottom: 1.5rem;
        }
        .url-link {
            display: inline-block;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 6px;
            transition: background-color 0.3s ease;
        }
        .url-link:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>

    <div class="card">
        <a href="${url}" class="url-link" target="_blank">${title}</a>
    </div>

</body>
</html>`;
  }
}

export default VideoCard;