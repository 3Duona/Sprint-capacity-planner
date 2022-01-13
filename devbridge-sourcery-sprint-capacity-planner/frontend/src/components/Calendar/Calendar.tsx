import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/common';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

import { selectDayAction } from '../../state/actions/calendarActions';
import { User, DayOff, Roles } from '../../state/reducers/usersReducer';
import { SelectionType } from '../CalendarDetails/CalendarDetails';
import { Sprint, Team } from '../../state/reducers/teamsReducer';

export type CalendarProps = CalendarOptions & {
  events: CalendarEvent[];
  color: string;
  selectionType: SelectionType;
  usersTeam: Team;
};

export type FilteredUserType = User & {
  filtered: boolean;
};

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  member: string;
  reason: string;
  role: Roles;
  color?: string;
}

export const createEvent = (
  id: string,
  title: string,
  start: Date,
  end: Date,
  member: string,
  reason: string,
  role: Roles
): CalendarEvent => {
  return { id, title, start, end, member, reason, role };
};

export const convertToCalendarChips = (users: FilteredUserType[], secondaryColor: string) => {
  const calendarChips: Array<CalendarEvent> = [];
  let eventGuid = 0;
  _.forEach(users, (user: FilteredUserType) => {
    _.forEach(user.daysOff, (dayOff: DayOff) => {
      const memberName = `${user.firstName} ${user.lastName && user.lastName.charAt(0)}.`;
      const event = createEvent(
        `${eventGuid++}`,
        `${dayOff.reason} | ${memberName}`,
        dayOff.startDate,
        dayOff.endDate,
        memberName,
        dayOff.reason,
        user.teamRole
      );
      if (user.filtered) {
        event.color = secondaryColor;
      }
      return calendarChips.push(event);
    });
  });
  return calendarChips;
};

export const Calendar: React.FC<CalendarProps> = (
  { events, color, selectionType, usersTeam }: CalendarProps,
  props
) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<boolean>(true);

  const getSelectedDaySprint = (selectedDate: Date): Sprint => {
    return _.find(usersTeam.sprints, (sprint: Sprint) =>
      moment(selectedDate).isBetween(sprint.startDate, sprint.endDate, 'day', '[]')
    );
  };

  useEffect(() => {
    const today = new Date();
    dispatch(selectDayAction({ selectionStart: today, selectionEnd: today }));
  }, [dispatch]);

  const handleClick = (arg: DateSelectArg) => {
    if (!selected) {
      return;
    }
    const calendarApi = arg.view.calendar;
    const selectionEnd = new Date(arg.endStr);
    selectionEnd.setDate(selectionEnd.getDate() - 1);
    switch (selectionType) {
      case 'DAY': {
        dispatch(selectDayAction({ selectionStart: new Date(arg.startStr), selectionEnd: selectionEnd }));
        break;
      }
      case 'WEEK': {
        const selWeekStart = moment(arg.start).startOf('isoWeek').toDate();
        const selWeekEnd = moment(selectionEnd).endOf('isoWeek').toDate();

        setSelected(false);
        calendarApi.select(selWeekStart, moment(selWeekEnd).add(1, 'day').toDate());
        setSelected(true);

        dispatch(
          selectDayAction({
            selectionStart: selWeekStart,
            selectionEnd: selWeekEnd,
          })
        );
        break;
      }
      case 'MONTH': {
        const selMonthStart = moment(arg.start).startOf('month').toDate();
        const selMonthEnd = moment(selectionEnd).endOf('month').toDate();

        setSelected(false);
        calendarApi.select(selMonthStart, moment(selMonthEnd).add(1, 'day').toDate());
        setSelected(true);

        dispatch(
          selectDayAction({
            selectionStart: selMonthStart,
            selectionEnd: selMonthEnd,
          })
        );
        break;
      }
      case 'SPRINT': {
        if (moment(arg.start).diff(arg.end, 'days') > 1) {
          calendarApi.unselect();
          break;
        }
        const selectedDaySprint = getSelectedDaySprint(arg.start);

        if (selectedDaySprint !== undefined) {
          const selSprintStart = new Date(selectedDaySprint.startDate);
          const selSprintEnd = new Date(selectedDaySprint.endDate);

          setSelected(false);
          calendarApi.select(selSprintStart, moment(selSprintEnd).add(1, 'day').toDate());
          setSelected(true);

          dispatch(
            selectDayAction({
              selectionStart: selSprintStart,
              selectionEnd: selSprintEnd,
            })
          );
        } else {
          calendarApi.unselect();
        }
        break;
      }
    }
  };

  return (
    <FullCalendar
      dayMaxEvents={true}
      displayEventTime={false}
      eventColor={color}
      events={events}
      firstDay={1}
      headerToolbar={{
        left: 'prev,next,today',
        center: 'title',
        right: 'dayGridMonth',
      }}
      initialView="dayGridMonth"
      plugins={[dayGridPlugin, interactionPlugin]}
      select={handleClick}
      selectable={true}
      unselectAuto={false}
      {...props}
    />
  );
};
