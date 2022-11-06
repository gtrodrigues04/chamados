import { useContext, useState } from 'react';
import logo from '../../assets/logo.png'
import './signUp.css'
import {  Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth'
import { toast } from 'react-toastify';

export default function SignUp() {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [valid, setValid] = useState(false)


  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e) {
   e.preventDefault();
   if (password !== repeat) {
    setValid(true);
    return toast.error('Senha não confere!')
   }
   if (nome !== '' && email !== '' && password !== '') {
    signUp(email, password, nome)
   }
  }


  return (
    <div className='container-center'>
      <div className='login'>
        <div className='logo-area'>
          <img src={logo} alt='Sistema Logo' />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Cadastrar</h1>
          <input type="text" placeholder='Seu nome' value={nome} onChange={e => setNome(e.target.value)} />
          <input type="text" placeholder='email@email.com' value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password"  placeholder='********' value={password} onChange={e => setPassword(e.target.value)}/>
          <input type="password"  placeholder='********' value={repeat} onChange={e => setRepeat(e.target.value)}/>
          <button type='submit'>
              {loadingAuth ? 'Carregando...' : 'Cadastrar'}
          </button>

        </form>
        
        <Link to="/">Já tem uma conta? Entre</Link>

      </div>
    </div>
  );
}



