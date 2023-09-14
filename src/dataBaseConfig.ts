import oracledb from 'oracledb';
require('dotenv').config();

const connectionConfig: oracledb.ConnectionAttributes = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  connectString: process.env.DATABASE_CONNECT,
};

export async function connect() {
  let connection: oracledb.Connection;
  try {
    connection = await oracledb.getConnection(connectionConfig);
    console.log('Conectado a Oracle Database');
    return connection;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function query(queryString: string, binds: any[] = []) {
  const connection = await connect();
  if (!connection) {
    return null;
  }
  let result: oracledb.Result<any>;
  try {
    result = await connection.execute(queryString, binds);
    await connection.commit()
    console.log('Consulta ejecutada correctamente');
  } catch (error) {
    await connection.rollback();
    console.error('ocurrio un error ejecutando la consulta \n' +
      queryString + '\n' +
      error
    );
    return null;
  } finally {
    try {
      await connection.close();
      console.log('Desconectado de Oracle Database');
    } catch (error) {
      console.error(error);
    }
  }
  return result.rows;
}