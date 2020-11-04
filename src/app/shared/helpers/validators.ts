import { FormControl, AbstractControl, FormArray, FormGroup } from "@angular/forms";
import { Member } from "../models/member.model";

export function postalCodeValidator(
  c: FormControl
): { [key: string]: boolean } | null {
  let regex =
    "[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] ?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]";
  if (c.value != null && c.value.match(regex)) {
    return null;
  }
  return { postalCodeInvalid: true };
}

export function dateValidator(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const today = new Date();
  if (new Date(c.value) > today) {
    return null;
  } else {
    return { pastDate: true };
  }
}

export function dateOfBirthValidator(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const today = new Date();
  const birthDate = new Date(c.value);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age >= 13) {
    return null;
  } else {
    return { pastDate: true };
  }
}

export function atLeastOneSelected(
  c: FormArray
): { [key: string]: boolean } | null {
  if (c.controls.filter((control) => control.value).length > 0) {
    return null;
  }
  return { atLeastOneSelected: true };
}

// export function isMember(c: FormGroup): { [key: string]: boolean } | null  {
//   console.log(c.value instanceof Member);
//   return { isMember: false };
// }