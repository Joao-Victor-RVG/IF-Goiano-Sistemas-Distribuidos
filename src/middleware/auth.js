const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta';

// Middleware para verificar se o usuário está autenticado
const auth = (req, res, next) => {
    console.log('Headers recebidos:', req.headers);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token extraído:', token);

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token decodificado:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};

// Middleware para verificar se o usuário é admin
const adminOnly = (req, res, next) => {
    console.log('Verificando cargo do usuário:', req.user);
    
    if (req.user.cargo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
    }
    next();
};

module.exports = { auth, adminOnly, JWT_SECRET }; 