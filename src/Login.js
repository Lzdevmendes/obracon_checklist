import React, { useState } from 'react';
import './Login.css';


function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de login
    if (email === 'lzmendestechdev@gmail.com' && password === '123456') {
      setError('');
      // Chama a função de callback passando os dados do usuário
      if (onLoginSuccess) {
        onLoginSuccess({ email, name: 'Luiz Felipe' });
      }
    } else {
      setError('Email ou senha inválidos.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="Logo da Empresa" className="login-logo" />
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
