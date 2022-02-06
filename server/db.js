import pkg from 'pg';
const { Pool } = pkg;

const credentials = {
  user: "pradic",
  password: "pero",
  host: "localhost",
  port: 5432,
  database: "postgres"
};

const pool = new Pool(credentials);

export default pool;