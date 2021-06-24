const { UnauthorizedError, BadRequestError } = require("../utils/errors");
const db = require('../db')

class User{
  /**
   * 
   * @param {credentials} 
   */
  static async login(credentials){

    throw new UnauthorizedError('Invalid email/password combo')
  }
  static async register(credentials){
    
    const requiredFields = ['email', 'password', 'first_name', 'last_name', 'location']
    requiredFields.forEach(field => {
      if(!credentials.hasOwnProperty(field)){
        throw new BadRequestError(`Missing ${field} in request body`)
      }
    })
    // validate email
    if(credentials.email.indexOf('@') <= 0){
      throw new BadRequestError('invalid email')
    }



    // alr exist
    const existingUser = await User.fetchUserByEmail(credentials.email)
    if(existingUser){
      throw new BadRequestError(`Duplicate email: ${credentials.email}`)
    }

    const lowercasedEmail = credentials.email.toLowerCase()
    const result = await db.query(`
      INSERT INTO users(
        email,
        password,
        first_name,
        last_name,
        location
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, password, first_name, last_name, location, date;
    `, [lowercasedEmail, credentials.password, credentials.first_name, credentials.last_name, credentials.location])

      const user = result.rows[0]
      return user

  }

  static async fetchUserByEmail(email){
    if(!email){
      throw new BadRequestError('no email provided')
    }

    const query = `SELECT * FROM users WHERE email = $1`
    const result = await db.query(query, [email.toLowerCase()])

    const user = result.rows[0]
    return user
  }
}

module.exports = User
