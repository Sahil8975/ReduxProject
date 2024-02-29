import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Grid, Typography } from '@mui/material';
import RenderComponent from '../../components/RenderComponent';
import { COMPONENTS, DATE_FORMAT } from '../../utils/constants';
import GroupBySeviemanView from './GroupByServicemanView';
import { getFormattedDate } from '../../utils/utils';
import { APIS, API_V1 } from '../../utils/apiList';
import { getServiceDetailCard } from '../../services/ServicemanService';
// Service order summary components
import ServicemanServicePreview from './ServiceOrderSummary/ServicemanServicePreview';
import ServicemanServiceReport from './ServiceOrderSummary/ServicemanServiceReport';
import CustomerServicePreview from './ServiceOrderSummary/CustomerServicePreview';
import CustomerServiceReport from './ServiceOrderSummary/CustomerServiceReport';
import ServicemanCardDetails from './ServiceOrderSummary/ServicemanCardDetails';

function ServiceDetailsView({ data, ordersGroupByHandle, startDate, groupBy, passCardFlag, cardFlagCallback }) {
  const { GET_SERVICE_DETAIL_CARD } = APIS;
  const [payload, setPayload] = useState({ serviceDetailsGroupBy: groupBy });
  const { RADIO } = COMPONENTS;

  const groupByType = [
    { name: 'Group by Servicemen', value: 'Group by Serviceman' },
    { name: 'Group by Customers', value: 'Group by Customer' }
  ];

  const serviceType = [
    { name: 'Service Preview', value: 'Service Preview' },
    { name: 'Service Report', value: 'Service Report' }
  ];

  const componentsSet1 = [
    {
      control: RADIO,
      groupStyle: { marginTop: '1rem' },
      key: 'serviceDetailsGroupBy',
      label: '',
      showLabel: true,
      options: groupByType,
      columnWidth: 12
    }
  ];

  const componentsSet2 = [
    {
      control: RADIO,
      groupStyle: { marginTop: '0.5rem', marginBottom: '0.4rem' },
      key: 'serviceType',
      label: '',
      showLabel: true,
      options: serviceType,
      columnWidth: 12
    }
  ];

  const updatePayload = (pairs) => setPayload({ ...payload, ...pairs });

  const handleChangeData = (key, val) => {
    if (key === 'serviceDetailsGroupBy') {
      ordersGroupByHandle(val);
    }
    updatePayload({ [key]: val });
  };
  const [orderId, setData] = useState('');
  const [cardsData, setCardsData] = useState({});
  const passOrderId = (childdata) => setData(childdata);
  useEffect(() => {
    if (orderId) {
      getServiceDetailCardData();
    }
  }, [orderId]);
  const getServiceDetailCardData = async () => {
    if (orderId) {
      const res = await getServiceDetailCard(`${API_V1}/${GET_SERVICE_DETAIL_CARD}?serviceOrderId=${orderId}`);
      if (res?.isSuccessful && res?.data?.orderDetail) {
        setCardsData(res.data.orderDetail);
      }
    }
  };
  return (
    <>
      <Grid container mt={1} xs={6}>
        <Grid item xs={3}>
          <Grid container spacing={4} justifyContent="center">
            <Typography style={{ fontSize: '0.900rem' }}>
              {getFormattedDate(DATE_FORMAT.DATE_NAME_FORMAT, startDate)}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={8} ml={12}>
            {componentsSet1?.map((comp, ind) => (
              <RenderComponent key={ind} metaData={comp} payload={payload} ind={1} handleChange={handleChangeData} />
            ))}{' '}
          </Grid>
        </Grid>
      </Grid>

      {/* Grid Container for Serviceman and Customer View and Summary View */}
      <Grid container spacing={3} mt={1}>
        {/* Grid Section for GroupBySeviemanView and GroupByCustomerView */}
        <Grid item xs={6}>
          <Grid>
            <GroupBySeviemanView
              passOrderId={passOrderId}
              data={data}
              cardFlagCallback={cardFlagCallback}
              isServicemen={payload?.serviceDetailsGroupBy === 'Group by Serviceman'}
            />
          </Grid>
        </Grid>
        <Grid item xs={6}>
          {/* <Grid> */}
          {/* Componet for  servie types */}
          {/* <Grid container spacing={3}>
              {componentsSet2?.map((comp, ind) => (
                <RenderComponent
                  key={ind}
                  metaData={comp}
                  payload={payload}
                  ind={1}
                  handleChange={handleChangeData}
                />
              ))}{' '}
            </Grid>
          </Grid> */}

          {/* card details */}
          <Grid>{orderId && !passCardFlag && <ServicemanCardDetails data={cardsData} />}</Grid>

          {/* Grid components for service order summary components */}
          {/* <Grid>
            {/* Group By === 'Group by Serviceman' && serviceType === 'Service Preview' */}
          {/* {payload?.serviceDetailsGroupBy === 'Group by Serviceman' && payload?.serviceType === 'Service Preview' ? (
              <ServicemanServicePreview />
            ) : null} */}

          {/* Group By === 'Group by Serviceman' && serviceType === 'Service Report' */}
          {/* {payload?.serviceDetailsGroupBy === 'Group by Serviceman' && payload?.serviceType === 'Service Report' ? (
              <ServicemanServiceReport />
            ) : null} */}

          {/* Group By === 'Group by Customer' && serviceType === 'Service Preview' */}
          {/* {payload?.serviceDetailsGroupBy === 'Group by Customer' && payload?.serviceType === 'Service Preview' ? (
              <CustomerServicePreview />
            ) : null} */}

          {/* Group By === 'Group by Customer' && serviceType === 'Service Report' */}
          {/* {payload?.serviceDetailsGroupBy === 'Group by Customer' && payload?.serviceType === 'Service Report' ? (
              <CustomerServiceReport />
            ) : null}
          </Grid>  */}
        </Grid>
      </Grid>
    </>
  );
}

ServiceDetailsView.propTypes = {
  data: PropTypes.object,
  ordersGroupBy: PropTypes.func,
  startDate: PropTypes.string
};

export default ServiceDetailsView;
