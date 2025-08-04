const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Função para validar email com critérios mais rigorosos
const validateEmail = (email) => {
    // Expressão regular mais completa para validação de email
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Critérios adicionais
    if (!re.test(email)) return false;
    
    // Verifica se o email não começa ou termina com ponto
    if (email.startsWith('.') || email.endsWith('.')) return false;
    
    // Verifica se não há pontos consecutivos
    if (email.includes('..')) return false;
    
    // Verifica se o domínio tem pelo menos 2 caracteres após o ponto
    const domain = email.split('@')[1];
    if (!domain || domain.split('.')[1].length < 2) return false;
    
    // Verifica se o tamanho total do email é razoável
    if (email.length > 254) return false;
    
    return true;
};

const employeeSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: validateEmail,
            message: 'Email inválido'
        }
    },
    senha: { 
        type: String, 
        required: true 
    },
    cargo: { 
        type: String, 
        enum: ['admin', 'operador'],
        required: true 
    }
}, {
    timestamps: true
});

// Middleware para criptografar a senha antes de salvar
employeeSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar senhas
employeeSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.senha);
};

module.exports = mongoose.model('Employee', employeeSchema); 