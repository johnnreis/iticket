import * as mysql from "mysql2/promise";

export async function createConnection() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "itickets",
      port: 3306,
    });
    console.log("Conexão estabelecida com sucesso!");
    return connection;
  } catch (error) {
    console.error("Erro ao conectar:", error);
    throw error;
  }
}
