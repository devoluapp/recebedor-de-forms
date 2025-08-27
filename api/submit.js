import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}
const db = admin.firestore();

export default async function handler(req, res) {
  const allowedOrigin = "https://devoluapp.github.io";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");


  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // pega os dados enviados via x-www-form-urlencoded
  const { nome, email, ...rest } = req.body;

  // valida campos obrigatórios
  if (!nome || !email) {
    return res.status(400).json({ error: "Campos 'nome' e 'email' são obrigatórios" });
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
