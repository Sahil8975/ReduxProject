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

const Tasks = ({ serviceSubjects, tasks, updatePayload, tasksList }) => {
  const { t } = useTranslation();
  const { TEXT_FIELD, AUTOCOMPLETE } = COMPONENTS;

  const handleChange = (key, val, ind) => {
    tasks[ind][key] = val;
    updatePayload({ tasks });
  };

  const deleteTask = (ind) => {
    tasks.splice(ind, 1);
    updatePayload({ tasks });
  };

  return (
    <>
      <Grid item xs={12} sm={12}>
        <Typography variant="h4" align="center">
          {t('addCallout.task')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="task-table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>{t('addCallout.serviceSubject')}</StyledTableCell>
                <StyledTableCell>{t('addCallout.taskName')}</StyledTableCell>
                <StyledTableCell>{t('CreateProject.Note')}</StyledTableCell>
                <StyledTableCell>{t('addCallout.action')}</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {isArray(tasks) &&
                tasks.map((task, ind) => (
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
                          control: AUTOCOMPLETE,
                          key: 'name',
                          label: 'addCallout.taskName',
                          placeholder: 'addCallout.taskName',
                          columnWidth: '8',
                          options: tasksList
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
                          key: 'notes',
                          label: 'addCallout.notes',
                          placeholder: 'addCallout.notes',
                          columnWidth: '8'
                        }}
                        payload={task}
                        ind={ind}
                        handleChange={handleChange}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <EditIcon />
                      <DeleteIcon onClick={() => deleteTask(ind)} />
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

Tasks.propTypes = {
  serviceSubjects: PropTypes.object,
  tasks: PropTypes.object,
  updatePayload: PropTypes.func,
  tasksList: PropTypes.object
};

export default Tasks;
