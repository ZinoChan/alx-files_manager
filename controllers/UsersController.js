import { createHash } from 'crypto';
import { ObjectID } from 'mongodb';
import redis from '../utils/redis';
import dbClient from '../utils/db';

class UsersController {
  async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: 'Missing email' });

    if (!password) return res.status(400).json({ error: 'Missing password' });

    try {
      const existingUser = await this.db.usersCollection.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Email already exists' });

      const hashedPassword = createHash('sha1').update(password).digest('hex');

      const newUser = await dbClient.usersCollection.insertOne({
        email,
        password: hashedPassword,
      });
      return res.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // eslint-disable-next-line consistent-return
  static async getMe(req, res) {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const userId = await redis.get(`auth_${token}`);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const users = dbClient.db.collection('users');
    const idObject = new ObjectID(userId);

    users.findOne({ _id: idObject }, (err, user) => {
      if (user) res.status(200).json({ id: userId, email: user.email });
      else res.status(401).json({ error: 'Unauthorized' });
    });
  }
}

export default UsersController;
