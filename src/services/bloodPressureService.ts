import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/db';
import { BloodPressureReading } from '@/types';

export class BloodPressureService {
  private collectionName = 'bloodPressureReadings';

  async createReading(reading: Omit<BloodPressureReading, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...reading,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating blood pressure reading:', error);
      throw new Error('Failed to create blood pressure reading');
    }
  }

  async getUserReadings(userId: string, limitCount: number = 50): Promise<BloodPressureReading[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        orderBy('time', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as BloodPressureReading[];
    } catch (error) {
      console.error('Error fetching blood pressure readings:', error);
      throw new Error('Failed to fetch blood pressure readings');
    }
  }

  async getReading(id: string): Promise<BloodPressureReading | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        } as BloodPressureReading;
      }
      return null;
    } catch (error) {
      console.error('Error fetching blood pressure reading:', error);
      throw new Error('Failed to fetch blood pressure reading');
    }
  }

  async updateReading(id: string, updates: Partial<BloodPressureReading>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating blood pressure reading:', error);
      throw new Error('Failed to update blood pressure reading');
    }
  }

  async deleteReading(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting blood pressure reading:', error);
      throw new Error('Failed to delete blood pressure reading');
    }
  }

  async getReadingsByDateRange(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<BloodPressureReading[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'desc'),
        orderBy('time', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as BloodPressureReading[];
    } catch (error) {
      console.error('Error fetching readings by date range:', error);
      throw new Error('Failed to fetch readings by date range');
    }
  }
}
