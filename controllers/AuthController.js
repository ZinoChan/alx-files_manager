class AuthController {
  constructor(db, redisClient) {
    this.db = db;
    this.redisClient = redisClient;
  }
  async getConnect(req, res) {
    try {
      const user = req.user;
      const token = uuidv4();
      await this.redisClient.set(
        `auth_${token}`,
        user._id.toString(),
        "EX",
        60 * 60 * 24
      );
      return res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  }

  async getDiconnect(req, res) {
    try {
      const { "x-token": token } = req.headers;
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      const userId = await this.redisClient.get(`auth_${token}`);
      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      await this.redisClient.del(`auth_${token}`);
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  }
}
