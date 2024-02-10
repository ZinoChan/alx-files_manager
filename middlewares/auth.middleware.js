class AuthMiddleware {
  constructor(db) {
    this.db = db;
  }
  static async authenticate(req, res, next) {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Basic ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const encoded = token.slice("Basic ".length);
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const [email, password] = decoded.split(":");
      const hashedPassword = createHash("sha1").update(password).digest("hex");

      const user = await this.db.usersCollection.findOne({
        email,
        password: hashedPassword,
      });
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
}


export default AuthMiddleware;
