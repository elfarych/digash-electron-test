export const getFunctionNameByCoupon = (functionName: string): string => {
  if (functionName.toLowerCase() === 'rdn') {
    return 'Также для Вас открыт уникальный функционал от RdnScalp - формация "Активные монеты"';
  }

  return '';
}
