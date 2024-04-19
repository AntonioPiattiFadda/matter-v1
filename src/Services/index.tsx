import { db } from '@/../firebaseConfig';
import {
  CreateUser,
  Invoice,
  UpdateCompanyInfo,
  UpdatePayInvoice,
  User,
} from '@/types';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

export const getUserByEmail = async (email: string) => {
  const itemCollection = collection(db, 'users');

  const q = query(itemCollection, where('email', '==', email));

  const querySnapshot = await getDocs(q);

  let user = null;

  querySnapshot.forEach((doc) => {
    user = {
      id: doc.id,
      ...doc.data(),
    };
  });

  return user;
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const invoiceDoc = doc(db, 'users', userId);

    const invoiceSnapshot = await getDoc(invoiceDoc);

    if (invoiceSnapshot.exists()) {
      return {
        email: '',
        id: invoiceSnapshot.id,
        ...invoiceSnapshot.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    throw error;
  }
};

export const createUser = async (userData: CreateUser, userId: string) => {
  try {
    const userCollection = collection(db, 'users');

    const userRef = doc(userCollection, userId); // Crear referencia con el ID deseado

    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return;
    }

    await setDoc(userRef, userData); // Utilizar setDoc en lugar de addDoc

    return userId;
  } catch (error) {
    throw new Error('No se pudo crear el usuario');
  }
};

export const updateUser = async (
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateData: UpdateCompanyInfo & { [x: string]: any }
) => {
  try {
    const userDocRef = doc(db, 'users', userId);

    await updateDoc(userDocRef, updateData);

    return true;
  } catch (error) {
    console.error('Error al actualizar el usuario: ', error);
    throw new Error('No se pudo actualizar el usuario');
  }
};

export const getUserInvoices = async (userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);

    const invoiceCollectionRef = collection(userDocRef, 'invoices');

    const snapshot = await getDocs(invoiceCollectionRef);

    const invoices: {
      serialNumber: number;
      payDate: Date | null;
      status: string;
      companyName: string;
      toCompanyName: string;
      total: number;
      dueDate: Date;
      id: string;
    }[] = [];

    snapshot.forEach((doc) => {
      return invoices.push({
        serialNumber: 0,
        status: '',
        companyName: '',
        toCompanyName: '',
        dueDate: new Date(),
        payDate: null,
        total: 0,
        ...doc.data(),
        id: doc.id,
      });
    });

    return invoices;
  } catch (error) {
    console.error('Error al obtener las facturas del usuario: ', error);
    throw new Error('No se pudieron obtener las facturas del usuario');
  }
};

export const getInvoiceById = async (
  userId: string,
  invoiceId: string
): Promise<Invoice | null> => {
  try {
    const invoiceDoc = doc(db, 'users', userId, 'invoices', invoiceId);

    const invoiceSnapshot = await getDoc(invoiceDoc);

    if (invoiceSnapshot.exists()) {
      const invoiceData = {
        ...invoiceSnapshot.data(),
        id: invoiceSnapshot.id,
      };

      return invoiceData as Invoice;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener la factura:', error);
    throw error;
  }
};

export const createInvoice = async (invoiceData: Invoice, userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);

    const invoiceCollectionRef = collection(userDocRef, 'invoices');

    const newInvoiceRef = await addDoc(invoiceCollectionRef, invoiceData);

    return newInvoiceRef.id;
  } catch (error) {
    console.error('Error al crear la factura: ', error);
    throw new Error('No se pudo crear la factura');
  }
};
export const deleteInvoice = async (userId: string, invoiceId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);

    const invoiceCollectionRef = collection(userDocRef, 'invoices');

    const invoiceDocRef = doc(invoiceCollectionRef, invoiceId);

    await deleteDoc(invoiceDocRef);
    return invoiceId;
  } catch (error) {
    console.error('Error al eliminar la factura: ', error);
    throw new Error('No se pudo eliminar la factura');
  }
};

export const updateInvoice = async (
  userId: string,
  invoiceId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoiceData: UpdatePayInvoice & { [x: string]: any }
) => {
  try {
    const userDocRef = doc(db, 'users', userId);

    const invoiceCollectionRef = collection(userDocRef, 'invoices');

    const invoiceDocRef = doc(invoiceCollectionRef, invoiceId);

    await updateDoc(invoiceDocRef, invoiceData);

    return true;
  } catch (error) {
    console.error('Error al actualizar el invoice: ', error);
    throw new Error('No se pudo actualizar el invoice');
  }
};
