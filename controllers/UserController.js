import {createHash} from "crypto";
class UserController {
	constructor(db, redis) {
		this.db = db;
		this.redis = redis;
	}
	async register(req, res) {
		const {email, password} = req.body;
		if (!email) {
			res.status(400).send({error: "Missing email"});
			return;
		}
		if (!password) {
			res.status(400).send({error: "Missing password"});
			return;
		}

		const userExists = await this.db.usersCollection.findOne({email});
		if (userExists) {
			res.status(400).send({error: "Already exist"});
			return;
		}

		const hashedPassword = createHash('sha1').update(password).digest('hex');
		const user = await this.db.usersCollection.insertOne({email, password: hashedPassword});

		res.status(201).send({id: user._id, email: user.email});
	}
	async login(req, res) {
		// ...
	}
	async logout(req, res) {
		// ...
	}
}

export default UserController
