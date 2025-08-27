export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body; // JSON do formulário
    const docRef = await admin.firestore().collection("resposta").add(data);
    res.status(200).json({ id: docRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar dados" });
  }
}

