import React, { useEffect, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import Button from '@material-ui/core/Button';

import DTPicker from './DTPicker';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import dataSet from './data/MOCK_DATA.json';

const App = () => {
  const [gridApi, setGridApi] = useState([]);
  const [gridColumnApi, setGridColumnApi] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const formattedDates = dataSet.map((data) => {
      return {
        id: data.id,
        eventTimestamp: new Date(data.eventTimestamp),
      };
    });
    setRowData(formattedDates);
  }, []);

  useEffect(() => {
    console.log(gridApi);
  });

  const resetAppliedFilters = () => {
    gridApi.setFilterModel(null);
  };

  /**
   * Column definitions
   */
  const cols = [
    {
      field: 'eventTimestamp',
      headerName: 'Event Timestamp',
      minWidth: 250,
      maxWidth: 450,
      filter: 'agDateColumnFilter',
      filterParams: {
        defaultOption: 'inRange',
        comparator: timestampFilter, // <- Custom timestamp filter
      },
    },
  ];

  /**
   * Function to run when AG Grid component is ready
   * @param { * } params - Params from AG Grid
   */
  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.addGlobalListener((type, event) => {
      switch (type) {
        case 'filterChanged':
          console.log(event);
          return;
        default:
          return null;
      }
    });
  }

  return (
    <div className="App">
      <Button onClick={resetAppliedFilters} variant="outlined">
        Reset Filters
      </Button>
      <hr />
      <div
        className={'ag-theme-material'}
        style={{ height: '86vh', width: '100%' }}
      >
        <AgGridReact
          onGridReady={onGridReady}
          rowData={rowData}
          rowSelection="multiple"
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            resizable: true,
            sortable: true,
            filter: true,
          }}
          pagination
          columnDefs={cols}
          frameworkComponents={{
            agDateInput: DTPicker,
          }}
        />
      </div>
    </div>
  );
};

/**
 * Timestamp filter function to be passed to comparator
 * in column definition
 * @param { * } filterLocalDate - Date to filter by
 * @param { * } cellValue - Date from table cell
 * @returns 0 | 1 | -1
 */
function timestampFilter(filterLocalDate, cellValue) {
  filterLocalDate = new Date(filterLocalDate);
  // Slice the Z from the end of the timestamp string:
  cellValue = String(cellValue).toLowerCase().includes('z')
    ? cellValue.slice(0, -1)
    : cellValue;
  let filterBy = filterLocalDate.getTime();
  let filterMe = cellValue.getTime();
  if (filterBy === filterMe) {
    return 0;
  }

  if (filterMe < filterBy) {
    return -1;
  }

  if (filterMe > filterBy) {
    return 1;
  }
}

export default App;
