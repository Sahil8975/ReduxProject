import React, { useEffect } from 'react';
import { Grid, Typography, Divider } from '@mui/material';
import { isArray } from '../../../utils/utils';

function ServicemanCardDetails({ data }) {
  return (
    <Grid style={{ border: '1px solid black' }} p={0.5}>
      {/* Grid for Service Details heading */}

      <Grid item xs={12} sm={12} mt={1}>
        <Typography variant="subtitle2" fontSize="14px" fontWeight="900">
          Customer Details
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={3} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px">
              Name:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
              {data.customerName}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={3} className="pd-t-0 ">
            <Typography variant="subtitle2" fontSize="12px">
              Number:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
              {data.accountNumber}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={3} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px">
              Address:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
              {data.customerAddress}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* Project Detail */}
      <Grid item xs={12} sm={12} mt={1}>
        <Typography variant="subtitle2" fontSize="14px" fontWeight="900">
          Project Details
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={3} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px">
              Project Number:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
              {data.projectNumber}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={3} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px">
              Location Name:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
              {data.projectLocationName}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={3} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px">
              Location Address:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
              {data.projectAddress}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* Contact Detail */}
      <Grid item xs={12} sm={12} mt={1}>
        <Typography variant="subtitle2" fontSize="14px" fontWeight="900">
          Contact Details
        </Typography>

        {isArray(data?.contactDetails) &&
          data?.contactDetails?.map((item) => (
            <>
              {item.isPrimary && (
                <>
                  <Typography variant="subtitle2" fontSize="12px">
                    Primary
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} sm={3} className="pd-t-0">
                      <Typography variant="subtitle2" fontSize="12px">
                        Name:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={9} className="pd-t-0">
                      <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
                        {item.name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} sm={3} className="pd-t-0">
                      <Typography variant="subtitle2" fontSize="12px">
                        Designation:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={9} className="pd-t-0">
                      <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
                        {item.title}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} sm={3} className="pd-t-0">
                      <Typography variant="subtitle2" fontSize="12px">
                        Contact Number:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={9} className="pd-t-0">
                      <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
                        {(isArray(item?.mobileNumbers) || isArray(item?.phoneNumbers)) &&
                          (item?.phoneNumbers).concat(item?.mobileNumbers).map((m, index) => (
                            <>
                              <span key={`${m}-${index}`}>{(index ? ', ' : '') + m}</span>
                            </>
                          ))}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
            </>
          ))}

        {/* Alternate */}

        {isArray(data?.contactDetails) &&
          data?.contactDetails?.map((item) => (
            <>
              {!item.isPrimary && (
                <>
                  {/* <Grid item xs={12} sm={12}> */}
                  <Typography variant="subtitle2" fontSize="12px">
                    Alternate
                  </Typography>
                  <Grid container>
                    <Grid item xs={12} sm={3} className="pd-t-0">
                      <Typography variant="subtitle2" fontSize="12px">
                        Name:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={9} className="pd-t-0">
                      <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
                        {item.name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} sm={3} className="pd-t-0">
                      <Typography variant="subtitle2" fontSize="12px">
                        Designation:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={9} className="pd-t-0">
                      <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
                        {item.title}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} sm={3} className="pd-t-0">
                      <Typography variant="subtitle2" fontSize="12px">
                        Contact Number:
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={9} className="pd-t-0">
                      <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
                        {(isArray(item?.mobileNumbers) || isArray(item?.phoneNumbers)) &&
                          (item?.phoneNumbers).concat(item?.mobileNumbers).map((m, index) => (
                            <>
                              <span key={`${m}-${index}`}>{(index ? ', ' : '') + m}</span>
                            </>
                          ))}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
            </>
          ))}
      </Grid>
      {/* Service Details */}

      <Grid item xs={12} sm={12}>
        <Typography variant="subtitle2" fontSize="14px" fontWeight="900">
          Service Details
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={3} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px">
              Scheduled date:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
              {data.scheduledDate}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={3} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px">
              Overdue days:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
              {data.noOfDaysOverdue}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={3} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px">
              Ops Admin's Note:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
              {data.serviceOrderNote}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12}>
        <Typography variant="subtitle2" fontSize="14px" fontWeight="900">
          Last Service Details
        </Typography>
        <Grid container>
          <Grid item xs={12} sm={3} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px">
              Date & Type:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
              {data.previousDateAndType}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={3} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px">
              Note from Serviceman:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
              {data.previousPerformedServicemanNote}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Grid container>
          <Grid item xs={12} sm={3} className="pd-t-0">
            <Typography variant="subtitle2" fontSize="14px" fontWeight="900">
              Previous Service Dates:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} className="pd-t-0">
            {isArray(data?.serviceDates) &&
              data.serviceDates.map((item) => (
                <>
                  <Grid>
                    <Typography variant="subtitle2" fontSize="12px" className="ft-wt-400">
                      {item}
                    </Typography>
                  </Grid>
                </>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ServicemanCardDetails;
