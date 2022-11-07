import { useState, useEffect, useContext } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { toast } from 'react-toastify'

import firebase from '../../services/firebaseConnection'
import { AuthContext } from '../../contexts/auth'

import './new.css'

import { FiPlusCircle } from 'react-icons/fi'
import { useHistory, useParams } from 'react-router-dom'

export default function New() {
  const hist = useHistory();
  const { id } = useParams();
  
  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);

  const [assunto, setAssunto] = useState();
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');

  const [idCustomer, setIdCustomer] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function loadCustomers() {
      await firebase.firestore().collection('customers')
      .get()
      .then((snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia
          })

          if (lista.length === 0) {
            setCustomers([{id: 1, nomeFantasia: ''}])
            setLoadCustomers(false);
            return;
          }

          setCustomers(lista);
          setLoadCustomers(false);

          if(id) {
            loadId(lista);
          }
        })
      })
      .catch((error) => {
        setLoadCustomers(false);

        setCustomers([{id: 1, nomeFantasia: ''}])
      })
    }

    loadCustomers();
  }, [])

  async function loadId(lista) {
    await firebase.firestore().collection('chamados').doc(id).get().then((snapshot) => {
      setAssunto(snapshot.data().assunto);
      setStatus(snapshot.data().status);
      setComplemento(snapshot.data().complemento);

      let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
      setCustomerSelected(index);
      setIdCustomer(true);
    }).catch((err) => {
      console.log('erro no id passado', err)
      setIdCustomer(false);
    })
  }

  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value)
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (idCustomer) {
      console.log(customers[customerSelected].nomeFantasia, 'nome fantasia');
      console.log(customers[customerSelected].id, 'id cliente');
      console.log(assunto, 'assunto');
      console.log(status, 'status')
      console.log(complemento, 'complemento');
      console.log(user.uid, 'id usuario');
      await firebase.firestore().collection('chamados').doc(id).update({
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
      })
      .then(() => {
        toast.success('Chamado editado com sucesso.')
        setCustomerSelected(0);
        setComplemento('');
        hist.push('/dashboard');
      }).catch((err) => {
        toast.error('Ops, erro ao registrar, tente mais tarde.')
      })

      return;
    }

    await firebase.firestore().collection('chamados')
    .add({
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid
    }).then(() => {
      toast.success('Chamado criado com sucesso');
      setCustomerSelected(0)
      setComplemento('');
      hist.push('/dashboard');
    }).catch((err) => {
      toast.error('Ops, erro ao registrar, tente mais tarde.')
    })
  }

  function handleChangeCustomers(e) {
    setCustomerSelected(e.target.value);
  }


  return (
    <div>
      <Header />

      <div className='content'>
        <Title name="Novo Chamado">
          <FiPlusCircle size={25} />
        </Title>

        <div className='container'>
          <form className='form-profile' onSubmit={handleRegister}>
            <label>Cliente</label>

            {loadCustomers ? (
              <input type="text" disabled={true} value="Carregando clientes..." />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomers}>
              {
                customers.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.nomeFantasia}
                    </option>
                  )
                })
              } 
            </select>
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte" key={1}>Suporte</option>
              <option value="Financeiro" key={2}>Financeiro</option>
              <option value="Comercial" key={3}>Comercial</option>
            </select>

            <label>Status</label>
            <div className='status'>
              <input type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === 'Aberto'} />
              <span>Em aberto</span>

              <input type="radio"
                name="radio"
                value="Progresso" 
                onChange={handleOptionChange}
                checked={status === 'Progresso'} />
              <span>Progresso</span>

              <input type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={status === 'Atendido'} />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema"
              value={complemento}
              onChange={ e => setComplemento(e.target.value)}
              />

              <button type="submit">Registrar</button>
          </form>
        </div>
      </div>

    </div>
  )
}