import { Timestamp } from 'firebase/firestore';

export const compareDates = (date1: Timestamp): boolean => {
  const timestamp1 = date1.seconds * 1000 + date1.nanoseconds / 1000000;

  const timestamp2 = new Date().getTime();

  if (timestamp1 > timestamp2) {
    return false;
  } else {
    return true;
  }
};
