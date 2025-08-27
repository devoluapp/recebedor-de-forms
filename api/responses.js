import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}
const db = admin.firestore();

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).send("Unauthorized");
    }

    const idToken = authHeader.split("Bearer ")[1];
    await admin.auth().verifyIdToken(idToken);

    const snapshot = await db.collection("resposta").get();
    const responses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(responses);
  } catch (err) {
    console.error(err);
    return res.status(401).send("Unauthorized");
  }
}
