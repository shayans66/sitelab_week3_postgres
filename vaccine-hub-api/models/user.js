const { UnauthorizedError } = require("../utils/errors");
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
    
  }
}

module.exports = User
