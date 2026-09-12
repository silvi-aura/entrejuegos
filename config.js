/**
 * ⚙️ CONFIGURACIÓN — este es el ÚNICO archivo que tenés que editar
 * para conectar la app a tu proyecto de Firebase.
 *
 * Dónde conseguir estos datos:
 * Firebase Console > ⚙️ Configuración del proyecto > "Tus apps" >
 * app web "Entrejuegos" > "Configuración del SDK" > "Config"
 */
const firebaseConfig = {
  apiKey: "PEGAR_AQUI",
  authDomain: "PEGAR_AQUI.firebaseapp.com",
  projectId: "PEGAR_AQUI",
  storageBucket: "PEGAR_AQUI.appspot.com",
  messagingSenderId: "PEGAR_AQUI",
  appId: "PEGAR_AQUI",
};

// Número de WhatsApp del negocio, con código de país y sin signos.
// Ejemplo Argentina (Rafaela, cód. área 3492): "5493492XXXXXX"
const WHATSAPP_NUMBER = "PEGAR_AQUI";

// Región donde desplegaste las Cloud Functions (ver LEEME.md).
const FUNCTIONS_REGION = "southamerica-east1";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const functionsClient = firebase.app().functions(FUNCTIONS_REGION);
