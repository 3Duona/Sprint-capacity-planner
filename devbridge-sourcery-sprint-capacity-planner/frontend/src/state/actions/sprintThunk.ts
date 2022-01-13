import {
  LoadSprintAction,
  AddSprintAction,
  EditSprintAction,
  RemoveSprintAction,
  AddSprintActionPayload,
  EditSprintActionPayload,
  RemoveSprintActionPayload,
} from '../actions/sprintActions';
import API from '../../domain/Api';
import { SetNotificationAction } from '../../state/actions/notificationsActions';

export const LoadSprints = () => (dispatch) => {
  API.get('api/sprints', { withCredentials: true }).then(
    (res) => {
      dispatch(LoadSprintAction(res.data));
    },
    (error) => {
      console.log(error);
    }
  );
};

export const AddSprint = (props: AddSprintActionPayload) => (dispatch) => {
  API.post('api/sprints', props, { withCredentials: true }).then(
    (res) => {
      dispatch(AddSprintAction(res.data));
    },
    (error) => {
      console.log(error);
    }
  );
};

export const EditSprint = (props: EditSprintActionPayload) => (dispatch) => {
  API.put(`api/sprints/${props.id}`, props, { withCredentials: true }).then(
    (res) => {
      dispatch(EditSprintAction(res.data));
      dispatch(
        SetNotificationAction({
          isOpen: true,
          message: 'Sprint updated',
          type: 'success',
        })
      );
    },
    (error) => {
      console.log(error);
      dispatch(
        SetNotificationAction({
          isOpen: true,
          message: 'Sprint failed to update',
          type: 'error',
        })
      );
    }
  );
};

export const RemoveSprint = (props: RemoveSprintActionPayload) => (dispatch) => {
  API.delete(`api/sprints/${props.id}`, { withCredentials: true }).then(
    (res) => {
      dispatch(RemoveSprintAction({ id: res.data }));
    },
    (error) => {
      console.log(error);
    }
  );
};
