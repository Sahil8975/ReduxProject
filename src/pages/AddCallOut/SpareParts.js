import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { isArray } from 'lodash';
import RenderComponent from '../../components/RenderComponent';
import { COMPONENTS } from '../../utils/constants';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const SpareParts = ({ serviceSubjects, spareParts, updatePayload }) => {
  const { t } = useTranslation();
  const { TEXT_FIELD, AUTOCOMPLETE } = COMPONENTS;

  const handleChange = (key, val, ind) => {
    spareParts[ind][key] = val;
    updatePayload({ spareParts });
  };

  const deleteSpareParts = (ind) => {
    spareParts.splice(ind, 1);
    updatePayload({ spareParts });
  };

  return (
    <>
      <Grid item xs={12} sm={12}>
        <Typography variant="h4" align="center">
          {t('addCallout.spareParts')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="task-table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>{t('addCallout.serviceSubject')}</StyledTableCell>
                <StyledTableCell>{t('addCallout.description')}</StyledTableCell>
                <StyledTableCell>{t('addCallout.stockCode')}</StyledTableCell>
                <StyledTableCell>{t('addCallout.quantity')}</StyledTableCell>
                <StyledTableCell>{t('addCallout.ratio')}</StyledTableCell>
                <StyledTableCell>{t('addCallout.action')}</StyledTableCell>
                <StyledTableCell>{t('addCallout.discountAmount')}</StyledTableCell>
                <StyledTableCell>{t('addCallout.unitPrice')}</StyledTableCell>
                <StyledTableCell>{t('addCallout.totalPrice')}</StyledTableCell>
                <StyledTableCell>{t('addCallout.errorCode')}</StyledTableCell>
                <StyledTableCell>{t('addCallout.serviceRelatedNote')}</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {isArray(spareParts) &&
                spareParts?.map((task, ind) => (
                  <StyledTableRow key={ind} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <StyledTableCell component="th" scope="row">
                      <RenderComponent
                        metaData={{
                          control: AUTOCOMPLETE,
                          key: 'service',
                          label: 'addCallout.serviceSubject',
                          placeholder: 'addCallout.serviceSubject',
                          columnWidth: '12',
                          options: serviceSubjects
                        }}
                        payload={task}
                        ind={ind}
                        handleChange={handleChange}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <RenderComponent
                        metaData={{
                          control: TEXT_FIELD,
                          key: 'description',
                          label: 'addCallout.description',
                          placeholder: 'addCallout.description',
                          columnWidth: '12'
                        }}
                        payload={task}
                        ind={ind}
                        handleChange={handleChange}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <RenderComponent
                        metaData={{
                          control: TEXT_FIELD,
                          key: 'stockCode',
                          label: 'addCallout.stockCode',
                          placeholder: 'addCallout.stockCode',
                          columnWidth: '12'
                        }}
                        payload={task}
                        ind={ind}
                        handleChange={handleChange}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <RenderComponent
                        metaData={{
                          control: TEXT_FIELD,
                          key: 'quantity',
                          label: 'addCallout.quantity',
                          placeholder: 'addCallout.quantity',
                          columnWidth: '12'
                        }}
                        payload={task}
                        ind={ind}
                        handleChange={handleChange}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <RenderComponent
                        metaData={{
                          control: TEXT_FIELD,
                          key: 'ratio',
                          label: 'addCallout.ratio',
                          placeholder: 'addCallout.ratio',
                          columnWidth: '12'
                        }}
                        payload={task}
                        ind={ind}
                        handleChange={handleChange}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <EditIcon />
                      <DeleteIcon onClick={() => deleteSpareParts(ind)} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <RenderComponent
                        metaData={{
                          control: TEXT_FIELD,
                          key: 'discountAmount',
                          label: 'addCallout.discountAmount',
                          placeholder: 'addCallout.discountAmount',
                          columnWidth: '12'
                        }}
                        payload={task}
                        ind={ind}
                        handleChange={handleChange}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <RenderComponent
                        metaData={{
                          control: TEXT_FIELD,
                          key: 'unitPrice',
                          label: 'addCallout.unitPrice',
                          placeholder: 'addCallout.unitPrice',
                          columnWidth: '12'
                        }}
                        payload={task}
                        ind={ind}
                        handleChange={handleChange}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <RenderComponent
                        metaData={{
                          control: TEXT_FIELD,
                          key: 'totalPrice',
                          label: 'addCallout.totalPrice',
                          placeholder: 'addCallout.totalPrice',
                          columnWidth: '12'
                        }}
                        payload={task}
                        ind={ind}
                        handleChange={handleChange}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <RenderComponent
                        metaData={{
                          control: TEXT_FIELD,
                          key: 'errorCode',
                          label: 'addCallout.errorCode',
                          placeholder: 'addCallout.errorCode',
                          columnWidth: '12'
                        }}
                        payload={task}
                        ind={ind}
                        handleChange={handleChange}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <RenderComponent
                        metaData={{
                          control: TEXT_FIELD,
                          key: 'serviceRelatedNote',
                          label: 'addCallout.serviceRelatedNote',
                          placeholder: 'addCallout.serviceRelatedNote',
                          columnWidth: '12'
                        }}
                        payload={task}
                        ind={ind}
                        handleChange={handleChange}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

SpareParts.propTypes = {
  serviceSubjects: PropTypes.object,
  spareParts: PropTypes.object,
  updatePayload: PropTypes.func
};

export default SpareParts;
