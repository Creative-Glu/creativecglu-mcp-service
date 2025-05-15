import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InvalidCredentialsException } from 'services/auth/exceptions';

@Injectable()
export default class BasicAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    this.reflector = reflector;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) throw new InvalidCredentialsException();

    if (authorization.split('Bearer ')[1] !== process.env.BASIC_AUTH)
      throw new InvalidCredentialsException();

    return true;
  }
}
