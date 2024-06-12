import { PoolConnection, Query,createPool,Pool } from 'mysql2/promise';
import { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } from './config';

export const pool: Pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: 45572
});

export async function query(queryString: string, binds: any[] = []): Promise<any[] | null> {
  let connection: PoolConnection | null = null;
  try {
    connection = await pool.getConnection();
    const [rows]:any[] = await connection.query(queryString, binds);
    connection.commit();
    console.log('Consulta ejecutada correctamente');
    return rows;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error(`Ocurrió un error ejecutando la consulta: \n${queryString}\n${error}`);
    return null;
  } finally {
    if (connection) {
      try {
        connection.release(); // Liberar la conexión al grupo de conexiones
      } catch (error) {
        console.error('Error al liberar la conexión:', error);
      }
    }
  }
}
