import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import { Paper, Tooltip } from '@mui/material';
import { isArray } from '../../utils/utils';
import { getAllServiceSubjectsForProject } from '../../services/projectService';
import { APIS, API_V1 } from '../../utils/apiList';

export default function ServiceSubjectGrid({ projectIdFromLocState, navigateToEditServiceSubject }) {
  const [serviceSubjects, setServiceSubjects] = useState([]);

  const getServiceSubjects = async () => {
    const res = await getAllServiceSubjectsForProject(
      `${API_V1}/${APIS.GET_SERVICE_SUBJECTS}=${projectIdFromLocState}`
    );
    if (res.isSuccessful && res.data) {
      setServiceSubjects([...res.data]);
    }
  };

  useEffect(() => {
    getServiceSubjects();
  }, [projectIdFromLocState]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          {!isArray(serviceSubjects) && <caption style={{ textAlign: 'center' }}>No Service subjects added</caption>}
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Service Subject Name</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Ownership</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isArray(serviceSubjects) &&
              serviceSubjects.map((row, ind) => (
                <TableRow key={ind} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{ind + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {row.serviceSubjectName}
                  </TableCell>
                  <TableCell component="th" scope="row" style={{ paddingLeft: '18px' }}>
                    {row.serviceSubjectQuantity}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.ownership}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Tooltip title="Click to edit Service Subject">
                      <EditIcon
                        style={{ cursor: 'pointer', marginLeft: '1.5rem', textAlign: 'center', fontSize: '1rem' }}
                        onClick={() => navigateToEditServiceSubject(row.serviceSubjectId)}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
