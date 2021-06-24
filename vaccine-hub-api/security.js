const bcrypt = require('bcrypt')

const pw = 'supersecretpasswrod'

bcrypt.hash(pw, 6, (err, hashedPw) => {
  console.log(`pw: ${pw}`);
  console.log(`hashed: ${hashedPw}`);
})