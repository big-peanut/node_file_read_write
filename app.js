const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    let oldMessage = ''; 

    
    if (fs.existsSync('message.txt')) {
      oldMessage = fs.readFileSync('message.txt', 'utf8').trim();
    }

    res.write('<html>');
    res.write('<head><title>ENTER THE MESSAGE</title></head>');
    res.write('<body>');

    // Display the old message
    if (oldMessage !== '') {
      res.write(`<p>${oldMessage}</p>`);
    }

    res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">SEND</button></form>');
    res.write('</body>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const msg = parsedBody.split('=')[1];
      fs.writeFileSync('message.txt', msg); // Replace the old message with the new message in the file
    });
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>WELCOME</title></head>');
  res.write('<body><h1>WELCOME EVERYONE</h1></body>');
  res.write('</html>');
  res.end();
});

server.listen(4000);
