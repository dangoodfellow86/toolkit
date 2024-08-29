import { atom } from 'recoil';
import { firestore, auth } from '@/app/firebase';
import { query, collection, where, onSnapshot, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const overtimeListValue = atom({
    key: 'overtimeListValue',
    default: [],
     effects: [
    ({ setSelf }) => {
      const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          const overtimeCollectionRef = query(
            collection(firestore, "overtime"),
            where("userId", "==", user.uid)
          );

          const unsubscribeFromFirestore = onSnapshot(overtimeCollectionRef, (snapshot) => {
            const overtimeList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            console.log(overtimeList[0].id);
            setSelf(overtimeList);
          });
          
          // Cleanup function to unsubscribe when the atom is no longer in use
          return () => unsubscribeFromFirestore();
        }
      });

      // Cleanup function to unsubscribe from auth changes
      return () => unsubscribeFromAuth();
    },
  ],
});

