import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import invoiceData from '../utils/rowExpandTableData.json';
import '../Styles/app.scss';

function Invoice() {
  const products = invoiceData;
  const [expandedRows, setExpandedRows] = useState(null);

  const formatCurrency = (value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const amountBodyTemplate = (rowData) => formatCurrency(rowData.amount);

  const statusOrderBodyTemplate = (rowData) => (
    <span className={`order-badge order-${rowData.status.toLowerCase()}`}>{rowData.status}</span>
  );

  const searchBodyTemplate = () => <Button icon="pi pi-search" />;

  const imageBodyTemplate = (rowData) => (
    <img
      src={`showcase/demo/images/product/${rowData.image}`}
      onError={(e) => (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
      alt={rowData.image}
      className="product-image"
    />
  );

  const priceBodyTemplate = (rowData) => formatCurrency(rowData.price);

  const ratingBodyTemplate = (rowData) => <Rating value={rowData.rating} readOnly cancel={false} />;

  const statusBodyTemplate = (rowData) => (
    <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
  );

  const rowExpansionTemplate = (data) => (
    <div className="orders-subtable">
      <h5>Orders for {data.name}</h5>
      <DataTable value={data.orders} responsiveLayout="scroll">
        <Column field="id" header="Id" sortable />
        <Column field="customer" header="Customer" sortable />
        <Column field="date" header="Date" sortable />
        <Column field="amount" header="Amount" body={amountBodyTemplate} sortable />
        <Column field="status" header="Status" body={statusOrderBodyTemplate} sortable />
        <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate} />
      </DataTable>
    </div>
  );

  return (
    <div>
      <div className="datatable-rowexpansion-demo">
        <div className="card">
          <DataTable
            value={products}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            // onRowExpand={onRowExpand}
            // onRowCollapse={onRowCollapse}
            responsiveLayout="scroll"
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="id"
          >
            <Column expander style={{ width: '3em' }} />
            <Column field="name" header="Name" sortable />
            <Column header="Image" body={imageBodyTemplate} />
            <Column field="price" header="Price" sortable body={priceBodyTemplate} />
            <Column field="category" header="Category" sortable />
            <Column field="rating" header="Reviews" sortable body={ratingBodyTemplate} />
            <Column field="inventoryStatus" header="Status" sortable body={statusBodyTemplate} />
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
