import db from "../firebaseConfig.js";
import { 
  doc,
  setDoc,
  addDoc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

class DBClient {
  async createDocWithId (collectionName, docId, data) {
    await setDoc(doc(db, collectionName, docId), data);
  }

  async createDoc (collectionName, data) {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef;
  }

  async getDocById (collectionName, docId) {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap;
  }

  getDocRef (collectionName, docId) {
    return doc(db, collectionName, docId);
  }

  async getAllDocs(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot;
  }

  getCollectionRef(collectionName) {
    const collectionRef = collection(db, collectionName);
    return collectionRef;
  }

  async updateDocument (collectionName, docId, data) {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  }

  async deleteDocument (collectionName, docId) {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  }
}

const dbClient = new DBClient();
export default dbClient;