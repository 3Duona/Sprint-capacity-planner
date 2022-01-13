function descendingComparator<T>(a: T, b: T, orderBy: string) {
  if ((b[orderBy] ? b[orderBy] : null) < (a[orderBy] ? a[orderBy] : null)) {
    return -1;
  }
  if ((b[orderBy] ? b[orderBy] : null) > (a[orderBy] ? a[orderBy] : null)) {
    return 1;
  }
  return 0;
}

export function stableSort(array: any[], comparator: (a: any, b: any) => number) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export enum Order {
  Ascending = 'asc',
  Descending = 'desc',
}

export function getComparator(order: Order.Ascending | Order.Descending, orderBy: string) {
  return order === Order.Descending
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
