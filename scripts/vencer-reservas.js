/**
 * Vence y libera automáticamente las reservas cuya seña no se pagó a
 * tiempo. Corre desde GitHub Actions (ver .github/workflows/vencer-reservas.yml),
 * no depende de que nadie tenga la app abierta.
 */
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const PENDIENTE = "PENDIENTE_SEÑA";
const VENCIDA = "VENCIDA";

function availabilityDocId(date, slotId, gameId) {
  return `${date}_${slotId}_${gameId}`;
}

async function main() {
  const now = admin.firestore.Timestamp.now();
  const vencidas = await db
    .collection("reservations")
    .where("status", "==", PENDIENTE)
    .where("expiresAt", "<=", now)
    .get();

  if (vencidas.empty) {
    console.log("No hay reservas vencidas para liberar.");
    return;
  }

  for (const doc of vencidas.docs) {
    const ref = doc.ref;
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists || snap.data().status !== PENDIENTE) return;
      const r = snap.data();
      const gameIds = r.gameIds || [r.gameId].filter(Boolean);

      for (const gid of gameIds) {
        const availRef = db.collection("availability").doc(availabilityDocId(r.date, r.slotId, gid));
        const availSnap = await tx.get(availRef);
        const current = availSnap.exists ? (availSnap.data().reservedCount || 0) : 0;
        tx.set(availRef, { reservedCount: Math.max(current - 1, 0), updatedAt: now }, { merge: true });
      }

      tx.update(ref, { status: VENCIDA, updatedAt: now });
    });
    console.log(`Reserva ${doc.id} vencida y liberada.`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
