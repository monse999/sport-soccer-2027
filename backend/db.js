import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn(
      "⚠️ No se definió MONGO_URI en las variables de entorno. El backend no podrá conectarse a MongoDB."
    );
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
  }
}
