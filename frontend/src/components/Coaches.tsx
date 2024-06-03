import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

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
  rows:GridRowsProp;
   setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;

}

function EditToolbar(props: EditToolbarProps) {


  const { setRows, setRowModesModel, rows } = props;
   const disabledAdd = (undefined!==rows.find(value=>value.id===-1))



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
          Тренеры
        </Typography>
      </GridToolbarContainer>
    );
  }

  return (
    <>
      <CustomToolbar />
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick} disabled={disabledAdd}>
          Добавить
        </Button>
      </GridToolbarContainer>
    </>
  );
}

export default function Coaches() {

  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("api/coache", {
          headers: {
            "X-Requested-With": "XMLHttpRequest", // Замените 'Bearer your-token' на ваш токен авторизации
          },
        });

        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("получил данные", data)
        setRows(data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
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

  const handleDeleteClick = (id: GridRowId) => async() => {


    try {
      const response = await fetch(`api/coache/${id}`,
        {
          method: 'DELETE',
          headers: {
            "X-Requested-With": "XMLHttpRequest", // Замените 'Bearer your-token' на ваш токен авторизации
          },
          body: JSON.stringify({id}),
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      } else {
        const data = await response.json();
        setRows(rows.filter((row) => row.id !== id));
      }

      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
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
    const response = await fetch("api/coache",
        {
          method: newRow.id === -1 ? "POST": "PUT",
          headers: {
            "X-Requested-With": "XMLHttpRequest", // Замените 'Bearer your-token' на ваш токен авторизации
          },
          body: JSON.stringify(newRow),
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      } else {
   
        const updatedRow = await response.json();
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;

      }
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }

  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      type: "number",
      width: 100,
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

        //processRowUpdate={handleProcessRowUpdate}
        //components={{
        //Toolbar: CustomToolbar,
        // }}

        // components={{Toolbar: DataGridTitle}}

        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, rows},
        }}
      />
    </Box>
  );
}
