/**
 * MyJourney Firebase Database & Authentication Service
 * Complete integration with Google Firebase (Cloud Firestore, Auth & Realtime Database)
 * Project ID: apps-cafd4
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics, isSupported as isAnalyticsSupported, logEvent } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  remove, 
  onValue 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously, 
  signOut,
  updateProfile,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB07aLsjScN82efHh15w8V74fXNOkLo_v4",
  authDomain: "apps-cafd4.firebaseapp.com",
  projectId: "apps-cafd4",
  storageBucket: "apps-cafd4.firebasestorage.app",
  messagingSenderId: "536149741565",
  appId: "1:536149741565:web:d2409b2fe21aee2ba45394",
  measurementId: "G-BFB2QFSWV6"
};

// Initialize Firebase Core Instances
let app = null;
let firestore = null;
let realtimeDb = null;
let auth = null;
let analytics = null;
let isConnected = false;
let currentUser = null;
const authListeners = [];

try {
  // 1. App Initialization
  app = initializeApp(firebaseConfig);

  // 2. Cloud Firestore
  try {
    firestore = getFirestore(app);
  } catch (e) {
    console.warn('Firestore init note:', e);
  }

  // 3. Realtime Database
  try {
    realtimeDb = getDatabase(app);
  } catch (e) {
    console.warn('Realtime Database init note:', e);
  }

  // 4. Firebase Authentication
  try {
    auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
      currentUser = user;
      if (user) {
        console.log(`👤 MyJourney User Authenticated: ${user.email || user.displayName || user.uid}`);
        
        const userData = {
          uid: user.uid,
          email: user.email || 'passenger@myjourney.com',
          displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Passenger'),
          isAnonymous: user.isAnonymous
        };

        // Cache user info locally
        localStorage.setItem('myjourney_user', JSON.stringify(userData));

        // Save/update user profile in Cloud Firestore
        if (firestore && !user.isAnonymous) {
          try {
            const userRef = doc(firestore, 'users', user.uid);
            await setDoc(userRef, {
              ...userData,
              lastLoginAt: serverTimestamp()
            }, { merge: true });
          } catch (e) {}
        }

        notifyAuthListeners(userData);
      } else {
        localStorage.removeItem('myjourney_user');
        notifyAuthListeners(null);
      }
    });
  } catch (e) {
    console.warn('Auth init note:', e);
  }

  // 5. Firebase Analytics
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('📊 Firebase Analytics initialized for MyJourney');
    }
  }).catch((e) => {
    console.warn('Analytics initialization skipped:', e);
  });

  isConnected = true;
  console.log(`🔥 Firebase successfully initialized for MyJourney project: ${firebaseConfig.projectId}`);
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  isConnected = false;
}

function notifyAuthListeners(user) {
  authListeners.forEach((fn) => {
    try {
      fn(user);
    } catch (e) {
      console.error(e);
    }
  });
}

/**
 * Service API exposed globally to the MyJourney Application
 */
export const MyJourneyFirebase = {
  app,
  db: firestore,
  firestore,
  realtimeDb,
  auth,
  analytics,
  config: firebaseConfig,
  isConnected: () => isConnected,
  getUser: () => {
    if (currentUser) {
      return {
        uid: currentUser.uid,
        email: currentUser.email || 'passenger@myjourney.com',
        displayName: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'Passenger'),
        isAnonymous: currentUser.isAnonymous
      };
    }
    try {
      const cached = localStorage.getItem('myjourney_user');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  },

  onAuthChange(callback) {
    if (typeof callback === 'function') {
      authListeners.push(callback);
      // Immediately invoke with current state
      callback(this.getUser());
    }
  },

  /**
   * Sign In with Email & Password
   */
  async signIn(email, password) {
    if (!auth) {
      // Local fallback simulation
      const fallbackUser = {
        uid: 'usr_' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        isAnonymous: false
      };
      localStorage.setItem('myjourney_user', JSON.stringify(fallbackUser));
      notifyAuthListeners(fallbackUser);
      return { success: true, user: fallbackUser };
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userData = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || email.split('@')[0],
        isAnonymous: false
      };
      localStorage.setItem('myjourney_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Sign In Error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Sign Up / Create Account with Email & Password
   */
  async signUp(email, password, displayName = '') {
    if (!auth) {
      const fallbackUser = {
        uid: 'usr_' + Date.now(),
        email: email,
        displayName: displayName || email.split('@')[0],
        isAnonymous: false
      };
      localStorage.setItem('myjourney_user', JSON.stringify(fallbackUser));
      notifyAuthListeners(fallbackUser);
      return { success: true, user: fallbackUser };
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      const userData = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: displayName || email.split('@')[0],
        isAnonymous: false
      };
      localStorage.setItem('myjourney_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Sign Up Error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Sign In with Google Popup
   */
  async signInWithGoogle() {
    if (!auth) return { success: false, error: 'Firebase Auth is not available' };
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const userData = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || 'Google Passenger',
        photoURL: cred.user.photoURL,
        isAnonymous: false
      };
      localStorage.setItem('myjourney_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Google Sign In Error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fast Demo / Guest Login
   */
  async signInAsGuest(name = 'Guest Traveler') {
    const guestUser = {
      uid: 'guest_' + Math.floor(100000 + Math.random() * 900000),
      email: 'traveler@myjourney.com',
      displayName: name,
      isAnonymous: true
    };

    localStorage.setItem('myjourney_user', JSON.stringify(guestUser));
    notifyAuthListeners(guestUser);

    if (auth) {
      try {
        await signInAnonymously(auth);
      } catch (e) {}
    }

    return { success: true, user: guestUser };
  },

  /**
   * Sign Out
   */
  async signOut() {
    localStorage.removeItem('myjourney_user');
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {}
    }
    notifyAuthListeners(null);
    return { success: true };
  },

  /**
   * Save a booking record into Cloud Firestore & Realtime Database
   * Document/Node key: booking.pnr
   */
  async saveBooking(booking) {
    let savedToCloud = false;
    const user = this.getUser();
    const cleanPayload = {
      ...booking,
      userId: user ? user.uid : 'guest',
      userEmail: user ? user.email : booking.contact?.email,
      syncedAt: new Date().toISOString()
    };

    // 1. Save to Cloud Firestore
    if (firestore) {
      try {
        const docRef = doc(firestore, 'bookings', booking.pnr);
        await setDoc(docRef, {
          ...cleanPayload,
          cloudTimestamp: serverTimestamp()
        }, { merge: true });
        savedToCloud = true;
        console.log(`✅ [Firebase Firestore] Booking ${booking.pnr} saved to collection 'bookings'.`);
      } catch (err) {
        console.warn('Firestore save note:', err.message);
      }
    }

    // 2. Dual-save to Realtime Database
    if (realtimeDb) {
      try {
        const dbRef = ref(realtimeDb, `bookings/${booking.pnr}`);
        await set(dbRef, cleanPayload);
        savedToCloud = true;
        console.log(`✅ [Firebase Realtime DB] Booking ${booking.pnr} saved to path /bookings/${booking.pnr}.`);
      } catch (err) {
        console.warn('Realtime DB save note:', err.message);
      }
    }

    // 3. Log Analytics Event
    if (analytics) {
      try {
        logEvent(analytics, 'purchase', {
          transaction_id: booking.pnr,
          value: booking.amountPaid,
          currency: booking.currency || 'USD',
          items: [{
            item_id: booking.busNumber,
            item_name: `${booking.fromCity} to ${booking.toCity} (${booking.operator})`,
            quantity: booking.seats.length
          }]
        });
      } catch (e) {}
    }

    return { success: savedToCloud, mode: savedToCloud ? 'cloud' : 'local', id: booking.pnr };
  },

  /**
   * Fetch all bookings from Firebase
   */
  async getAllBookings() {
    if (firestore) {
      try {
        const bookingsCol = collection(firestore, 'bookings');
        const snapshot = await getDocs(bookingsCol);
        const bookings = [];
        snapshot.forEach((docSnap) => {
          bookings.push(docSnap.data());
        });
        if (bookings.length > 0) {
          return bookings;
        }
      } catch (e) {}
    }

    if (realtimeDb) {
      try {
        const dbRef = ref(realtimeDb, 'bookings');
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          return Object.values(snapshot.val());
        }
      } catch (e) {}
    }

    return [];
  },

  /**
   * Subscribe to real-time updates for bookings
   */
  subscribeToBookings(onUpdate) {
    if (typeof onUpdate !== 'function') return () => {};

    if (firestore) {
      try {
        const bookingsCol = collection(firestore, 'bookings');
        const unsubFirestore = onSnapshot(bookingsCol, (snapshot) => {
          const bookings = [];
          snapshot.forEach((docSnap) => {
            bookings.push(docSnap.data());
          });
          if (bookings.length > 0) {
            onUpdate(bookings);
          }
        }, (err) => {});

        return unsubFirestore;
      } catch (e) {}
    }

    if (realtimeDb) {
      try {
        const dbRef = ref(realtimeDb, 'bookings');
        const unsubRtdb = onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            onUpdate(Object.values(snapshot.val()));
          }
        }, (err) => {});

        return () => unsubRtdb();
      } catch (e) {}
    }

    return () => {};
  },

  /**
   * Delete or Cancel a booking in Firebase
   */
  async deleteBooking(pnr) {
    let deleted = false;

    if (firestore) {
      try {
        const docRef = doc(firestore, 'bookings', pnr);
        await deleteDoc(docRef);
        deleted = true;
      } catch (e) {}
    }

    if (realtimeDb) {
      try {
        const dbRef = ref(realtimeDb, `bookings/${pnr}`);
        await remove(dbRef);
        deleted = true;
      } catch (e) {}
    }

    return { success: deleted };
  },

  /**
   * Track custom user activity via Firebase Analytics
   */
  trackEvent(eventName, params = {}) {
    if (analytics) {
      try {
        logEvent(analytics, eventName, params);
      } catch (e) {}
    }
  }
};

// Expose on window for global access
window.MyJourneyFirebase = MyJourneyFirebase;
window.NexaBusFirebase = MyJourneyFirebase; // backward compat

// Update UI Badge when ready
function updateFirebaseBadge() {
  const badge = document.getElementById('firebaseStatusBadge');
  if (badge) {
    if (isConnected) {
      badge.innerHTML = `<span class="fb-dot fb-dot-online"></span><span class="fb-text"><i class="fa-solid fa-cloud"></i> Firebase Connected</span>`;
      badge.title = `Firebase Active: Project ID: ${firebaseConfig.projectId} (Cloud Firestore & Realtime DB)`;
      badge.classList.add('online');
      badge.classList.remove('offline');
    } else {
      badge.innerHTML = `<span class="fb-dot fb-dot-offline"></span><span class="fb-text">Firebase Offline</span>`;
      badge.classList.add('offline');
      badge.classList.remove('online');
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateFirebaseBadge);
} else {
  updateFirebaseBadge();
}

export default MyJourneyFirebase;
