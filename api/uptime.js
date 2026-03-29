module.exports = (req, res) => {
  const body = JSON.stringify({
    status:    'ok',
    service:   'jm-portfolio',
    timestamp: new Date().toISOString(),
  });
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).end(req.method === 'HEAD' ? '' : body);
};
