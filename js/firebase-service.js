/**
 * NexaBus Firebase Database Service
 * Complete integration with Google Firebase (Cloud Firestore & Realtime Database)
 * Project ID: apps-cafd4
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics, isSupported as isAnalyticsSupported, logEvent } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
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
  signInAnonymously, 
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
    onAuthStateChanged(auth, (user) => {
      currentUser = user;
      if (user) {
        console.log(`👤 Firebase User Authenticated: ${user.uid}`);
      }
    });

    // Sign in anonymously for secure rule evaluation if enabled
    signInAnonymously(auth).catch((err) => {
      console.log('Anonymous auth note (unauthenticated access is active):', err.message);
    });
  } catch (e) {
    console.warn('Auth init note:', e);
  }

  // 5. Firebase Analytics
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('📊 Firebase Analytics initialized for NexaBus');
    }
  }).catch((e) => {
    console.warn('Analytics initialization skipped:', e);
  });

  isConnected = true;
  console.log(`🔥 Firebase successfully initialized for project: ${firebaseConfig.projectId}`);
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  isConnected = false;
}

/**
 * Service API exposed globally to the NexaBus Application
 */
export const NexaBusFirebase = {
  app,
  db: firestore,
  firestore,
  realtimeDb,
  auth,
  analytics,
  config: firebaseConfig,
  isConnected: () => isConnected,
  getUser: () => currentUser,

  /**
   * Save a booking record into Cloud Firestore & Realtime Database
   * Document/Node key: booking.pnr
   */
  async saveBooking(booking) {
    let savedToCloud = false;
    const cleanPayload = {
      ...booking,
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
    // Attempt Firestore first
    if (firestore) {
      try {
        const bookingsCol = collection(firestore, 'bookings');
        const snapshot = await getDocs(bookingsCol);
        const bookings = [];
        snapshot.forEach((docSnap) => {
          bookings.push(docSnap.data());
        });
        if (bookings.length > 0) {
          console.log(`📥 [Firebase Firestore] Loaded ${bookings.length} bookings.`);
          return bookings;
        }
      } catch (e) {
        console.warn('Firestore fetch note:', e.message);
      }
    }

    // Fallback / Try Realtime Database
    if (realtimeDb) {
      try {
        const dbRef = ref(realtimeDb, 'bookings');
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list = Object.values(val);
          console.log(`📥 [Firebase Realtime DB] Loaded ${list.length} bookings.`);
          return list;
        }
      } catch (e) {
        console.warn('Realtime DB fetch note:', e.message);
      }
    }

    return [];
  },

  /**
   * Subscribe to real-time updates for bookings
   */
  subscribeToBookings(onUpdate) {
    if (typeof onUpdate !== 'function') return () => {};

    // Subscribe via Firestore
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
        }, (err) => {
          console.warn('Firestore realtime listener note:', err.message);
        });

        return unsubFirestore;
      } catch (e) {}
    }

    // Subscribe via Realtime Database
    if (realtimeDb) {
      try {
        const dbRef = ref(realtimeDb, 'bookings');
        const unsubRtdb = onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            const list = Object.values(snapshot.val());
            onUpdate(list);
          }
        }, (err) => {
          console.warn('Realtime DB listener note:', err.message);
        });

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

    console.log(`🗑️ [Firebase Cloud DB] Deleted booking ${pnr}.`);
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

// Bind globally for access by NexaBus scripts
window.NexaBusFirebase = NexaBusFirebase;

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

export default NexaBusFirebase;
