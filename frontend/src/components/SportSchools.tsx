import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material";
import {service, ceateUpdateType } from "../service/SportSchools";

interface valueTab {
  id: number;
  name: string;
  changes: boolean;
  _name: string;
  errorName: string;
}

const List: React.FC = () => {
  const [values, setValues] = useState<valueTab[]>([]);
  const [errorApi, setErrorApi] = React.useState<string | null>(null);

  const theme = useTheme();

  useEffect(() => {
    retrieveCategoryValue();
  }, []);

  const handleCloseErrorApi = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorApi(null);
  };

  const retrieveCategoryValue = () => {
    setErrorApi(null);

    service
      .getAll()
      .then((response) => {
        setValues(response.data);
      })
      .catch((e) => {
        setErrorApi(e instanceof Error ? e.message : "Неизвестная ошибка");
      });
  };

  const handleCreateCategoryValue = () => {
    setValues((prev) => [
      ...prev,
      {
        id: 0,
        name: "",
        changes: true,
        _name: "",
        errorName: "",
        errorCategory: "",
      },
    ]);
  };

  const handleChanges = (value: valueTab) => {
    const changesValue = {
      ...value,
      _name: value.name,
      changes: true,
      errorName: "",
      errorCategory: "",
    };
    setValues((prev) =>
      prev.map((item) => (item.id === value.id ? changesValue : item))
    );
  };

  const validation = (updatedCategoryValue: valueTab) => {
    let isValid = true;

    const emptyValueError = "Не заполнено значение поля";

    if (updatedCategoryValue._name === "") {
      isValid = false;
    }

    updatedCategoryValue = {
      ...updatedCategoryValue,
      errorName: updatedCategoryValue._name === "" ? emptyValueError : "",
    };

    handleUpdate(updatedCategoryValue.id, updatedCategoryValue);

    return isValid;
  };

  const handleSave = async (id: number, updatedValue: valueTab) => {
    const inApiValue: ceateUpdateType = {
      id: updatedValue.id,
      name: updatedValue._name,
    };

    if (validation(updatedValue) !== true) {
      return;
    }

    try {
      const response = await service.createUpdate(inApiValue);
      const responseCategoryValue = response.data;
      const inStateValue: valueTab = {
        id: responseCategoryValue.id,
        name: updatedValue._name,
        changes: false,
        _name: "",
        errorName: "",
      };
      setValues(
        values.map((value) => (value.id === id ? inStateValue : value))
      );
    } catch (error) {
      setErrorApi(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  };

  const handleCancel = (id: number) => {
    if (id === 0) {
      setValues((prev) => prev.filter((item) => item.id !== id));
    } else {
      setValues((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, changes: false } : item
        )
      );
    }
  };

  const handleUpdate = async (id: number, updateValue: valueTab) => {
    const item = values.find((item) => item.id === id);
    const updateItem = { ...item, ...updateValue };
    setValues((prev) =>
      prev.map((item) => (item.id === id ? updateItem : item))
    );
  };

  const handleDelete = (id: number) => {
    setErrorApi(null);

    service
      .remove(id)
      .then((response) => {
        setValues(values.filter((value) => value.id !== id));
      })
      .catch((e) => {
        setErrorApi(e instanceof Error ? e.message : "Неизвестная ошибка");
      });
  };
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Спортивные школы
      </Typography>
      <div>
        <IconButton
          onClick={handleCreateCategoryValue}
          color="primary"
          disabled={values.find((item) => item.id === 0) !== undefined}
        >
          <AddIcon />
          Добавить
        </IconButton>
      </div>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Наименование</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>

              <TableCell>
                {item.changes && (
                  <TextField
                    value={item._name}
                    fullWidth
                    error={!!item.errorName}
                    helperText={item.errorName}
                    onChange={(e) => {
                      const updatedValue: valueTab = {
                        ...item,
                        ...{ _name: e.target.value, errorName: "" },
                      };
                      handleUpdate(item.id, updatedValue);
                    }}
                  />
                )}
                {!item.changes && <>{item.name}</>}
              </TableCell>

              <TableCell>
                {!item.changes && (
                  <IconButton
                    onClick={() => handleChanges(item)}
                    color="default"
                  >
                    <EditIcon />
                  </IconButton>
                )}

                {item.changes && (
                  <IconButton
                    onClick={() => handleSave(item.id, item)}
                    color="default"
                  >
                    <SaveIcon />
                  </IconButton>
                )}

                {!item.changes && (
                  <IconButton
                    onClick={() => handleDelete(item.id)}
                    aria-label="delete"
                    color="warning"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
                {item.changes && (
                  <IconButton onClick={() => handleCancel(item.id)}>
                    <CancelIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
    </div>
  );
};

export default List;
