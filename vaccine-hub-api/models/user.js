const { UnauthorizedError, BadRequestError } = require("../utils/errors");
const db = require('../db')

const {BCRYPT_WORK_FACTOR} = require('../config')
const bcrypt = require('bcrypt')

class User{
  
  static async makePublicUser(user){
    return {
      
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      date: user.date
    
    }
  }

  static async login(credentials){

    // console.log('hi');

    const requiredFields = ['email', 'password']
    requiredFields.forEach(field => {
      if(!credentials.hasOwnProperty(field)){
        throw new BadRequestError(`Missing ${field} in request body`)
      }
    })

    // console.log('hi');
    // user exist
    const user = await User.fetchUserByEmail(credentials.email)
    // console.log('user ',user);
    if(user){
      const isValid = await bcrypt.compare(credentials.password, user.password)
      if(isValid)
        return this.makePublicUser(user)
    }


    throw new UnauthorizedError('Invalid email/password combo')
  }



  static async register(credentials){

    console.log(credentials);
    

    credentials.first_name = credentials.firstName 
    credentials.last_name = credentials.lastName 
    delete credentials.firstName
    delete credentials.lastName
    
    console.log(credentials);
    
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

    //hash
  
    const hashedPassword =  await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)

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
    `, [lowercasedEmail, hashedPassword, credentials.first_name, credentials.last_name, credentials.location])

      const user = result.rows[0]
      return this.makePublicUser(user)

  }

  static async fetchUserByEmail(email){
    if(!email){
      throw new BadRequestError('no email provided')
    }


    const query = `SELECT * FROM users WHERE email = $1`
    const result = await db.query(query, [email.toLowerCase()])

    // console.log('res ',result);

    const user = result.rows[0]
    return user
  }
}

module.exports = User
