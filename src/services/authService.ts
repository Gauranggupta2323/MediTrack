import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/db';
import { User, AuthResponse } from '@/types';

export class AuthService {
  private usersCollection = 'users';

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update the user's display name
      await updateProfile(firebaseUser, { displayName: name });

      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email: firebaseUser.email!,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, this.usersCollection, firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const user: User = {
        id: firebaseUser.uid,
        ...userData,
      };

      return {
        success: true,
        user,
        token: await firebaseUser.getIdToken(),
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, this.usersCollection, firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data();
      const user: User = {
        id: firebaseUser.uid,
        email: userData.email,
        name: userData.name,
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
      };

      return {
        success: true,
        user,
        token: await firebaseUser.getIdToken(),
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        unsubscribe();
        
        if (!firebaseUser) {
          resolve(null);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, this.usersCollection, firebaseUser.uid));
          
          if (!userDoc.exists()) {
            resolve(null);
            return;
          }

          const userData = userDoc.data();
          const user: User = {
            id: firebaseUser.uid,
            email: userData.email,
            name: userData.name,
            createdAt: userData.createdAt?.toDate() || new Date(),
            updatedAt: userData.updatedAt?.toDate() || new Date(),
          };

          resolve(user);
        } catch (error) {
          console.error('Error getting current user:', error);
          resolve(null);
        }
      });
    });
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      await setDoc(doc(db, this.usersCollection, userId), {
        ...updates,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, this.usersCollection, firebaseUser.uid));
        
        if (!userDoc.exists()) {
          callback(null);
          return;
        }

        const userData = userDoc.data();
        const user: User = {
          id: firebaseUser.uid,
          email: userData.email,
          name: userData.name,
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
        };

        callback(user);
      } catch (error) {
        console.error('Error in auth state change:', error);
        callback(null);
      }
    });
  }
}
