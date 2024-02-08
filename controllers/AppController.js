class AppController {
  constructor(db, redis) {
    this.db = db;
    this.redis = redis;
  }
  static getStatus(req, res) {
    if (this.redis.isAlive && this.db.isAlive()) {
      res.status(200).send({ redis: true, db: this.db.isAlive() });
    }
  }

  static async getStats(req, res) {
    try {
      const users = await this.db.nbUsers();
      const files = await this.db.nbFiles();
      res.status(200).send({ users, files });
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  }
}
