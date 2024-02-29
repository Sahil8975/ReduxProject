import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router-dom';
import { Grid, Typography, Button, Container, Paper } from '@mui/material';
import RenderComponent from '../../components/RenderComponent';
import DialogComponent from '../../components/Dialog';
import { COMPONENTS } from '../../utils/constants';
import { SEVICE_DASHBOARD_FILTER_MASTER_DATA } from '../../components/ServiceBoard/data';
import { ProjectEquivalencyTableData } from './Data';
import { POST_OFFICE } from '../../redux/constants';
import './AddProjectEquivalency.scss';

function AddProjectEquivalency() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({ code: 'RF-INU', projectBusinessCategory: 'Refill Washroom', buCode: 'FRG' });
  const [openDialog, setOpenDialog] = useState(false);
  const [isError, setIsError] = useState(false);
  const { pathname, state } = useLocation();
  const masterData = useSelector((state) => state.MasterDataReducer);

  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);
  const isEditFlag = match('/projectEquivalency/edit/:id');

  const { TEXT_FIELD, AUTOCOMPLETE } = COMPONENTS;
  const {
    country,
    office,
    businessType,
    businessSubType,
    hourCostCatID,
    hourCostCatDescription,
    projectClassification,
    projectType,
    fdBusinessUnit
  } = masterData;

  const componentsSet1 = [
    {
      control: AUTOCOMPLETE,
      key: 'country',
      label: 'Country',
      placeholder: 'Country',
      options: country,
      columnWidth: 6,
      groupStyle: { marginBottom: '1rem' },
      isError: isError && !payload.country,
      helperText: isError && !payload.country && 'Country is required',
      isRequired: true
    },
    {
      control: AUTOCOMPLETE,
      key: 'region',
      label: 'Region',
      placeholder: 'Region',
      options: office,
      columnWidth: 6,
      groupStyle: { marginBottom: '1rem' },
      isError: isError && !payload.region,
      helperText: isError && !payload.region && 'Region is required',
      isRequired: true
    },
    {
      control: AUTOCOMPLETE,
      key: 'businessType',
      label: 'Business Type',
      placeholder: 'Business Type',
      options: businessType,
      columnWidth: 6,
      groupStyle: { marginBottom: '1rem' },
      isError: isError && !payload.businessType,
      helperText: isError && !payload.businessType && 'Business Type is required',
      isRequired: true
    },
    {
      control: AUTOCOMPLETE,
      key: 'subType',
      label: 'Business Subtype',
      placeholder: 'Business Subtype',
      options: businessSubType,
      columnWidth: 6,
      groupStyle: { marginBottom: '1rem' },
      isError: isError && !payload.subType,
      helperText: isError && !payload.subType && 'Business Subtype is required',
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      key: 'code',
      label: 'Code',
      columnWidth: 6,
      groupStyle: { marginBottom: '1rem' },
      isDisabled: true,
      isError: isError && !payload.code,
      helperText: isError && !payload.code && 'Code is required',
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      key: 'projectBusinessCategory',
      label: 'Project Business Category',
      columnWidth: 6,
      groupStyle: { marginBottom: '1rem' },
      isDisabled: true,
      isError: isError && !payload.projectBusinessCategory,
      helperText: isError && !payload.projectBusinessCategory && 'Project Business Category is required',
      isRequired: true
    },
    {
      control: AUTOCOMPLETE,
      key: 'hourCostCatId',
      label: 'Hour Cost Category ID',
      placeholder: 'Hour Cost Category ID',
      options: hourCostCatID,
      columnWidth: 6,
      groupStyle: { marginBottom: '1rem' },
      isError: isError && !payload.hourCostCatId,
      helperText: isError && !payload.hourCostCatId && 'Hour Cost Category ID is required',
      isRequired: true
    },
    {
      control: AUTOCOMPLETE,
      key: 'hourCostCatDescription',
      label: 'Hour Cost Category Description',
      placeholder: 'Hour Cost Category Description',
      options: hourCostCatDescription,
      columnWidth: 6,
      groupStyle: { marginBottom: '1rem' },
      isError: isError && !payload.hourCostCatDescription,
      helperText: isError && !payload.hourCostCatDescription && 'Hour Cost Category Description is required',
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      key: 'projectGroupDescription',
      label: 'Project Group Description',
      columnWidth: 12,
      groupStyle: { marginBottom: '1rem' },
      isError: isError && !payload.projectGroupDescription,
      helperText: isError && !payload.projectGroupDescription && 'Project Group Description is required',
      isRequired: true
    }
  ];

  const componentsSet2 = [
    {
      control: AUTOCOMPLETE,
      key: 'projectClassification',
      label: 'Project Classification',
      placeholder: 'Project Classification',
      options: projectClassification,
      columnWidth: 12,
      groupStyle: { marginBottom: '1rem' },
      isError: isError && !payload.projectClassification,
      helperText: isError && !payload.projectClassification && 'Project Classification is required',
      isRequired: true
    },
    {
      control: AUTOCOMPLETE,
      key: 'projectType',
      label: 'Project Type',
      placeholder: 'Project Type',
      options: projectType,
      columnWidth: 12,
      groupStyle: { marginBottom: '1rem' },
      isError: isError && !payload.projectType,
      helperText: isError && !payload.projectType && 'Project Type is required',
      isRequired: true
    },
    {
      control: AUTOCOMPLETE,
      key: 'fdBusinessUnit',
      label: 'FD Business Unit',
      placeholder: 'FD Business Unit',
      options: fdBusinessUnit,
      columnWidth: 12,
      groupStyle: { marginBottom: '1rem' },
      isError: isError && !payload.fdBusinessUnit,
      helperText: isError && !payload.fdBusinessUnit && 'FD Business Unit is required',
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      key: 'buCode',
      label: 'BU-Code',
      columnWidth: 12,
      groupStyle: { marginBottom: '1rem' },
      isDisabled: true,
      isError: isError && !payload.buCode,
      helperText: isError && !payload.buCode && 'BU-Code is required',
      isRequired: true
    },
    {
      control: TEXT_FIELD,
      key: 'projectGroup',
      label: 'Project Group',
      columnWidth: 12,
      groupStyle: { marginBottom: '1rem' },
      isError: isError && !payload.projectGroup,
      helperText: isError && !payload.projectGroup && 'Project Group is required',
      isRequired: true
    }
  ];

  const updatePayload = (pairs) => setPayload({ ...payload, ...pairs });

  const handleChangeData = (key, val) => {
    updatePayload({ [key]: val });
    if (key === 'country') {
      const country = SEVICE_DASHBOARD_FILTER_MASTER_DATA.OFFICE.find((office) => office.country === val);
      if (country) {
        dispatch({ type: POST_OFFICE, data: country.offices });
      }
    }
  };

  const handleClickSave = () => {
    const {
      country,
      region,
      projectClassification,
      businessType,
      subType,
      projectType,
      code,
      projectBusinessCategory,
      hourCostCatId,
      fdBusinessUnit,
      hourCostCatDescription,
      buCode,
      projectGroupDescription,
      projectGroup
    } = payload;
    if (
      !country ||
      !region ||
      !businessType ||
      !subType ||
      !code ||
      !projectBusinessCategory ||
      !hourCostCatId ||
      !hourCostCatDescription ||
      !projectGroupDescription ||
      !projectClassification ||
      !projectType ||
      !fdBusinessUnit ||
      !buCode ||
      !projectGroup
    ) {
      setIsError(true);
    } else {
      setIsError(false);
      if (state?.id) {
        const item = ProjectEquivalencyTableData.find((x) => x.id === state?.id);
        if (item) {
          item.id = state?.id;
          item.country = country;
          item.region = region;
          item.projectClassification = projectClassification;
          item.businessType = businessType;
          item.subType = subType;
          item.projectType = projectType;
          item.code = code;
          item.projectBusinessCategory = projectBusinessCategory;
          item.hourCostCatId = payload?.hourCostCatId;
          item.fdBusinessUnit = fdBusinessUnit;
          item.hourCostCatDescription = hourCostCatDescription;
          item.buCode = buCode;
          item.projectGroupDescription = projectGroupDescription;
          item.projectGroup = projectGroup;
        }
        setOpenDialog(true);
        setTimeout(() => {
          navigate('/projectEquivalency');
        }, 2000);
      } else {
        ProjectEquivalencyTableData.push({
          id: new Date().getTime(),
          country,
          region,
          projectClassification,
          businessType,
          subType,
          projectType,
          code,
          projectBusinessCategory,
          hourCostCatId,
          fdBusinessUnit,
          hourCostCatDescription,
          buCode,
          projectGroupDescription,
          projectGroup
        });
        setOpenDialog(true);
        setTimeout(() => {
          navigate('/projectEquivalency');
        }, 2000);
      }
    }
  };

  const handleCloseDialog = () => setOpenDialog(false);

  useEffect(() => {
    if (isEditFlag) {
      const {
        id,
        country,
        region,
        projectClassification,
        businessType,
        subType,
        projectType,
        code,
        projectBusinessCategory,
        hourCostCatId,
        fdBusinessUnit,
        hourCostCatDescription,
        buCode,
        projectGroupDescription,
        projectGroup
      } = state;
      setPayload({
        ...payload,
        id,
        country,
        region,
        projectClassification,
        businessType,
        subType,
        projectType,
        code,
        projectBusinessCategory,
        hourCostCatId,
        fdBusinessUnit,
        hourCostCatDescription,
        buCode,
        projectGroupDescription,
        projectGroup
      });
    }
  }, [isEditFlag]);

  return (
    <Paper>
      <DialogComponent
        open={openDialog}
        handleClose={handleCloseDialog}
        title={`Project group ${isEditFlag ? 'updated' : 'added'} successfully`}
        isProceedButton={false}
        isCancelButton
        cancelButtonText="Ok"
      />
      <Container className="add-project-equivalency-cls">
        <Grid container spacing={3}>
          <Grid mt={1} item xs={12}>
            <Typography align="center" variant="h5">
              {`${isEditFlag ? 'Edit' : 'Add'} Project Equivalency`}
            </Typography>
          </Grid>
        </Grid>

        {/* Grid Container for form component */}
        <Grid mt={2} p={1} container spacing={3}>
          <Grid item xs={12} sm={7}>
            <Grid container spacing={3}>
              {componentsSet1?.map((comp, ind) => (
                <RenderComponent key={ind} metaData={comp} payload={payload} ind={1} handleChange={handleChangeData} />
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Grid container spacing={3}>
              {componentsSet2?.map((comp, ind) => (
                <RenderComponent key={ind} metaData={comp} payload={payload} ind={1} handleChange={handleChangeData} />
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Container for Save and Cancel */}
        <Grid container spacing={3}>
          <Grid className="save-cancel-btn-cls" item xs={12}>
            <Button
              onClick={() => navigate('/projectEquivalency')}
              variant="contained"
              className="cancel-btn"
              color="warning"
              size="small"
            >
              Cancel
            </Button>
            <Button size="small" style={{ boxShadow: 'none' }} onClick={() => handleClickSave()} variant="contained">
              Save
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}

export default AddProjectEquivalency;
