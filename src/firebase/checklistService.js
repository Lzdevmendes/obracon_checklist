import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

// Nome da coleção no Firestore
const COLLECTION_NAME = 'checklists';

/**
 * Salva um checklist no Firebase
 * @param {Object} checklistData - Dados do checklist
 * @returns {Promise<string>} - ID do documento criado
 */
export const saveChecklist = async (checklistData) => {
  try {
    const photoURLs = {};
    
    // Se há fotos, fazer upload para o Storage
    if (checklistData.fotos) {
      const timestamp = Date.now();
      const placa = checklistData.placa;
      
      // Upload de cada foto
      for (const [photoType, photoData] of Object.entries(checklistData.fotos)) {
        if (photoData) {
          const photoRef = ref(storage, `checklist-photos/${timestamp}_${placa}_${photoType}.jpg`);
          
          // Upload da foto (base64) para o Storage
          const snapshot = await uploadString(photoRef, photoData, 'data_url');
          photoURLs[photoType] = await getDownloadURL(snapshot.ref);
        }
      }
    }
    
    // Preparar dados para salvar no Firestore
    const dataToSave = {
      vehicleId: checklistData.vehicleId,
      placa: checklistData.placa,
      dataHora: checklistData.dataHora,
      observacoes: checklistData.observacoes,
      itensVerificados: checklistData.itensVerificados,
      fotosURLs: photoURLs, // URLs das fotos no Storage
      timestamp: serverTimestamp(), // Timestamp do servidor
      createdAt: new Date().toISOString() // Timestamp local para backup
    };
    
    // Salvar no Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), dataToSave);
    
    console.log('Checklist salvo com ID:', docRef.id);
    return docRef.id;
    
  } catch (error) {
    console.error('Erro ao salvar checklist:', error);
    throw new Error('Falha ao salvar checklist: ' + error.message);
  }
};

/**
 * Busca todos os checklists ordenados por data (mais recentes primeiro)
 * @returns {Promise<Array>} - Array de checklists
 */
export const getAllChecklists = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const checklists = [];
    
    querySnapshot.forEach((doc) => {
      checklists.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return checklists;
    
  } catch (error) {
    console.error('Erro ao buscar checklists:', error);
    throw new Error('Falha ao buscar checklists: ' + error.message);
  }
};

/**
 * Busca checklists por placa do veículo
 * @param {string} placa - Placa do veículo
 * @returns {Promise<Array>} - Array de checklists da placa
 */
export const getChecklistsByPlaca = async (placa) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('placa', '==', placa.toUpperCase()),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const checklists = [];
    
    querySnapshot.forEach((doc) => {
      checklists.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return checklists;
    
  } catch (error) {
    console.error('Erro ao buscar checklists por placa:', error);
    throw new Error('Falha ao buscar checklists por placa: ' + error.message);
  }
};

/**
 * Busca um checklist específico por ID
 * @param {string} checklistId - ID do checklist
 * @returns {Promise<Object>} - Dados do checklist
 */
export const getChecklistById = async (checklistId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, checklistId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Checklist não encontrado');
    }
    
  } catch (error) {
    console.error('Erro ao buscar checklist por ID:', error);
    throw new Error('Falha ao buscar checklist: ' + error.message);
  }
};

/**
 * Busca checklists de um período específico
 * @param {Date} startDate - Data inicial
 * @param {Date} endDate - Data final
 * @returns {Promise<Array>} - Array de checklists do período
 */
export const getChecklistsByDateRange = async (startDate, endDate) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('timestamp', '>=', startDate),
      where('timestamp', '<=', endDate),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const checklists = [];
    
    querySnapshot.forEach((doc) => {
      checklists.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return checklists;
    
  } catch (error) {
    console.error('Erro ao buscar checklists por período:', error);
    throw new Error('Falha ao buscar checklists por período: ' + error.message);
  }
};

/**
 * Conta o total de checklists
 * @returns {Promise<number>} - Número total de checklists
 */
export const getChecklistsCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.size;
    
  } catch (error) {
    console.error('Erro ao contar checklists:', error);
    throw new Error('Falha ao contar checklists: ' + error.message);
  }
};