import {
  type Controller,
  type HttpRequest,
  type HttpResponse,
  type EmailValidator,
  type AddAccount
} from '../signup/signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccont: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccont
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const { email, name, password, passwordConfirmation } = httpRequest.body
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const user = this.addAccount.add({
        name,
        email,
        password
      })
      return {
        statusCode: 200,
        body: user
      }
    } catch (error) {
      return serverError()
    }
  }
}