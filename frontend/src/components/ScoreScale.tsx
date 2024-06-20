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

import {
  ScoreScaleService,
  ScoreScaleCreateUpdate,
} from "../service/ScoreScale";

interface ScoreScaleTab {
  id: number;
  place_from: number;
  place_to: number;
  numbers_of_points: number;
  sport_school_id: number;
  sport_school_name: string;
  type_tournament_id: number;
  type_tournament_name: string;
  changes: boolean;

  _place_from: number;
  _place_to: number;
  _numbers_of_points: number;
  _sport_school_id: number;
  _sport_school_name: string;
  _type_tournament_id: number;
  _type_tournament_name: string;

  errorPlaceFrom: string;
  errorPlaceTo: string;
  errorNumbersOfPoints: string;
  errorSportSchool: string;
  errorTypeTournament: string;
}

const loadOptionsSportSchool = (inputValue, callback) => {
  ScoreScaleService.getSportSchoolByName(inputValue)
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

const loadOptionsTypeTournament = (inputValue, callback) => {
  ScoreScaleService.getTypeTournamentByName(inputValue)
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

const ScoreScaleList: React.FC = () => {
  const [ScoreScales, setScoreScales] = useState<ScoreScaleTab[]>([]);
  const [errorApi, setErrorApi] = React.useState<string | null>(null);

  const theme = useTheme();
  const errorColor = theme.palette.error.main;
  const errorFontSize = theme.typography.caption.fontSize;


  useEffect(() => {
    retrieveScoreScale();
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

  const retrieveScoreScale = () => {
    setErrorApi(null);

    ScoreScaleService.getAll()
      .then((response) => {
        setScoreScales(response.data);
      })
      .catch((e) => {
        setErrorApi(e instanceof Error ? e.message : "Неизвестная ошибка");
      });
  };

  const handleCreateScoreScale = () => {
    setScoreScales((prev) => [
      ...prev,
      {
        id: 0,
        place_from: 0,
        place_to: 0,
        numbers_of_points: 0,
        sport_school_id: 0,
        sport_school_name: "",
        type_tournament_id: 0,
        type_tournament_name: "",
        changes: true,

        _place_from: 0,
        _place_to: 0,
        _numbers_of_points: 0,
        _sport_school_id: 0,
        _sport_school_name: "",
        _type_tournament_id: 0,
        _type_tournament_name: "",

        errorPlaceFrom: "",
        errorPlaceTo: "",
        errorNumbersOfPoints: "",
        errorSportSchool: "",
        errorTypeTournament: "",
      },
    ]);
  };

  const handleChanges = (scoreScale: ScoreScaleTab) => {
    const ChangesScoreScale = {
      ...scoreScale,
      _place_from: scoreScale.place_from,
      _place_to: scoreScale.place_to,
      _numbers_of_points: scoreScale.numbers_of_points,
      _sport_school_id: scoreScale.sport_school_id,
      _sport_school_name: scoreScale.sport_school_name,
      _type_tournament_id: scoreScale.type_tournament_id,
      _type_tournament_name: scoreScale.type_tournament_name,
      changes: true,
      errorPlaceFrom: "",
      errorPlaceTo: "",
      errorNumbersOfPoints: "",
      errorSportSchool: "",
      errorTypeTournament: "",

    };
    setScoreScales((prev) =>
      prev.map((item) =>
        item.id === ChangesScoreScale.id ? ChangesScoreScale : item
      )
    );
  };


  const validation = (updatedScoreScale: ScoreScaleTab) => {

    let isValid = true;


    const emptyValueError = "Не заполнено значение поля";


    if (updatedScoreScale._type_tournament_id === 0 || updatedScoreScale._sport_school_id === 0) {
      isValid = false
    }

    updatedScoreScale = {
      ...updatedScoreScale,
      errorSportSchool: updatedScoreScale._sport_school_id === 0 ? emptyValueError : "",
      errorTypeTournament: updatedScoreScale._type_tournament_id === 0 ? emptyValueError : ""
    }

    handleUpdateScoreScale(updatedScoreScale.id, updatedScoreScale)

    return isValid;

  }

  const handleSaveScoreScale = async (id: number, updatedScoreScale: ScoreScaleTab) => {

    const inApiScoreScale: ScoreScaleCreateUpdate = {
      id: updatedScoreScale.id,
      place_from: updatedScoreScale._place_from,
      place_to: updatedScoreScale._place_to,
      numbers_of_points: updatedScoreScale._numbers_of_points,
      sport_school_id: updatedScoreScale._sport_school_id,
      type_tournament_id: updatedScoreScale._type_tournament_id,
    };


    if (validation(updatedScoreScale) !== true) {
      return;
    }

    try {
      const response = await ScoreScaleService.createUpdate(
        inApiScoreScale
      );
      const responseScoreScale = response.data;
      const inStateScoreScale: ScoreScaleTab = {
        id: responseScoreScale.id,
        place_from: updatedScoreScale._place_from,
        place_to: updatedScoreScale._place_to,
        numbers_of_points: updatedScoreScale._numbers_of_points,
        sport_school_id: updatedScoreScale._sport_school_id,
        sport_school_name: updatedScoreScale._sport_school_name,
        type_tournament_id: updatedScoreScale._type_tournament_id,
        type_tournament_name: updatedScoreScale._type_tournament_name,
        changes: false,
        
        _place_from: 0,
        _place_to: 0,
        _numbers_of_points: 0,
        _sport_school_id: 0,
        _sport_school_name: "",
        _type_tournament_id: 0,
        _type_tournament_name: "",

        errorPlaceFrom: "",
        errorPlaceTo: "",
        errorNumbersOfPoints: "",
        errorSportSchool: "",
        errorTypeTournament: "",
      };
      setScoreScales(
        ScoreScales.map((scoreScale) =>
          scoreScale.id === id ? inStateScoreScale : scoreScale
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
      setScoreScales((prev) => prev.filter((item) => item.id !== id));
    } else {
      setScoreScales((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, changes: false } : item
        )
      );
    }
  };

  const handleUpdateScoreScale = async (
    id: number,
    updatedScoreScale: ScoreScaleTab
  ) => {
    const item = ScoreScales.find((item) => item.id === id);
    const updateItem = { ...item, ...updatedScoreScale };
    setScoreScales((prev) =>
      prev.map((item) => (item.id === id ? updateItem : item))
    );
  };

  const handleDeleteScoreScale = (id: number) => {
    setErrorApi(null);

    ScoreScaleService.remove(id)
      .then((response) => {
        setScoreScales(
          ScoreScales.filter((scoreScales) => scoreScales.id !== id)
        );
      })
      .catch((e) => {
        setErrorApi(e instanceof Error ? e.message : "Неизвестная ошибка");
      });
  };
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Шкала оценок
      </Typography>
      <div>
        <IconButton
          onClick={handleCreateScoreScale}
          color="primary"
          disabled={ScoreScales.find((item) => item.id === 0) !== undefined}
        >
          <AddIcon />
          Добавить
        </IconButton>
      </div>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Место с</TableCell>
            <TableCell>Место по</TableCell>
            <TableCell>Количество очков</TableCell>
            <TableCell>Школа</TableCell>
            <TableCell>Тип турнира</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ScoreScales.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>

              <TableCell>
                {item.changes && (
                  <TextField
                    value={item._place_from}
                    // fullWidth

                    error={!!item.errorPlaceFrom}
                    helperText={item.errorPlaceFrom}

                    onChange={(e) => {
                      const updatedScoreScale: ScoreScaleTab = {
                        ...item,
                        ...{ _place_from: Number(e.target.value), errorPlaceFrom: "" },
                      };
                      handleUpdateScoreScale(item.id, updatedScoreScale);
                    }}
                  />
                )}
                {!item.changes && <>{item.place_from}</>}
              </TableCell>

              <TableCell>
                {item.changes && (
                  <TextField
                    value={item._place_to}
                    // fullWidth

                    error={!!item.errorPlaceTo}
                    helperText={item.errorPlaceTo}

                    onChange={(e) => {
                      const updatedScoreScale: ScoreScaleTab = {
                        ...item,
                        ...{ _place_to: Number(e.target.value), errorPlaceTo: "" },
                      };
                      handleUpdateScoreScale(item.id, updatedScoreScale);
                    }}
                  />
                )}
                {!item.changes && <>{item.place_to}</>}
              </TableCell>

              <TableCell>
                {item.changes && (
                  <TextField
                    value={item._numbers_of_points}
                    // fullWidth

                    error={!!item.errorNumbersOfPoints}
                    helperText={item.errorNumbersOfPoints}

                    onChange={(e) => {
                      const updatedScoreScale: ScoreScaleTab = {
                        ...item,
                        ...{ _numbers_of_points: Number(e.target.value), errorNumbersOfPoints: "" },
                      };
                      handleUpdateScoreScale(item.id, updatedScoreScale);
                    }}
                  />
                )}
                {!item.changes && <>{item.numbers_of_points}</>}
              </TableCell>

              <TableCell>
                {item.changes && (

                  <>

                    <AsyncSelect
                      loadOptions={loadOptionsSportSchool}
                      onChange={(selectOpt: any) => {
                        const updatedScoreScale = {
                          ...item,
                          ...{
                            _sport_school_name: selectOpt?.label,
                            _sport_school_id: Number(selectOpt.value),
                            errorSportSchool: "",
                          },
                        };
                        handleUpdateScoreScale(item.id, updatedScoreScale);
                      }}

                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: item.errorSportSchool !== "" ? errorColor : '',
                          padding: 0
                        }),
                      }}

                    />

                    {item.errorSportSchool && <p style={{ color: errorColor, fontSize: errorFontSize }}>{item.errorSportSchool}</p>}

                  </>

                )}
                {!item.changes && <>{item.sport_school_name}</>}
              </TableCell>

              <TableCell>
                {item.changes && (

                  <>

                    <AsyncSelect
                      loadOptions={loadOptionsTypeTournament}
                      onChange={(selectOpt: any) => {
                        const updatedScoreScale = {
                          ...item,
                          ...{
                            _type_tournament_name: selectOpt?.label,
                            _type_tournament_id: Number(selectOpt.value),
                            errorTypeTournament: "",
                          },
                        };
                        handleUpdateScoreScale(item.id, updatedScoreScale);
                      }}

                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: item.errorTypeTournament !== "" ? errorColor : '',
                          padding: 0
                        }),
                      }}

                    />

                    {item.errorTypeTournament && <p style={{ color: errorColor, fontSize: errorFontSize }}>{item.errorTypeTournament}</p>}

                  </>

                )}
                {!item.changes && <>{item.type_tournament_name}</>}
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
                    onClick={() => handleSaveScoreScale(item.id, item)}
                    color="default"
                  >
                    <SaveIcon />
                  </IconButton>
                )}

                {!item.changes && <IconButton
                  onClick={() => handleDeleteScoreScale(item.id)}
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

export default ScoreScaleList;
