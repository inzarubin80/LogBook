import React, { useEffect, CSSProperties } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
import Select from "react-select";


import {
  ColourOption,
  colourOptions,
  FlavourOption,
  GroupedOption,
  groupedOptions,
} from './docs/data';


import {
  GridRowsProp,
  GridRowModes,
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
} from "@mui/x-data-grid";

const initialRows: GridRowsProp = [];

interface EditToolbarProps {
  rows: GridRowsProp;
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, rows } = props;
  const disabledAdd = undefined !== rows.find((value) => value.id === -1);

  const handleClick = () => {
    const id = -1;
    setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Typography variant="h4" component="h4" color="primary">
          Значения категорий
        </Typography>
      </GridToolbarContainer>
    );
  }

  return (
    <>
      <CustomToolbar />
      <GridToolbarContainer>
        <Button
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClick}
          disabled={disabledAdd}
        >
          Добавить
        </Button>
      </GridToolbarContainer>
    </>
  );
}

export default function CategoryValue() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const [errorApi, setErrorApi] = React.useState<string | null>(null);

  const handleCloseErrorApi = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorApi(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("api/categoryValue", {
          headers: {
            "X-Requested-With": "XMLHttpRequest", // Замените 'Bearer your-token' на ваш токен авторизации
          },
        });
        setRows(response.data);
      } catch (error) {
        setErrorApi(
          error instanceof Error ? error.message : "Неизвестная ошибка"
        );
      }
    };

    fetchData();
  }, []);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    try {
      await axios.delete(`api/categoryValue/${id}`, {
        timeout: 5000,
        headers: {
          "X-Requested-With": "XMLHttpRequest", // Замените 'Bearer your-token' на ваш токен авторизации
        },
      });
      setRows(rows.filter((row) => row.id !== id));
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    } catch (error) {
      setErrorApi(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    try {
      const response = await axios({
        method: newRow.id === -1 ? "POST" : "PUT",
        url: "api/categoryValue",
        headers: {
          "X-Requested-With": "XMLHttpRequest", // Замените 'Bearer your-token' на ваш токен авторизации
        },
        data: newRow,
        timeout: 3000,
      });
      const updatedRow = response.data;
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    } catch (error) {
      setErrorApi(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }

    return false;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };


  const groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };
  const groupBadgeStyles: CSSProperties = {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 300,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
  };
  
  const formatGroupLabel = (data: GroupedOption) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const paymentOptions = [
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Un Paid" },
  ];

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      type: "number",
      width: 300,
      align: "left",
      headerAlign: "left",
      editable: false,
    },

    {
      field: "name",
      headerName: "Наименование",
      width: 300,
      editable: true,
    },

    {
      field: "category_id",
      headerName: "category_id",
      width: 300,
      editable: true,


      renderEditCell: (params) => {
        return (
      
        <div style={{ display: 'flex', alignItems: 'center', height:300, width: '100%'}}>    
        <Select<ColourOption | FlavourOption, false, GroupedOption>
        defaultValue={colourOptions[1]}
     //   style={{ width: '100%' }}
        options={groupedOptions}
        formatGroupLabel={formatGroupLabel}
      />
    </div> 
    );
      },
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Действия",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, rows },
        }}
      />

      {errorApi !== null && (
        <Snackbar
          open={errorApi !== null}
          autoHideDuration={6000}
          onClose={handleCloseErrorApi}
        >
          <Alert
            onClose={handleCloseErrorApi}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorApi}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
