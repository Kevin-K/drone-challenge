export const existanceSort = (a: any, b: any) => {
  if (!a) {
    if (!b) {
      return 0;
    }
    return 1;
  } else if (!b) {
    return -1;
  } else {
    return 0;
  }
};
