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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/db';
import { Medication, MedicationLog } from '@/types';

export class MedicationService {
  private medicationsCollection = 'medications';
  private logsCollection = 'medicationLogs';

  // Medication CRUD operations
  async createMedication(medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.medicationsCollection), {
        ...medication,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating medication:', error);
      throw new Error('Failed to create medication');
    }
  }

  async getUserMedications(userId: string): Promise<Medication[]> {
    try {
      const q = query(
        collection(db, this.medicationsCollection),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Medication[];
    } catch (error) {
      console.error('Error fetching medications:', error);
      throw new Error('Failed to fetch medications');
    }
  }

  async getMedication(id: string): Promise<Medication | null> {
    try {
      const docRef = doc(db, this.medicationsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as Medication;
      }
      return null;
    } catch (error) {
      console.error('Error fetching medication:', error);
      throw new Error('Failed to fetch medication');
    }
  }

  async updateMedication(id: string, updates: Partial<Medication>): Promise<void> {
    try {
      const docRef = doc(db, this.medicationsCollection, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating medication:', error);
      throw new Error('Failed to update medication');
    }
  }

  async deleteMedication(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.medicationsCollection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw new Error('Failed to delete medication');
    }
  }

  // Medication Log operations
  async createMedicationLog(log: Omit<MedicationLog, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.logsCollection), {
        ...log,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating medication log:', error);
      throw new Error('Failed to create medication log');
    }
  }

  async getUserMedicationLogs(userId: string, limitCount: number = 100): Promise<MedicationLog[]> {
    try {
      const q = query(
        collection(db, this.logsCollection),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        orderBy('scheduledTime', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as MedicationLog[];
    } catch (error) {
      console.error('Error fetching medication logs:', error);
      throw new Error('Failed to fetch medication logs');
    }
  }

  async getMedicationLogsByDate(userId: string, date: string): Promise<MedicationLog[]> {
    try {
      const q = query(
        collection(db, this.logsCollection),
        where('userId', '==', userId),
        where('date', '==', date),
        orderBy('scheduledTime', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as MedicationLog[];
    } catch (error) {
      console.error('Error fetching medication logs by date:', error);
      throw new Error('Failed to fetch medication logs by date');
    }
  }

  async updateMedicationLog(id: string, updates: Partial<MedicationLog>): Promise<void> {
    try {
      const docRef = doc(db, this.logsCollection, id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating medication log:', error);
      throw new Error('Failed to update medication log');
    }
  }

  async getActiveMedications(userId: string): Promise<Medication[]> {
    try {
      const q = query(
        collection(db, this.medicationsCollection),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Medication[];
    } catch (error) {
      console.error('Error fetching active medications:', error);
      throw new Error('Failed to fetch active medications');
    }
  }
}
