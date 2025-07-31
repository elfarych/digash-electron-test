import { HttpErrorResponse } from '@angular/common/http';

export const extractErrorMessage = (error: HttpErrorResponse): string => {
  return Array.isArray(error.error?.message)
    ? error.error?.message[0]
    : error.error?.message ?? error.error;
};
