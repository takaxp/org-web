import { setDisplayingSyncConfirmationModal } from './base';

export const addNewEmptyCaptureTemplate = () => ({
  type: 'ADD_NEW_EMPTY_CAPTURE_TEMPLATE',
});

export const updateTemplateFieldPathValue = (templateId, fieldPath, newValue) => ({
  type: 'UPDATE_TEMPLATE_FIELD_PATH_VALUE', templateId, fieldPath, newValue,
});

export const addNewTemplateOrgFileAvailability = templateId => ({
  type: 'ADD_NEW_TEMPLATE_ORG_FILE_AVAILABILITY', templateId,
});

export const removeTemplateOrgFileAvailability = (templateId, orgFileAvailabilityIndex) => ({
  type: 'REMOVE_TEMPLATE_ORG_FILE_AVAILABILITY', templateId, orgFileAvailabilityIndex,
});

export const addNewTemplateHeaderPath = templateId => ({
  type: 'ADD_NEW_TEMPLATE_HEADER_PATH', templateId,
});

export const removeTemplateHeaderPath = (templateId, headerPathIndex) => ({
  type: 'REMOVE_TEMPLATE_HEADER_PATH', templateId, headerPathIndex,
});

export const deleteTemplate = templateId => ({
  type: 'DELETE_TEMPLATE', templateId,
});

export const restoreCaptureSettings = newSettings => ({
  type: 'RESTORE_CAPTURE_SETTINGS', newSettings,
});

export const activateCaptureModalForTemplateId = templateId => (
  dispatch => {
    dispatch({ type: 'ACTIVATE_CAPTURE_MODAL_FOR_TEMPLATE_ID', templateId });
    dispatch(setDisplayingSyncConfirmationModal(false));
  }
);

export const disableCaptureModal = () => ({
  type: 'DISABLE_CAPTURE_MODAL',
});

export const reorderCaptureTemplate = (fromIndex, toIndex) => ({
  type: 'REORDER_CAPTURE_TEMPLATE', fromIndex, toIndex,
});
