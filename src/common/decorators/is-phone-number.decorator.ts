import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPhoneNumber', async: true })
@Injectable()
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  constructor() {}
  async validate(value: any): Promise<boolean> {
    if (!value) {
      return false;
    }

    const regexp = /^[6-9]\d{5,13}$/;

    return regexp.test(value);
  }

  defaultMessage() {
    return `phone number is not valid to the example: '89997485241' which must contains more than 5 and less than 15 digits, where 1st digit is more than 5`;
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
