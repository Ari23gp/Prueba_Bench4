import { initialPosts } from './data.js';
import { USE_FIREBASE, firebaseConfig } from './firebase.js';

const LOCAL_KEY = 'benchmark_posts_v3';

async function firebaseHelpers() {
  if (!USE_FIREBASE) return null;
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
  const { getFirestore, collection, addDoc, getDocs, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  return { db, collection, addDoc, getDocs, serverTimestamp };
}

export async function getPosts() {
  const fb = await firebaseHelpers();
  if (fb) {
    const snap = await fb.getDocs(fb.collection(fb.db, 'posts'));
    const firebasePosts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return [...initialPosts, ...firebasePosts];
  }
  const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  return [...initialPosts, ...local];
}

export async function addPost(post) {
  const cleanPost = { ...post, views:+post.views||0, likes:+post.likes||0, comments:+post.comments||0, reposts:+post.reposts||0, shares:+post.shares||0, saves:+post.saves||0 };
  const fb = await firebaseHelpers();
  if (fb) {
    await fb.addDoc(fb.collection(fb.db, 'posts'), { ...cleanPost, createdAt: fb.serverTimestamp() });
    return;
  }
  const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  local.push({ ...cleanPost, id: crypto.randomUUID(), source:'admin' });
  localStorage.setItem(LOCAL_KEY, JSON.stringify(local));
}
