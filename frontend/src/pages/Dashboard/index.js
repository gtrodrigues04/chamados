import { useEffect, useState } from "react"
import './dashboard.css'
import Header from "../../components/Header";
import Title from "../../components/Title";
import Modal from '../../components/Modal'
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

import firebase from '../../services/firebaseConnection';

export default function Dashboard() {

  const listRef = firebase.firestore().collection('chamados').orderBy('created', 'asc');

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

 useEffect(() => {
    return () => {
      loadChamados();

      setLoadingMore(false);
    }
  }, [])

  async function loadChamados() {
    await listRef.limit(5)
    .get()
    .then((snapshot) => {
      updateState(snapshot)
    })
    .catch((err) => {
      console.error(err);
      setLoadingMore(false);
    })

    setLoading(false);
  }

  async function handleMore() {
    let verificou = false; 
    await listRef.startAfter(lastDocs).limit(5).get().then((snapshot) => {
      if(snapshot.docs.length > 0 ) {
        verificou = true;
        return updateState(snapshot)
      }
    })

    if (!verificou) {
      await listRef.startAt(0).limit(5).get().then((snapshot) => {
        return updateState(snapshot);
      })
    }

  }

  async function updateState(snapshot) {
    setChamados([]);
    const isCollectionEmpty = snapshot.size === 0;

    if(!isCollectionEmpty) {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento
        })
      })

      const lastDoc = snapshot.docs[snapshot.docs.length - 1]; // pegando o ultumo documento

      setChamados(chamados => [...chamados, ...lista]);
      setLastDocs(lastDoc)

    } else {
      setIsEmpty(true);
    }
  }

  function togglePostModal(item) {
    setShowPostModal(!showPostModal)

    setDetail(item);
  }


  if (loadingMore) {
    return(
      <div>
        <Header />

        <div className="content">
          <FiMessageSquare size={25} />
        </div>

        <div className="container dashboard">
          <span>Buscando chamados...</span>
        </div>
      </div>
    )
  } else {
  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Atendimentos">
          <FiMessageSquare size={25}/>
        </Title>
        
        {!loading && chamados.length === 0 ? (
            <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>
  
            <Link to="/new" className="new">
              <FiPlus size={25} color="#fff" />
              Novo chamado
            </Link>
          </div>
        ) : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#fff" />
              Novo chamado
            </Link>
            <table>
              <thead>
                <tr key="">
                  <th scope="col">Cliente</th>
                  <th scope="col">Assunto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {chamados.map((item, index) => {
                  return(
                    <tr key={index}>
                      <td data-label="Cliente">{item.cliente}</td>
                      <td data-label="Assunto">{item.assunto}</td>
                      <td data-label="Status">
                        <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>{item.status}</span>
                      </td>
                      <td data-label="Cadastrado">{item.createdFormated}</td>
                      <td data-label="#">
                        <button className="action" style={{backgroundColor: '#3583f6'}} onClick={() => togglePostModal(item)}>
                          <FiSearch color="#FFF" size={17} />
                        </button>
                        <Link className="action" style={{backgroundColor: '#f6a935'}} to={`/new/${item.id}`}>
                          <FiEdit2 size={17} />
                        </Link>
                      </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
            {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando dados...</h3>}
            {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}
          </>
        )}
      </div>

      {showPostModal && (
        <Modal conteudo={detail} close={togglePostModal} />
      )}
    </div>
  )
  }
}