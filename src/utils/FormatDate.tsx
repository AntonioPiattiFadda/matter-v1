import { Timestamp } from 'firebase/firestore';

export const formatDate = (dateToFormat: Timestamp | Date | string | null) => {
  if (dateToFormat instanceof Timestamp) {
    const { seconds } = dateToFormat;
    const date = new Date(seconds * 1000); // Convertir segundos a milisegundos

    // Obtener los componentes de la fecha
    const month = date.getMonth() + 1; // Los meses son indexados desde 0
    const day = date.getDate();
    const year = date.getFullYear();

    // Construir la cadena con el formato MM/DD/YYYY
    const formattedDate = `${month.toString().padStart(2, '0')}/${day
      .toString()
      .padStart(2, '0')}/${year}`;
    return formattedDate;
  }
  if (!dateToFormat) {
    return null;
  }
  return dateToFormat;
};
