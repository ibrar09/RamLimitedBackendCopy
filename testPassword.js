// testPassword.js
import bcrypt from "bcrypt";

const test = async () => {
  const password = "string123";
  const hash = "$2b$10$UHTf1CUtZak/xzHRYnuRmOZyQ0Dli4XH/ukGDUVRTS7V4P3Sp/P26";

  const match = await bcrypt.compare(password, hash);
  console.log("Password match:", match); // should print true
};

test();
