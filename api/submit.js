import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}
const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    let data = {};
    if (req.headers["content-type"]?.includes("application/x-www-form-urlencoded")) {
      const bodyText = await new Promise(resolve => {
        let raw = "";
        req.on("data", chunk => (raw += chunk.toString()));
        req.on("end", () => resolve(raw));
      });
      data = Object.fromEntries(new URLSearchParams(bodyText));
    } else {
      data = req.body;
    }

    const docRef = await db.collection("resposta").add(data);
    return res.status(200).json({ id: docRef.id, data });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
}
