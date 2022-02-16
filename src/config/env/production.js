class Config {
    constructor () {
      this.env = 'production'
      this.PORT = process.env.PORT
      this.API_BASE = '/api'
      this.DATABASE_HOST = process.env.DATABASE_HOST
      this.DATABASE_PORT = process.env.DATABASE_PORT || 5432
      this.DATABASE_DB = process.env.DATABASE_DB
      this.DATABASE_USER = process.env.DATABASE_USER
      this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
      this.JWT_SECRET = process.env.JWT_SECRET

      this.SAME_SITE = 'none'
      this.SECURE = true
    }
  }
  
  module.exports = new Config()