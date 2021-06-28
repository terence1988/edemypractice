import bcrypt from "bcrypt";

export const hashPassword = (receivedPassword: string) => {
	return new Promise<string>((resolve, reject) => {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				reject(err);
			}
			bcrypt.hash(receivedPassword, salt, (err, hashedPassword) => {
				if (err) {
					reject(err);
				}
				resolve(hashedPassword);
			});
		});
	});
};

export const comparePassword = (receivedPassword: string, storedHashedPassword: string) => {
	return bcrypt.compare(receivedPassword, storedHashedPassword);
};
