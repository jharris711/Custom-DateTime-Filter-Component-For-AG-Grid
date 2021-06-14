import React, { useEffect, useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import Button from "@material-ui/core/Button";

import DTPicker from "./DTPicker";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import dataSet from "./data/MOCK_DATA.json";

const App = () => {
  const [gridApi, setGridApi] = useState([]);
  const [gridColumnApi, setGridColumnApi] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const formattedDates = dataSet.map(data => {
      return {
        id: data.id,
        eventTimestamp: new Date(data.eventTimestamp)
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

  const cols = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 100,
      maxWidth: 150
    },
    {
      field: "eventTimestamp",
      headerName: "Event Timestamp",
      minWidth: 225,
      maxWidth: 300,
      filter: "agDateColumnFilter",
      filterParams: {
        defaultOption: "inRange",
        comparator: function(filterLocalDate, cellValue) {
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
      }
    }
  ];

  const onGridReady = params => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.addGlobalListener((type, event) => {
      switch (type) {
        case "filterChanged":
          console.log(event);
          return;
        default:
          return null;
      }
    });
  };

  return (
    <div className="App">
      <Button onClick={resetAppliedFilters} variant="outlined">
        Reset Filters
      </Button>
      <hr />
      <div
        className={"ag-theme-balham"}
        style={{ height: "86vh", width: "100%" }}
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
            filter: true
          }}
          pagination
          columnDefs={cols}
          frameworkComponents={{
            agDateInput: DTPicker
          }}
        />
      </div>
    </div>
  );
};

export default App;
