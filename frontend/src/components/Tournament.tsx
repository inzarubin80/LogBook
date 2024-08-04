import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AsyncSelect from "react-select/async";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTheme } from '@mui/material';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import {
  service, createUpdateType
} from "../service/Tournament";

interface valueTab {
  id: number;
  name: string;
  begin_date_tournament: Dayjs;
  end_date_tournament: Dayjs;
  type_of_tornament_id: number;
  type_of_tornament_name: string;
  venue: string;
  changes: boolean;

  _name: string;
  _begin_date_tournament: Dayjs;
  _end_date_tournament: Dayjs;
  _type_of_tornament_id: number;
  _type_of_tornament_name: string;
  _venue: string;

  errorName: string;
  errorBeginDateTournament: string;
  errorEndDateTournament: string;
  errorTypeOfTornament: string;
  errorVenue: string;
}

const loadOptionsTypeTournament = (inputValue, callback) => {
  service.getTypeTournamentByName(inputValue)
    .then((response) => {
      callback(
        response.data.map((item) => ({
          value: item.id.toString(),
          label: item.name,
        }))
      );
    })
    .catch((e) => {
      console.log(e);
    });
};

const List: React.FC = () => {
  const [values, setValues] = useState<valueTab[]>([]);
  const [errorApi, setErrorApi] = React.useState<string | null>(null);

  const theme = useTheme();
  const errorColor = theme.palette.error.main;
  const errorFontSize = theme.typography.caption.fontSize;


  useEffect(() => {
    retrieve();
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

  const handleChangeBeginDateTournament = (newValue: Dayjs | null, item: valueTab) => {
    const updatedTable: valueTab = {
      ...item,
      _begin_date_tournament: newValue ? newValue : dayjs(), // Provide a default value if newValue is null
      errorBeginDateTournament: "",
    };
    handleUpdate(item.id, updatedTable);
  };

  const handleChangeEndDateTournament = (newValue: Dayjs | null, item: valueTab) => {
    const updatedTable: valueTab = {
      ...item,
      _end_date_tournament: newValue ? newValue : dayjs(), // Provide a default value if newValue is null
      errorEndDateTournament: "",
    };
    handleUpdate(item.id, updatedTable);
  };

  const retrieve = () => {
    setErrorApi(null);

    service.getAll()
      .then((response) => {
        setValues(response.data);
      })
      .catch((e) => {
        setErrorApi(e instanceof Error ? e.message : "Неизвестная ошибка");
      });
  };

  const handleCreate = () => {
    setValues((prev) => [
      ...prev,
      {
        id: 0,
        name: "",
        begin_date_tournament: dayjs(),
        end_date_tournament: dayjs(),
        type_of_tornament_id: 0,
        type_of_tornament_name: "",
        venue: "",
        changes: true,

        _name: "",
        _begin_date_tournament: dayjs(),
        _end_date_tournament: dayjs(),
        _type_of_tornament_id: 0,
        _type_of_tornament_name: "",
        _venue: "",

        errorName: "",
        errorBeginDateTournament: "",
        errorEndDateTournament: "",
        errorTypeOfTornament: "",
        errorVenue: "",
      },
    ]);
  };

  const handleChanges = (value: valueTab) => {
    const ChangesValue = {
      ...value,
      _name: value.name,
      _begin_date_tournament: value.begin_date_tournament,
      _end_date_tournament: value.end_date_tournament,
      _type_of_tornament_id: value.type_of_tornament_id,
      _type_of_tornament_name: value.type_of_tornament_name,
      _venue: value.venue,

      changes: true,
      errorName: "",
      errorBeginDateTournament: "",
      errorEndDateTournament: "",
      errorTypeOfTornament: "",
      errorVenue: "",

    };
    setValues((prev) =>
      prev.map((item) =>
        item.id === value.id ? ChangesValue : item
      )
    );
  };


  const validation = (updatedTable: valueTab) => {

    let isValid = true;


    const emptyValueError = "Не заполнено значение поля";


    if (updatedTable._type_of_tornament_id === 0) {
      isValid = false
    }

    updatedTable = {
      ...updatedTable,
      errorTypeOfTornament: updatedTable._type_of_tornament_id === 0 ? emptyValueError : ""
    }

    handleUpdate(updatedTable.id, updatedTable)

    return isValid;

  }

  const handleSave = async (id: number, updatedTable: valueTab) => {

    const inApiScoreScale: createUpdateType = {

      id: updatedTable.id,
      name: updatedTable._name,
      begin_date_tournament: updatedTable._begin_date_tournament,
      end_date_tournament: updatedTable._end_date_tournament,
      type_of_tornament_id: updatedTable._type_of_tornament_id,
      venue: updatedTable._venue,
    };


    if (validation(updatedTable) !== true) {
      return;
    }

    try {
      const response = await service.createUpdate(
        inApiScoreScale
      );
      const responseTable = response.data;
      const inStateTable: valueTab = {
        id: responseTable.id,
        name: updatedTable._name,
        begin_date_tournament: updatedTable._begin_date_tournament,
        end_date_tournament: updatedTable._end_date_tournament,
        type_of_tornament_id: updatedTable._type_of_tornament_id,
        type_of_tornament_name: updatedTable._type_of_tornament_name,
        venue: updatedTable._venue,
        changes: false,

        _name: "",
        _begin_date_tournament: updatedTable._begin_date_tournament,
        _end_date_tournament: updatedTable._end_date_tournament,
        _type_of_tornament_id: 0,
        _type_of_tornament_name: "",
        _venue: "",

        errorName: "",
        errorBeginDateTournament: "",
        errorEndDateTournament: "",
        errorTypeOfTornament: "",
        errorVenue: "",
      };
      setValues(
        values.map((value) =>
          value.id === id ? inStateTable : value
        )
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

  const handleUpdate = async (
    id: number,
    updatedTable: valueTab
  ) => {
    const item = values.find((item) => item.id === id);
    const updateItem = { ...item, ...updatedTable };
    setValues((prev) =>
      prev.map((item) => (item.id === id ? updateItem : item))
    );
  };

  const handleDelete = (id: number) => {
    setErrorApi(null);

    service.remove(id)
      .then((response) => {
        setValues(
          values.filter((values) => values.id !== id)
        );
      })
      .catch((e) => {
        setErrorApi(e instanceof Error ? e.message : "Неизвестная ошибка");
      });
  };
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Турниры
      </Typography>
      <div>
        <IconButton
          onClick={handleCreate}
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
            <TableCell>Дата начала</TableCell>
            <TableCell>Дата окончания</TableCell>
            <TableCell>Тип турнира</TableCell>
            <TableCell>Месо проведения</TableCell>
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
                    // fullWidth

                    error={!!item.errorName}
                    helperText={item.errorName}

                    onChange={(e) => {
                      const updatedTable: valueTab = {
                        ...item,
                        ...{ _name: e.target.value, errorName: "" },
                      };
                      handleUpdate(item.id, updatedTable);
                    }}
                  />
                )}
                {!item.changes && <>{item.name}</>}
              </TableCell>

              {/* <TableCell>
                {item.changes && (
                  <TextField
                    value={item._begin_date_tournament}
                    // fullWidth

                    error={!!item.errorBeginDateTournament}
                    helperText={item.errorBeginDateTournament}

                    onChange={(e) => {
                      const updatedTable: valueTab = {
                        ...item,
                        ...{ _begin_date_tournament: new Date(e.target.value), errorBeginDateTournament: "" },
                      };
                      handleUpdate(item.id, updatedTable);
                    }}
                  />
                )}
                {!item.changes && <>{item.begin_date_tournament}</>}
                
              </TableCell> */}

              <TableCell>
                {item.changes && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        format="DD.MM.YYYY"
                        defaultValue={dayjs(item._begin_date_tournament)}
                        onChange={(newValue) => {
                          handleChangeBeginDateTournament(newValue, item);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                )}
                {!item.changes && (
                  <>{dayjs(item.begin_date_tournament).format("DD.MM.YYYY")}</>
                )}
              </TableCell>

              {/* <TableCell>
              
                {item.changes && (
                  <TextField
                    value={item._end_date_tournament}
                    // fullWidth

                    error={!!item.errorEndDateTournament}
                    helperText={item.errorEndDateTournament}

                    onChange={(e) => {
                      const updatedTable: valueTab = {
                        ...item,
                        ...{ _end_date_tournament: new Date(e.target.value), errorEndDateTournament: "" },
                      };
                      handleUpdate(item.id, updatedTable);
                    }}
                  />
                )}
                {!item.changes && <>{item.end_date_tournament}</>}

              </TableCell> */}

              <TableCell>
                {item.changes && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        format="DD.MM.YYYY"
                        defaultValue={dayjs(item._end_date_tournament)}
                        onChange={(newValue) => {
                          handleChangeEndDateTournament(newValue, item);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                )}
                {!item.changes && (
                  <>{dayjs(item.end_date_tournament).format("DD.MM.YYYY")}</>
                )}

              </TableCell>

              <TableCell>
                {item.changes && (

                  <>

                    <AsyncSelect
                      value={{
                        value: item._type_of_tornament_id,
                        label: item._type_of_tornament_name
                      }}
                      loadOptions={loadOptionsTypeTournament}
                      onChange={(selectOpt: any) => {
                        const updatedTable = {
                          ...item,
                          ...{
                            _type_of_tornament_name: selectOpt?.label,
                            _type_of_tornament_id: Number(selectOpt.value),
                            errorTypeOfTornament: "",
                          },
                        };
                        handleUpdate(item.id, updatedTable);
                      }}

                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: item.errorTypeOfTornament !== "" ? errorColor : '',
                          padding: 0
                        }),
                      }}

                    />

                    {item.errorTypeOfTornament && <p style={{ color: errorColor, fontSize: errorFontSize }}>{item.errorTypeOfTornament}</p>}

                  </>

                )}
                {!item.changes && <>{item.type_of_tornament_name}</>}
              </TableCell>

              <TableCell>
                {item.changes && (
                  <TextField
                    value={item._venue}
                    fullWidth

                    error={!!item.errorVenue}
                    helperText={item.errorVenue}

                    onChange={(e) => {
                      const updatedTable: valueTab = {
                        ...item,
                        ...{ _venue: e.target.value, errorVenue: "" },
                      };
                      handleUpdate(item.id, updatedTable);
                    }}
                  />
                )}
                {!item.changes && <>{item.venue}</>}
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

                {!item.changes && <IconButton
                  onClick={() => handleDelete(item.id)}
                  aria-label="delete"
                  color="warning"
                >
                  <DeleteIcon />
                </IconButton>
                }
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
