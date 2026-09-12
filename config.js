/**
 * ⚙️ CONFIGURACIÓN — este es el ÚNICO archivo que tenés que editar
 * para conectar la app a tu proyecto de Firebase.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCJD5tnTxQZ2yyykHYK6ML8DGX6_FmwNyk",
  authDomain: "entrejuegos-eventos.firebaseapp.com",
  projectId: "entrejuegos-eventos",
  storageBucket: "entrejuegos-eventos.firebasestorage.app",
  messagingSenderId: "985423172561",
  appId: "1:985423172561:web:26a98acb466a26437986f0",
};

// Número de WhatsApp del negocio, con código de país y sin signos.
const WHATSAPP_NUMBER = "5493492275948";

// Región donde desplegaste las Cloud Functions (ver LEEME.md).
const FUNCTIONS_REGION = "southamerica-east1";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const functionsClient = firebase.app().functions(FUNCTIONS_REGION);
