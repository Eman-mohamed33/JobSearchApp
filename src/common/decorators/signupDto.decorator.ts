import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "match-between-fields", async: false })
export class MatchBetweenFields implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    console.log({ value, args, mismatch: args.object[args.constraints[0]] });

    return value === args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments): string {
    return `fail to match src field :: ${args?.property} with target field :: ${args?.constraints[0]}`;
  }
}

export function IsMatch(constraints: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: MatchBetweenFields,
    });
  };
}

// Check Age greater than 18 Or Not ;
@ValidatorConstraint({ name: "checkAge", async: false })
export class CheckDateValidOrNot implements ValidatorConstraintInterface {
  validate(newDate: Date, args: ValidationArguments) {
    let age = Date.now() - new Date(newDate).getTime();

    const checkAge = Math.floor(age / (24 * 60 * 60 * 1000 * 365));

    return checkAge > 18; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return "Age must be smaller than 18 years";
  }
}
