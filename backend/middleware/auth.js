const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Доступ запрещен. Отсутствует токен." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: "Невалидный или просроченный токен." });
    }

    req.user = decodedUser;
    next();
  });
};

module.exports = authenticateToken;
