import { ActionTypes } from 'redux-linear-undo';
import { disableCaptureModal } from './capture';
import {
  setLoadingMessage,
  hideLoadingMessage,
  setDisappearingLoadingMessage,
  setDisplayingSyncConfirmationModal,
} from './base';
import { pushOrgFile } from '../lib/dropbox';

import sampleCaptureTemplates from '../lib/sample_capture_templates';

import { Dropbox } from 'dropbox';
import moment from 'moment';

export const displayFile = (path, contents) => ({
  type: 'DISPLAY_FILE', path, contents,
});

export const setLastPulledAt = lastPulledAt => ({
  type: 'SET_LAST_PULLED_AT', lastPulledAt,
});

export const stopDisplayingFile = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'STOP_DISPLAYING_FILE' });
    dispatch({ type: ActionTypes.CLEAR_HISTORY });
    dispatch(unfocusHeader());
    dispatch(disableCaptureModal());
    dispatch(setLastPulledAt(null));
  };
};

export const sync = ({ forceAction = null } = {}) => (
  (dispatch, getState) => {
    dispatch(setLoadingMessage('Syncing...'));

    const dropbox = new Dropbox({ accessToken: getState().dropbox.get('accessToken') });
    const path = getState().org.present.get('path');
    dropbox.filesDownload({ path }).then(response => {
      const isDirty = getState().org.present.get('isDirty');
      const lastServerModifiedAt = moment(response.server_modified);
      const lastPulledAt = getState().org.present.get('lastPulledAt');

      if (lastPulledAt.isAfter(lastServerModifiedAt, 'second') || forceAction === 'push') {
        if (isDirty) {
          pushOrgFile(
            getState().org.present.get('headers'),
            getState().org.present.get('todoKeywordSets'),
            path, dropbox,
          ).then(() => {
            dispatch(setDisappearingLoadingMessage('Changes pushed', 2000));
            dispatch(setDirty(false));
          }).catch(error => {
            alert(`There was an error pushing the file: ${error.toString()}`);
            dispatch(hideLoadingMessage());
          });
        } else {
          dispatch(setDisappearingLoadingMessage('Nothing to sync', 2000));
        }
      } else {
        if (isDirty && forceAction !== 'pull') {
          dispatch(hideLoadingMessage());
          dispatch(setDisplayingSyncConfirmationModal(true, lastServerModifiedAt));
        } else {
          const reader = new FileReader();
          reader.addEventListener('loadend', () => {
            dispatch(displayFile(path, reader.result));
            dispatch(applyOpennessState());
            dispatch(setDirty(false));
            dispatch(setLastPulledAt(moment()));
            dispatch(setDisappearingLoadingMessage('Latest version pulled', 2000));
          });
          reader.readAsText(response.fileBlob);
        }
      }
    });
  }
);

export const openHeader = headerId => ({
  type: 'OPEN_HEADER', headerId,
});

export const toggleHeaderOpened = headerId => ({
  type: 'TOGGLE_HEADER_OPENED', headerId,
});

export const selectHeader = headerId => (
  dispatch => {
    dispatch({ type: 'SELECT_HEADER', headerId });

    if (!!headerId) {
      dispatch(setSelectedTableCellId(null));
    }
  }
);

export const advanceTodoState = (headerId = null) => ({
  type: 'ADVANCE_TODO_STATE', headerId,
});

export const enterTitleEditMode = (cursorPosition = null) => ({
  type: 'ENTER_TITLE_EDIT_MODE', cursorPosition,
});

export const exitTitleEditMode = () => ({
  type: 'EXIT_TITLE_EDIT_MODE',
});

export const updateHeaderTitle = (headerId, newRawTitle) => ({
  type: 'UPDATE_HEADER_TITLE', headerId, newRawTitle,
});

export const enterDescriptionEditMode = (cursorPosition = null) => ({
  type: 'ENTER_DESCRIPTION_EDIT_MODE', cursorPosition,
});

export const exitDescriptionEditMode = () => ({
  type: 'EXIT_DESCRIPTION_EDIT_MODE',
});

export const updateHeaderDescription = (headerId, newRawDescription) => ({
  type: 'UPDATE_HEADER_DESCRIPTION', headerId, newRawDescription,
});

export const addHeader = headerId => ({
  type: 'ADD_HEADER', headerId,
});

export const selectNextSiblingHeader = headerId => ({
  type: 'SELECT_NEXT_SIBLING_HEADER', headerId,
});

export const addHeaderAndEdit = headerId => (
  dispatch => {
    dispatch(addHeader(headerId));
    dispatch(selectNextSiblingHeader(headerId));
    dispatch(enterTitleEditMode());
  }
);

export const selectNextVisibleHeader = headerId => ({
  type: 'SELECT_NEXT_VISIBLE_HEADER', headerId,
});

export const selectPreviousVisibleHeader = headerId => ({
  type: 'SELECT_PREVIOUS_VISIBLE_HEADER', headerId,
});

export const removeHeader = headerId => ({
  type: 'REMOVE_HEADER', headerId,
});

export const moveHeaderUp = headerId => ({
  type: 'MOVE_HEADER_UP', headerId,
});

export const moveHeaderDown = headerId => ({
  type: 'MOVE_HEADER_DOWN', headerId,
});

export const moveHeaderLeft = headerId => ({
  type: 'MOVE_HEADER_LEFT', headerId,
});

export const moveHeaderRight = headerId => ({
  type: 'MOVE_HEADER_RIGHT', headerId,
});

export const moveSubtreeLeft = headerId => ({
  type: 'MOVE_SUBTREE_LEFT', headerId,
});

export const moveSubtreeRight = headerId => ({
  type: 'MOVE_SUBTREE_RIGHT', headerId,
});

export const focusHeader = headerId => ({
  type: 'FOCUS_HEADER', headerId,
});

export const unfocusHeader = () => ({
  type: 'UNFOCUS_HEADER',
});

export const noOp = () => ({
  type: 'NO_OP',
});

export const applyOpennessState = () => ({
  type: 'APPLY_OPENNESS_STATE',
});

export const setDirty = isDirty => ({
  type: 'SET_DIRTY', isDirty,
});

export const setSelectedTableCellId = cellId => (
  dispatch => {
    dispatch({ type: 'SET_SELECTED_TABLE_CELL_ID', cellId });

    if (!!cellId) {
      dispatch(selectHeader(null));
    }
  }
);

export const enterTableEditMode = () => ({
  type: 'ENTER_TABLE_EDIT_MODE',
});

export const exitTableEditMode = () => ({
  type: 'EXIT_TABLE_EDIT_MODE',
});

export const addNewTableRow = () => ({
  type: 'ADD_NEW_TABLE_ROW',
});

export const removeTableRow = () => ({
  type: 'REMOVE_TABLE_ROW',
});

export const addNewTableColumn = () => ({
  type: 'ADD_NEW_TABLE_COLUMN',
});

export const removeTableColumn = () => ({
  type: 'REMOVE_TABLE_COLUMN',
});

export const moveTableRowDown = () => ({
  type: 'MOVE_TABLE_ROW_DOWN',
});

export const moveTableRowUp = () => ({
  type: 'MOVE_TABLE_ROW_UP',
});

export const moveTableColumnLeft = () => ({
  type: 'MOVE_TABLE_COLUMN_LEFT',
});

export const moveTableColumnRight = () => ({
  type: 'MOVE_TABLE_COLUMN_RIGHT',
});

export const updateTableCellValue = (cellId, newValue) => ({
  type: 'UPDATE_TABLE_CELL_VALUE', cellId, newValue,
});

export const insertCapture = (templateId, content, shouldPrepend) => (
  (dispatch, getState) => {
    dispatch(disableCaptureModal());

    const template = getState().capture.get('captureTemplates').concat(sampleCaptureTemplates).find(template => (
      template.get('id') === templateId
    ));
    dispatch({ type: 'INSERT_CAPTURE', template, content, shouldPrepend });
  }
);

export const advanceCheckboxState = listItemId => ({
  type: 'ADVANCE_CHECKBOX_STATE', listItemId,
});
