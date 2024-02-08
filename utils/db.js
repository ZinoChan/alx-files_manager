class DBClient {
  constructor() {
    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || "files_manager";

    this.url = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  isAlive() {
    return this.db.readyState === 1;
  }

  async nbUsers() {
    return this.db.collection("users").countDocuments();
  }

  async nbFiles() {
    return this.db.collection("files").countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
