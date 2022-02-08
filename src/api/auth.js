const express = require('express')
const router = express.Router()
const { validationResult, body } = require('express-validator')
const AuthService = require('../services/auth')
const { Users } = require('../models') 
const { COMPANY_USER, CUSTOMER_USER, ADMIN_USER } = require('../enumerators/profileTypes')

const authService = new AuthService(Users)
router.get('/signin',  async(req, res) => {
  res.render('/login')
  })
  
router.post('/signin', async (req, res) => {
  
  try {
    const { email, password } = req.body
    const { token, userData } = await authService.signIn(email, password)
    res.cookie('token', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: 'None',
      secure: false
    })
    res.json({ auth: true, user: userData /* token: token */ })
  } catch ({ message }) {
    res.status(401).send({ auth: false, token: null, message: message })
  }
})

router.post(
  '/signup',
  body('name', 'Nome inválido!')
    .trim()
    .notEmpty()
    .isAlpha('pt-BR', { ignore: ' ' }),
  body('email', 'Email inválido!')
    .trim()
    .notEmpty()
    .isEmail(),
  body('phone', 'Telefone inválido')
    .trim()
    .notEmpty()
    .isNumeric()
    .isMobilePhone('pt-BR'),
  body('profileType', 'profileType inválido!')
    .isInt()
    .isIn([COMPANY_USER, CUSTOMER_USER, ADMIN_USER]),
  body(
    'bioDescription',
    'Adicione a descrição para a empresa, incluindo horário de funcionamento'
  )
    .if(
      body('profileType').custom((value, { req }) => {
        if (req.body.profileType == COMPANY_USER) {
          return true
        } else {
          req.body.bioDescription = null
        }
      })
    )
    .notEmpty()
    .isLength({ max: 150 }),
  body('password', 'Senha deve conter pelo menos 8 caracteres.')
    .trim()
    .notEmpty()
    .isLength({ min: 8 }),
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg })
      }

      const {
        name,
        email,
        phone,
        bioDescription,
        password,
        profileType
      } = req.body
      const user = await authService.signUp({
        name,
        email,
        phone,
        bioDescription,
        password,
        profileType
      })
      res
        .status(201)
        .json({
          message: 'Usuário cadastrado com sucesso!',
          data: user
        })
    } catch ({ message }) {
      res.status(400).json({ error: { message } })
    }
  }
)

module.exports = router
