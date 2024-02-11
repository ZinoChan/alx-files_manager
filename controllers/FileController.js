class FileController {
	constructor(db) {
		this.db = db;
	}
  async upload(req, res) {

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const userId = req.user._id;

    const { name, type, parentId = 0, isPublic = false, data } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    }
    if (!type || !["folder", "file", "image"].includes(type)) {
      return res.status(400).json({ error: "Missing type or invalid type" });
    }

    if (type !== "folder" && !data) {
      return res.status(400).json({ error: "Missing data" });
    }

    if (parentId !== 0) {
      const parent = await this.db.filesCollection.findOne({ _id: parentId });
      if (!parent) return res.status(400).json({ error: "Parent not found" });
	  if(parent.type !== "folder") return res.status(400).json({ error: "Parent is not a folder" });
    }

	let localPath;
	if (type !== "folder") {
		const folderPath = process.env.FOLDER_PATH || "/tmp/uploads";
		if(!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

		const fileName = `${uuidv4()}-${file.originalname}`;
		const extension = file.originalname.split('.').pop();
		localPath = `${folderPath}/${fileName}`;
		const fileData = Buffer.from(data, "base64");
		fs.writeFileSync(localPath, fileData);

		const newFile = {
			userId,
			name,
			type,
			parentId,
			isPublic,
			localPath,
		};

		try {
			const result = await this.db.filesCollection.insertOne(newFile);
			newFile._id = result.insertedId;
			return res.status(201).json({message: "File uploaded successfully", file: newFile});
		}
		catch (error) {
			console.log(error);
			return res.status(500).send();
		}
	}
  }
}
