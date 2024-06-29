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
import { useTheme } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import Select from 'react-select'

import { service, ceateUpdateType } from "../service/Sportsman";

dayjs.locale("ru"); // Устанавливаем русскую локализацию

interface valueTab {
  id: number;
  name: string;
  gender: string;
  date_birth: Dayjs;
  main_coache_id: number;
  main_coache_name: string;
  sport_school_id: number;
  sport_school_name: string;
  insuranse: string;
  changes: boolean;

  _name: string;
  _gender: string;
  _date_birth: Dayjs;
  _main_coache_id: number;
  _main_coache_name: string;
  _sport_school_id: number;
  _sport_school_name: string;
  _insuranse: string;

  errorName: string;
  errorGender: string;
  errorDateBirth: string;
  errorMainCoache: string;
  errorSportSchool: string;
  errorInsuranse: string;
}

const loadOptionsSportSchool = (inputValue, callback) => {
  service
    .getSportSchoolByName(inputValue)
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

const loadOptionsMainCoache = (inputValue, callback) => {
  service
    .getCoacheByName(inputValue)
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

  const handleChangeDateBirth = (newValue: Dayjs | null, item: valueTab) => {
    const updatedTable: valueTab = {
      ...item,
      _date_birth: newValue ? newValue : dayjs(), // Provide a default value if newValue is null
      errorDateBirth: "",
    };
    handleUpdate(item.id, updatedTable);
  };

  const retrieve = () => {
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

  const handleCreate = () => {
    setValues((prev) => [
      ...prev,
      {
        id: 0,
        name: "",
        gender: "",
        date_birth: dayjs(),
        main_coache_id: 0,
        main_coache_name: "",
        sport_school_id: 0,
        sport_school_name: "",
        insuranse: "",
        changes: true,

        _name: "",
        _gender: "",
        _date_birth: dayjs(),
        _main_coache_id: 0,
        _main_coache_name: "",
        _sport_school_id: 0,
        _sport_school_name: "",
        _insuranse: "",

        errorName: "",
        errorGender: "",
        errorDateBirth: "",
        errorMainCoache: "",
        errorSportSchool: "",
        errorInsuranse: "",
      },
    ]);
  };

  const handleChanges = (value: valueTab) => {
    const ChangesValue = {
      ...value,
      _name: value.name,
      _gender: value.gender,
      _date_birth: value.date_birth,
      _main_coache_id: value.main_coache_id,
      _main_coache_name: value.main_coache_name,
      _sport_school_id: value.sport_school_id,
      _sport_school_name: value.sport_school_name,
      _insuranse: value.insuranse,

      changes: true,
      errorName: "",
      errorGender: "",
      errorDateBirth: "",
      errorMainCoache: "",
      errorSportSchool: "",
      errorInsuranse: "",
    };
    setValues((prev) =>
      prev.map((item) => (item.id === value.id ? ChangesValue : item))
    );
  };

  const validation = (updatedTable: valueTab) => {
    let isValid = true;

    const emptyValueError = "Не заполнено значение поля";

    if (
      updatedTable._main_coache_id === 0 ||
      updatedTable._sport_school_id === 0
    ) {
      isValid = false;
    }

    updatedTable = {
      ...updatedTable,
      errorSportSchool:
        updatedTable._sport_school_id === 0 ? emptyValueError : "",
      errorMainCoache:
        updatedTable._main_coache_id === 0 ? emptyValueError : "",
    };

    handleUpdate(updatedTable.id, updatedTable);

    return isValid;
  };

  const handleSave = async (id: number, updatedTable: valueTab) => {
    const inApiScoreScale: ceateUpdateType = {
      id: updatedTable.id,
      name: updatedTable._name,
      gender: updatedTable._gender,
      date_birth: updatedTable._date_birth,
      main_coache_id: updatedTable._main_coache_id,
      sport_school_id: updatedTable._sport_school_id,
      insuranse: updatedTable._insuranse,
    };

    if (validation(updatedTable) !== true) {
      return;
    }

    try {
      const response = await service.createUpdate(inApiScoreScale);
      const responseTable = response.data;
      const inStateTable: valueTab = {
        id: responseTable.id,
        name: updatedTable._name,
        gender: updatedTable._gender,
        date_birth: updatedTable._date_birth,
        main_coache_id: updatedTable._main_coache_id,
        main_coache_name: updatedTable._main_coache_name,
        sport_school_id: updatedTable._sport_school_id,
        sport_school_name: updatedTable._sport_school_name,
        insuranse: updatedTable._insuranse,
        changes: false,
        _name: "",
        _gender: "",
        _date_birth: updatedTable._date_birth,
        _main_coache_id: 0,
        _main_coache_name: "",
        _sport_school_id: 0,
        _sport_school_name: "",
        _insuranse: "",

        errorName: "",
        errorGender: "",
        errorDateBirth: "",
        errorMainCoache: "",
        errorSportSchool: "",
        errorInsuranse: "",
      };
      setValues((prev) =>
        prev.map((value) => (value.id === id ? inStateTable : value))
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

  const handleUpdate = async (id: number, updatedTable: valueTab) => {
    const item = values.find((item) => item.id === id);
    const updateItem = { ...item, ...updatedTable };
    setValues((prev) =>
      prev.map((item) => (item.id === id ? updateItem : item))
    );
  };

  const handleDelete = (id: number) => {
    setErrorApi(null);

    service
      .remove(id)
      .then((response) => {
        setValues(values.filter((values) => values.id !== id));
      })
      .catch((e) => {
        setErrorApi(e instanceof Error ? e.message : "Неизвестная ошибка");
      });
  };
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Спортсмены
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
            <TableCell>ФИО</TableCell>
            <TableCell>Пол</TableCell>
            <TableCell>Дата рождения</TableCell>
            <TableCell>Основной тренер</TableCell>
            <TableCell>Школа</TableCell>
            <TableCell>Страховка</TableCell>
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

              <TableCell>
           
              {item.changes && (
                  <>
                    <Select
                      value={{
                        value: item._gender,
                        label: item._gender,
                      }}
                      
                      
                      options={[
                        { value: 'MALE', label: 'MALE' },
                        { value: 'FEMALE', label: 'FEMALE' },

                      ]}


                      onChange={(selectOpt: any) => {
                        const updatedTable = {
                          ...item,
                          ...{
                            _gender: selectOpt.value,
                            errorMainCoache: "",
                          },
                        };
                        handleUpdate(item.id, updatedTable);
                      }}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor:
                            item.errorMainCoache !== "" ? errorColor : "",
                          padding: 0,
                        }),
                      }}
                    />

                    {item.errorMainCoache && (
                      <p style={{ color: errorColor, fontSize: errorFontSize }}>
                        {item.errorMainCoache}
                      </p>
                    )}
                  </>
                )}

                {!item.changes && <>{item.gender}</>}
              </TableCell>

              <TableCell>
                {item.changes && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        format="DD.MM.YYYY"
                        defaultValue={dayjs(item._date_birth)}
                        onChange={(newValue) => {
                          handleChangeDateBirth(newValue, item);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                )}
                {!item.changes && (
                  <>{dayjs(item.date_birth).format("DD.MM.YYYY")}</>
                )}
              </TableCell>

              <TableCell>
                {item.changes && (
                  <>
                    <AsyncSelect
                      value={{
                        value: item._main_coache_id,
                        label: item._main_coache_name,
                      }}
                      loadOptions={loadOptionsMainCoache}
                      onChange={(selectOpt: any) => {
                        const updatedTable = {
                          ...item,
                          ...{
                            _main_coache_name: selectOpt?.label,
                            _main_coache_id: Number(selectOpt.value),
                            errorMainCoache: "",
                          },
                        };
                        handleUpdate(item.id, updatedTable);
                      }}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor:
                            item.errorMainCoache !== "" ? errorColor : "",
                          padding: 0,
                        }),
                      }}
                    />

                    {item.errorMainCoache && (
                      <p style={{ color: errorColor, fontSize: errorFontSize }}>
                        {item.errorMainCoache}
                      </p>
                    )}
                  </>
                )}
                {!item.changes && <>{item.main_coache_name}</>}
              </TableCell>

              <TableCell>
                {item.changes && (
                  <>
                    <AsyncSelect
                      value={{
                        value: item._sport_school_id,
                        label: item._sport_school_name,
                      }}
                      loadOptions={loadOptionsSportSchool}
                      onChange={(selectOpt: any) => {
                        const updatedTable = {
                          ...item,
                          ...{
                            _sport_school_name: selectOpt?.label,
                            _sport_school_id: Number(selectOpt.value),
                            errorSportSchool: "",
                          },
                        };
                        handleUpdate(item.id, updatedTable);
                      }}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor:
                            item.errorSportSchool !== "" ? errorColor : "",
                          padding: 0,
                        }),
                      }}
                    />

                    {item.errorSportSchool && (
                      <p style={{ color: errorColor, fontSize: errorFontSize }}>
                        {item.errorSportSchool}
                      </p>
                    )}
                  </>
                )}
                {!item.changes && <>{item.sport_school_name}</>}
              </TableCell>

              <TableCell>
                {item.changes && (
                  <TextField
                    value={item._insuranse}
                    fullWidth
                    error={!!item.errorInsuranse}
                    helperText={item.errorInsuranse}
                    onChange={(e) => {
                      const updatedTable: valueTab = {
                        ...item,
                        ...{ _insuranse: e.target.value, errorInsuranse: "" },
                      };
                      handleUpdate(item.id, updatedTable);
                    }}
                  />
                )}
                {!item.changes && <>{item.insuranse}</>}
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
