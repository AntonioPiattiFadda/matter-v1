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

export const getUserEmail = async (id: string) => {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const userData = docSnap.data();
    return userData.email;
  } else {
    return null; // Opcional: manejar el caso cuando el usuario no existe
  }
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

export const sendEmail = async (email: string) => {
  const message = {
    to: [email],
    message: {
      subject: 'Great news! Your invoice was paid!',
      html: `<html>
        <head>
          <style>
            body {
              font-family: 'Inter', sans-serif;
              background-color: #f0f0f0;
            }
            .container {
              width: 514px;
              margin: 5px;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              border: 1px solid #e5e7eb;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              align-items: center;
            }
            h1 {
              color: #0F172A;
              font-size: 18px;
              font-weight: 600;
            }
            p{
              color: #64748B;
              font-size: 14px;
              font-weight: 400;

            }
            .check {
              width: 70px;
              height: 70px;
            }
            .matter {
              width: 100px;
              height: 23px;
            }
          </style>
        </head>
        <body>
          <div class="container">
          <img class="check" src="https://i.ibb.co/vXGrfWx/Checkmark-2.png" alt="Checkmark-2" border="0">     
          <h1>Great news! Your invoice was paid!</h1>
          <p>See the details in your account.</p>
          
          <img  class="matter"  src="https://i.ibb.co/7NH6LNk/V2-Matter-Logo-SVG-Black-1.png" alt="V2-Matter-Logo-SVG-Black-1" border="0">


          </div>
        </body>
      </html>`,
      text: 'This is',
    },
  };

  try {
    const mailCollection = collection(db, 'mail');

    const mailRef = doc(mailCollection);

    await setDoc(mailRef, message);

    return mailRef;
  } catch (error) {
    throw new Error('No se pudo crear el mail');
  }
};
