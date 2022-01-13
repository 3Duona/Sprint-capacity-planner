import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableSortLabel,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Checkbox,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import _ from 'lodash';
import { useDispatch } from 'react-redux';

import { stableSort, getComparator, Order } from './BaseTableHelpers';
import { SetNotificationAction } from '../../state/actions/notificationsActions';

export type ColumnDefinitionType<T, K extends keyof T> = {
  key: K;
  header: string;
  calculateTotal?: boolean;
  round?: boolean;
};

type TableProps<T, K extends keyof T> = {
  data: T[];
  columns: ColumnDefinitionType<T, K>[];
  editable?: boolean;
  removable?: boolean;
  selectable?: boolean;
  sortable?: boolean;
  calculateTotals?: boolean;
  onEdit?: (id) => any;
  onRemove?: (id) => any;
  selected?: number[];
  setSelected?: (selected: number[]) => void;
  idProperty: K;
  initialOrder: K;
};

export const BaseTable = <T, K extends keyof T>({
  data,
  columns,
  editable = false,
  removable = false,
  selectable = false,
  sortable = true,
  calculateTotals = false,
  onEdit,
  onRemove,
  selected = [],
  setSelected,
  idProperty,
  initialOrder,
}: TableProps<T, K>): JSX.Element => {
  const dispatch = useDispatch();
  const [order, setOrder] = useState<Order.Ascending | Order.Descending>(Order.Ascending);
  const [orderBy, setOrderBy] = useState(initialOrder.toString());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = useState(
    data === undefined || data.length === 0 ? undefined : data[0][idProperty]
  );

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === Order.Ascending;
    //if current order is ascending, order in descending order, and vice versa
    setOrder(isAsc ? Order.Descending : Order.Ascending);
    setOrderBy(property);
  };

  const handleClickOpen = (id) => {
    if (id !== undefined) {
      setSelectedId(id);
    }
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleEdit = (id: any) => {
    if (onEdit !== undefined) {
      onEdit(id);
    }
    dispatch(
      SetNotificationAction({
        isOpen: true,
        message: 'Editing entry',
        type: 'info',
      })
    );
  };

  const handleRemove = () => {
    if (onRemove !== undefined) {
      onRemove(selectedId);
    }
    setIsDialogOpen(false);
    dispatch(
      SetNotificationAction({
        isOpen: true,
        message: 'Entry deleted',
        type: 'error',
      })
    );
  };

  const handleClick = (id: number) => {
    const selectedIndex: number = _.indexOf(selected, id);
    let newSelected: number[] = [];

    switch (true) {
      case selectedIndex === -1:
        newSelected = _.concat(newSelected, selected, id);
        break;
      case selectedIndex === 0:
        newSelected = _.concat(newSelected, _.slice(selected, 1));
        break;
      case selectedIndex === selected.length - 1:
        newSelected = _.concat(newSelected, _.slice(selected, 0, -1));
        break;
      case selectedIndex > 0:
        newSelected = _.concat(newSelected, _.slice(selected, 0, selectedIndex), _.slice(selected, selectedIndex + 1));
        break;
    }
    if (setSelected !== undefined) {
      setSelected(newSelected);
    }
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const showNoData = (message: string) => {
    const headerCount = columns.length + (editable || removable ? 1 : 0) + (selectable || calculateTotals ? 1 : 0);
    return (
      <TableRow>
        {_.times(headerCount, (index) => {
          return <TableCell>{index === 0 && message}</TableCell>;
        })}
      </TableRow>
    );
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {(selectable || calculateTotals) && <TableCell />}
            {_.map(columns, (column: ColumnDefinitionType<T, K>, index: number) => (
              <TableCell key={`headCell-${index}`}>
                {sortable && (
                  <TableSortLabel
                    active={orderBy === column.key}
                    direction={orderBy === column.key ? order : Order.Ascending}
                    onClick={() => handleRequestSort(column.key)}
                  >
                    {column.header}
                  </TableSortLabel>
                )}
                {!sortable && column.header}
              </TableCell>
            ))}
            {(editable || removable) && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        {data.length === 0 && showNoData('')}
        <TableBody>
          {_.map(stableSort(data, getComparator(order, orderBy)), (row, index: number) => {
            const isItemSelected = isSelected(row['Id']);
            return (
              <TableRow
                aria-checked={selectable && isItemSelected}
                id={`row-${row['Id']}`}
                key={`row-${index}`}
                onClick={selectable ? () => handleClick(row['Id']) : undefined}
                selected={selectable && isItemSelected}
              >
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': row['Id'] }} />
                  </TableCell>
                )}
                {calculateTotals && <TableCell padding="checkbox" />}
                {_.map(columns, (column: ColumnDefinitionType<T, K>, index2: number) => (
                  <TableCell key={`cell-${index2}`}>
                    {column.round && row[column.key] ? _.round(row[column.key], 2) : row[column.key]}
                  </TableCell>
                ))}
                {(editable || removable) && (
                  <TableCell>
                    {editable && (
                      <IconButton color="primary" onClick={() => handleEdit(row[idProperty])}>
                        <EditIcon />
                      </IconButton>
                    )}
                    {removable && (
                      <>
                        <IconButton color="secondary" onClick={() => handleClickOpen(row[idProperty])}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
          {calculateTotals && data.length !== 0 && (
            <TableRow>
              <TableCell>Totals:</TableCell>
              {_.map(columns, (column: ColumnDefinitionType<T, K>, index: number) => (
                <TableCell key={`cell-${index}`}>
                  {column.calculateTotal &&
                    column.round &&
                    _.round(
                      column.calculateTotal &&
                        _.sumBy(data, (row) => {
                          return row[column.key] ?? 0;
                        }),
                      2
                    )}
                  {column.calculateTotal &&
                    !column.round &&
                    column.calculateTotal &&
                    _.sumBy(data, (row) => {
                      return row[column.key] ?? 0;
                    })}
                </TableCell>
              ))}
              {(editable || removable) && <TableCell />}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {calculateTotals}
      <Dialog onClose={handleClose} open={isDialogOpen}>
        <DialogContent>
          <DialogContentText>Delete this entry?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            No
          </Button>
          <Button color="primary" onClick={handleRemove}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};
