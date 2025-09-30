import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, addDoc, orderBy, limit } from "firebase/firestore";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "movie-app-d0273.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "movie-app-d0273.firebasestorage.app",
  messagingSenderId: "100622052501",
  appId: "1:100622052501:web:e759b18a644439dbe4bf9c",
  measurementId: "G-RXS3PCWVDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Feature for trending movies section
export const updateSearchCount = async (searchTerm, movie) => {
    try {
      const metricCollection = collection(db,'metrics');
    const q = query(metricCollection, where("movie_id", "==", movie.id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty && querySnapshot.docs[0].data().movie_id === movie.id) {
      // Document exists , increase count
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        count: querySnapshot.docs[0].data().count + 1,
      });
    } else {
      // Document doesn't exist, create new
      await addDoc(metricCollection, {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const metricCollection = collection(db, "metrics");
    const q = query(metricCollection, orderBy("count", "desc"), limit(10));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(error);
  }
};

