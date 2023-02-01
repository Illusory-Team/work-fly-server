import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PHONE_ERROR_MESSAGE } from '../constants';

@ValidatorConstraint({ name: 'IsPhoneNumber', async: true })
@Injectable()
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  async validate(value: string): Promise<boolean> {
    if (!value) {
      return false;
    }

    const regexp = /^[6-9]\d{5,13}$/;

    return regexp.test(value);
  }

  defaultMessage() {
    return PHONE_ERROR_MESSAGE;
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsPhoneNumberConstraint,
    });
  };
}
