import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Grid, Typography, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {
  getTaskItemsWithPreferenceList,
  getPreferredItemsForItem,
  getGlobalItems
} from '../ScheduleViewer/EditSchedule/EditScheduleService';
import RenderComponent from '../../components/RenderComponent';
import Loader from '../../components/LoaderComponent/Loader';
import { COMPONENTS } from '../../utils/constants';
import { API_V1, APIS } from '../../utils/apiList';
import { isArray } from '../../utils/utils';

function MaterialPickingDetails({ mplDetailsProps, handleProceed, handleClose }) {
  const {
    stockDetails: { stockItem, list, servicemanId },
    open,
    isCancelButton = true,
    cancelButtonText,
    isProceedButton = true,
    proceedButtonText
  } = mplDetailsProps;
  const [stockDetailedList, setStockDetailedList] = useState(list || []);
  const emptyStockItemData = { selectedQtyFromWarehouse: 0, selectedQtyFromMobileWarehouse: 0 };
  const [stockItemData, setStockItemData] = useState({ ...stockItem, ...emptyStockItemData });
  const [error, setError] = useState(false);
  const { BUTTON, TEXT_FIELD, ICON, CHECKBOX, SELECT_BOX, AUTOCOMPLETE, NONE } = COMPONENTS;
  const [taskAndServiceSubjectWiseItems, setTaskAndServiceSubjectWiseItems] = useState({});
  const [globalItems, setGlobalItems] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [globalCompsPayload, setGlobalCompsPayload] = useState({
    item: '',
    allItemId: '',
    changeAll: false,
    revertAll: false
  });
  const { GET_ITEMS_WITH_PREFERENCE, PREFERRED_ITEMS_FOR_ITEM, GET_GLOBAL_ITEMS } = APIS;
  const {
    description,
    requiredQuantity,
    holdQty,
    stockCode,
    mobileWarehouseInv,
    availableQuantity,
    selectedQtyFromMobileWarehouse,
    isFulfilled
  } = stockItemData;

  const globalComps = [
    {
      control: NONE,
      columnWidth: 2
    },
    {
      control: NONE,
      columnWidth: 2
    },
    {
      control: NONE,
      columnWidth: 1.5
    },
    {
      control: BUTTON,
      groupStyle: { marginTop: '-0.3rem', marginLeft: '0.6rem' },
      key: 'revertAll',
      color: 'warning',
      btnTitle: 'Reset all',
      columnWidth: 1.2
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginTop: '-0.2rem' },
      key: 'item',
      label: 'Alternative item',
      options: globalItems,
      columnWidth: 3.9,
      autoCompleteDisplayKey: 'name',
      isRequired: true,
      genericItemList: true
    },
    {
      control: BUTTON,
      groupStyle: { marginTop: '-0.3rem' },
      key: 'changeAll',
      color: 'success',
      btnTitle: 'Change all',
      handleClickButton: () => handleChangeGlobalData('changeAll', globalCompsPayload.changeAll),
      columnWidth: 1.3,
      isDisabled: !globalCompsPayload.item
    }
  ];

  const gridComps = [
    {
      control: TEXT_FIELD,
      key: 'projectNumber',
      label: 'Project Number',
      columnWidth: 2,
      isRequired: true,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'projectName',
      label: 'Project Name',
      columnWidth: 2,
      isRequired: true,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'quantity',
      label: 'Quantity',
      columnWidth: 1,
      isRequired: true,
      isDisabled: true
    },
    {
      control: TEXT_FIELD,
      key: 'fromMobileWarehouse',
      label: 'From MW Inventory',
      columnWidth: 1,
      isRequired: true,
      isDisabled: false
    },
    {
      control: BUTTON,
      key: 'isOnholdQuantity',
      color: 'success',
      btnTitle: 'Hold',
      columnWidth: 0.8
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginTop: '-0.2rem' },
      key: 'item',
      label: 'Alternative items',
      options: [],
      columnWidth: 3.9,
      isRequired: true,
      genericItemList: true
    },
    {
      control: AUTOCOMPLETE,
      groupStyle: { marginTop: '-0.2rem' },
      key: 'item',
      label: 'Alternative items (Preferred)',
      options: [],
      columnWidth: 3.9,
      isRequired: true,
      genericItemList: false
    },
    {
      control: CHECKBOX,
      groupStyle: { marginLeft: '-2.5rem', marginTop: '-0.5rem', marginRight: '1rem' },
      key: 'isPreferred',
      label: '',
      labelPlacement: 'start',
      columnWidth: 0.5,
      tooltipTitle: 'Click to select preferred Items'
    },
    {
      control: BUTTON,
      groupStyle: { marginTop: '-0.3rem' },
      key: 'revert',
      color: 'warning',
      btnTitle: 'Revert',
      columnWidth: 1
    }
  ];

  const getGlobalItemList = async () => {
    let tempGlobalItems = [];
    if (servicemanId) {
      const res = await getGlobalItems(`${API_V1}/${GET_GLOBAL_ITEMS}?servicemanId=${servicemanId}`);
      if (isArray(res?.data)) {
        tempGlobalItems = res.data;
      }
    }
    setGlobalItems([...tempGlobalItems]);
  };

  const getItemList = async (stockDetailedItemList = stockDetailedList) => {
    const tempTaskAndServiceSubjectWiseItems = {};
    if (isArray(stockDetailedItemList)) {
      /* eslint-disable no-plusplus */
      setIsDataLoading(true);
      for (let i = 0, len = stockDetailedItemList.length; i < len; i++) {
        const { taskId, serviceSubjectId, isInstallationAssociationPresent, isConsumableAssociationPresent, taskType } =
          stockDetailedItemList[i];
        if (!tempTaskAndServiceSubjectWiseItems[`${taskId}-${serviceSubjectId}`]) {
          // eslint-disable-next-line no-await-in-loop
          tempTaskAndServiceSubjectWiseItems[`${taskId}-${serviceSubjectId}`] = await getServiceTaskItem(
            taskId,
            serviceSubjectId,
            isInstallationAssociationPresent,
            isConsumableAssociationPresent,
            taskType
          );
        }
      }
      setIsDataLoading(false);
    }
    setTaskAndServiceSubjectWiseItems({ ...tempTaskAndServiceSubjectWiseItems });
  };

  const updateStockItemData = (query) => setStockItemData({ ...stockItemData, ...query });

  const calculateQuantities = () => {
    let [selectedQtyFromMobileWarehouse, holdQty] = [0, 0];
    stockDetailedList.forEach((stock) => {
      selectedQtyFromMobileWarehouse += (stock.fromMobileWarehouse || 0) * 1;
      if (stock.isOnholdQuantity) {
        holdQty += (stock.quantity || 0) * 1;
      }
    });
    updateStockItemData({ selectedQtyFromMobileWarehouse, holdQty });
  };

  useEffect(() => {
    setStockItemData({ ...stockItem, ...emptyStockItemData });
    getGlobalItemList();
    setStockDetailedList(list);
    getItemList(list);
  }, [list]);

  useEffect(() => {
    calculateQuantities();
  }, [stockDetailedList]);

  useEffect(() => {
    const calculatedQty = (holdQty || 0) * 1 + getSelectedQtyFromWarehouse() + selectedQtyFromMobileWarehouse * 1;
    updateStockItemData({ isFulfilled: calculatedQty === requiredQuantity });
  }, [requiredQuantity, holdQty, selectedQtyFromMobileWarehouse]);

  const myCloseModal = (event, reason) => {
    if (reason && reason === 'backdropClick') return;
    handleClose();
  };

  const checkForErrors = () => {
    if (1 === '1') {
      setError(true);
    } else {
      handleProceed();
    }
  };

  const getSelectedQtyFromWarehouse = () => {
    const remainingQty =
      (requiredQuantity || 0) * 1 - (holdQty || 0) * 1 - (selectedQtyFromMobileWarehouse || 0) * 1 || 0;
    return remainingQty > availableQuantity ? availableQuantity : remainingQty;
  };

  const getServiceTaskItem = async (
    taskId,
    serviceSubjectId,
    isInstallationAssociationPresent,
    isConsumableAssociationPresent,
    taskType,
    isGetItemDetails
  ) => {
    setIsDataLoading(true);
    if (taskId && serviceSubjectId) {
      const apiPayload = {
        serviceSubjectId,
        taskId,
        isInstallationAssociationPresent,
        isConsumableAssociationPresent,
        itemSearchKey: ''
      };
      const res = await getTaskItemsWithPreferenceList(`${API_V1}/${GET_ITEMS_WITH_PREFERENCE}`, apiPayload);
      if (res?.isSuccessful && isArray(res.data)) {
        return res.data;
      }
    }
    setIsDataLoading(false);
    return [];
  };

  const handleChangeGlobalData = async (key, val, itemInd) => {
    if (['changeAll', 'revertAll'].includes(key)) {
      setIsDataLoading(true);
      const newStockDetailedList = stockDetailedList.map((stockItem) => {
        const { item, itemId } = globalCompsPayload;
        if (key === 'changeAll') {
          const itemList = taskAndServiceSubjectWiseItems[`${stockItem.taskId}-${stockItem.serviceSubjectId}`] || [];
          stockItem.isOnholdQuantity = false;
          stockItem.fromMobileWarehouse = '';
          if (itemList.find((i) => i.id === itemId)) {
            stockItem.item = item;
            stockItem.itemId = itemId;
          }
        } else {
          stockItem.item = '';
          stockItem.itemId = '';
          stockItem.isPreferred = false;
        }
        return stockItem;
      });
      setStockDetailedList([...newStockDetailedList]);
      setIsDataLoading(false);
    } else if (key === 'item') {
      globalCompsPayload.itemId = val?.id || '';
    }
    setGlobalCompsPayload({ ...globalCompsPayload, [key]: val });
  };

  const isNotMaxFromMobileWarehouseExceeding = (stockItemInd, val) =>
    stockDetailedList[stockItemInd] >= val && mobileWarehouseInv >= val;

  const handleChangeData = async (key, val, itemIndObj) => {
    const [ind, pos] = itemIndObj.split('-');
    if (key === 'fromMobileWarehouse' && val && !isNotMaxFromMobileWarehouseExceeding(ind, val * 1)) {
      return;
    }
    stockDetailedList[ind][key] = val;
    if (key === 'item') {
      stockDetailedList[ind].itemId = val?.id || '';
    } else if (key === 'revert') {
      stockDetailedList[ind].item = '';
      stockDetailedList[ind].itemId = '';
    } else if (key === 'isOnholdQuantity' && val) {
      stockDetailedList[ind].fromMobileWarehouse = '';
    } else if (key === 'isPreferred') {
      const { item } = stockDetailedList[ind];
      if (item && !isArray(item.preferredItems)) {
        setIsDataLoading(true);
        const res = await getPreferredItemsForItem(`${API_V1}/${PREFERRED_ITEMS_FOR_ITEM}=${item.id}`);
        stockDetailedList[ind].item.preferredItems = (isArray(res?.data) && res.data) || [];
      }
    }
    setStockDetailedList([...stockDetailedList]);
    setIsDataLoading(false);
  };

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={myCloseModal}>
      <Loader open={isDataLoading} />
      <Typography sx={{ position: 'absolute', right: 50, top: 12 }}>
        <Chip
          size="small"
          label={`${(!isFulfilled && 'Not-') || ''}Fullfilled`}
          color={isFulfilled ? 'primary' : 'warning'}
        />
      </Typography>
      <IconButton
        sx={{
          position: 'absolute',
          right: 5,
          top: 5
        }}
        onClick={myCloseModal}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle sx={{ pt: '10', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        Detailed breakdown for item:&nbsp;{' '}
        <p style={{ color: 'gray' }}>
          {stockCode} - {description}
        </p>
      </DialogTitle>
      <DialogContent sx={{ pb: '0', pl: '2.1rem', wordWrap: 'break-word' }}>
        <Grid item xs={12} mt={1}>
          <Grid container spacing={3} pt="1rem" pb="1rem">
            <Grid item xs={2}>
              {/* requiredQuantity, stockCode, mobileWarehouseInv, availableQuantity, fromMobileWarehouse */}
              <Typography>
                Required Quantity: <b> {requiredQuantity}</b>
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>
                Available Quantity in warehouse: <b> {availableQuantity}</b>
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>
                Available Quantity in Mobile Warehouse: <b> {mobileWarehouseInv}</b>
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>
                Hold Quantity: <b> {holdQty}</b>
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>
                Selected Quantity from warehouse: <b> {getSelectedQtyFromWarehouse()}</b>
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography>
                Selected Quantity from Mobile Warehouse: <b> {selectedQtyFromMobileWarehouse}</b>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {isArray(stockDetailedList) && (
          <>
            <Grid item xs={12} mt={1}>
              <Grid container spacing={3} pt="1rem" pb="0.5rem">
                {globalComps?.map((comp, itemInd) => (
                  <RenderComponent
                    key={itemInd}
                    metaData={{
                      ...comp,
                      handleClickButton: () => handleChangeGlobalData(comp.key, globalCompsPayload[comp.key], itemInd)
                    }}
                    payload={globalCompsPayload}
                    ind={itemInd}
                    handleClickButton={handleChangeGlobalData}
                    handleChange={handleChangeGlobalData}
                  />
                ))}
              </Grid>
            </Grid>
            {stockDetailedList.map((stockItem, i) => (
              <>
                <Grid item xs={12} mt={1}>
                  <Grid container spacing={3} pt="1rem" pb="0.5rem">
                    {gridComps?.map((comp, itemInd) => {
                      const { key } = comp;
                      comp.tooltipTitle = stockItem[key];
                      if (key === 'isOnholdQuantity') {
                        comp.btnTitle = stockItem.isOnholdQuantity ? 'Unhold' : 'Hold';
                        comp.color = stockItem.isOnholdQuantity ? 'warning' : 'success';
                      } else if (comp.key === 'fromMobileWarehouse') {
                        comp.isDisabled = stockItem.isOnholdQuantity;
                      } else if (comp.key === 'item') {
                        comp.isDisabled = stockItem.isOnholdQuantity;
                        const selectedItem = stockItem.item;
                        if (comp.genericItemList && stockItem?.isPreferred) {
                          return true;
                        }
                        if (!comp.genericItemList && !stockItem?.isPreferred) {
                          return true;
                        }
                        comp.options =
                          (comp.genericItemList
                            ? // ? serviceTaskItems && task.taskId && serviceTaskItems[task.taskId]
                              // : taskItem.preferredItems) || [];
                              taskAndServiceSubjectWiseItems[`${stockItem.taskId}-${stockItem.serviceSubjectId}`]
                            : selectedItem?.preferredItems) || [];
                      } else if (comp.key === 'isPreferred') {
                        const selectedItem = stockItem.item;
                        comp.isDisabled = !selectedItem?.hasPreferredItems;
                      }
                      return (
                        <RenderComponent
                          key={itemInd}
                          metaData={{
                            ...comp,
                            handleClickButton: () => handleChangeData(comp.key, !stockItem[comp.key], `${i}-${itemInd}`)
                          }}
                          payload={stockItem}
                          ind={`${i}-${itemInd}`}
                          handleClickButton={handleChangeData}
                          handleChange={handleChangeData}
                        />
                      );
                    })}
                  </Grid>
                </Grid>
              </>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: '10', pt: '0' }}>
        {isCancelButton && (
          <RenderComponent
            metaData={{
              control: BUTTON,
              color: 'warning',
              btnTitle: cancelButtonText || 'Close',
              handleClickButton: () => myCloseModal(),
              groupStyle: { minWidth: '6.5rem' }
            }}
          />
        )}
        {isProceedButton && (
          <RenderComponent
            metaData={{
              control: BUTTON,
              color: 'success',
              btnTitle: proceedButtonText || 'Confirm',
              handleClickButton: () => checkForErrors(),
              groupStyle: { minWidth: '6.5rem' }
            }}
          />
        )}
        {isProceedButton && (
          <RenderComponent
            metaData={{
              control: BUTTON,
              color: 'success',
              btnTitle: 'Save & Close',
              handleClickButton: () => checkForErrors(),
              groupStyle: { minWidth: '6.5rem' }
            }}
          />
        )}
      </DialogActions>
    </Dialog>
  );
}

export default MaterialPickingDetails;
