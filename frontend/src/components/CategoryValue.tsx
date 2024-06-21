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
  CategoryValueService,
  CategoryValuecCeateUpdate,
} from "../service/CategoryValue";

interface CategoryValueTab {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  changes: boolean;
  _name: string;
  _category_id: number;
  _category_name: string;
  errorName: string;
  errorCategory: string;
  

}

const loadOptions = (inputValue, callback) => {
  CategoryValueService.getCategoryByName(inputValue)
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

const CategoryValueList: React.FC = () => {
  const [CategoryValues, setCategoryValues] = useState<CategoryValueTab[]>([]);
  const [errorApi, setErrorApi] = React.useState<string | null>(null);

  const theme = useTheme();
  const errorColor = theme.palette.error.main;
  const errorFontSize = theme.typography.caption.fontSize;


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

    CategoryValueService.getAll()
      .then((response) => {
        setCategoryValues(response.data);
      })
      .catch((e) => {
        setErrorApi(e instanceof Error ? e.message : "Неизвестная ошибка");
      });
  };

  const handleCreateCategoryValue = () => {
    setCategoryValues((prev) => [
      ...prev,
      {
        id: 0,
        name: "",
        category_id: 0,
        category_name: "",
        changes: true,
        _name: "",
        _category_id: 0,
        _category_name: "",
        errorName:"",
        errorCategory:""

      },
    ]);
  };

  const handleChanges = (categoryValue: CategoryValueTab) => {
    const ChangesCategoryValue = {
      ...categoryValue,
      _name: categoryValue.name,
      _category_id: categoryValue.category_id,
      _category_name: categoryValue.category_name,
      changes: true,
      errorName:"",
      errorCategory:""
    };
    setCategoryValues((prev) =>
      prev.map((item) =>
        item.id === ChangesCategoryValue.id ? ChangesCategoryValue : item
      )
    );
  };


  const validation = (updatedCategoryValue: CategoryValueTab) => {

    let isValid = true;

    
    const emptyValueError = "Не заполнено значение поля";


    if (updatedCategoryValue._name==="" ||  updatedCategoryValue._category_id===0)  {
      isValid = false
    }

    updatedCategoryValue = {...updatedCategoryValue, 
      errorName: updatedCategoryValue._name===""?emptyValueError:"", 
    errorCategory: updatedCategoryValue._category_id===0? emptyValueError:""}

    handleUpdateCategoryValue(updatedCategoryValue.id, updatedCategoryValue)

    return isValid;

  }

  const handleSaveCategoryValue = async (id: number,updatedCategoryValue: CategoryValueTab) => {

    const inApiCategoryValue: CategoryValuecCeateUpdate = {
      id: updatedCategoryValue.id,
      name: updatedCategoryValue._name,
      category_id: updatedCategoryValue._category_id,
    };


   if (validation(updatedCategoryValue)!==true) {
    return;
   }
   
    try {
      const response = await CategoryValueService.createUpdate(
        inApiCategoryValue
      );
      const responseCategoryValue = response.data;
      const inStateCategoryValue: CategoryValueTab = {
        id: responseCategoryValue.id,
        name: updatedCategoryValue._name,
        category_id: updatedCategoryValue._category_id,
        category_name: updatedCategoryValue._category_name,
        changes: false,
        _name: "",
        _category_id: 0,
        _category_name: "",
        errorCategory:"",
        errorName:""
      };
      setCategoryValues(
        CategoryValues.map((categoryValue) =>
          categoryValue.id === id ? inStateCategoryValue : categoryValue
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
      setCategoryValues((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCategoryValues((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, changes: false } : item
        )
      );
    }
  };

  const handleUpdateCategoryValue = async (
    id: number,
    updatedCategoryValue: CategoryValueTab
  ) => {
    const item = CategoryValues.find((item) => item.id === id);
    const updateItem = { ...item, ...updatedCategoryValue };
    setCategoryValues((prev) =>
      prev.map((item) => (item.id === id ? updateItem : item))
    );
  };

  const handleDeleteCategoryValue = (id: number) => {
    setErrorApi(null);

    CategoryValueService.remove(id)
      .then((response) => {
        setCategoryValues(
          CategoryValues.filter((categoryValues) => categoryValues.id !== id)
        );
      })
      .catch((e) => {
        setErrorApi(e instanceof Error ? e.message : "Неизвестная ошибка");
      });
  };
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Значения категорий
      </Typography>
      <div>
        <IconButton
          onClick={handleCreateCategoryValue}
          color="primary"
          disabled={CategoryValues.find((item) => item.id === 0) !== undefined}
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
            <TableCell>Категория</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {CategoryValues.map((item) => (
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
                      const updatedCategoryValue: CategoryValueTab = {
                        ...item,
                        ...{ _name: e.target.value, errorName:"" },
                      };
                      handleUpdateCategoryValue(item.id, updatedCategoryValue);
                    }}
                  />
                )}
                {!item.changes && <>{item.name}</>}
              </TableCell>

              <TableCell>
                {item.changes && (
                  
                  <>
                
                  <AsyncSelect
                    value={{
                      value: item._category_id,
                      label: item._category_name
                    }}
                    loadOptions={loadOptions}
                    onChange={(selectOpt: any) => {
                      const updatedCategoryValue = {
                        ...item,
                        ...{
                          _category_name: selectOpt?.label,
                          _category_id: Number(selectOpt.value),
                          errorCategory:"",
                        },
                      };
                      handleUpdateCategoryValue(item.id, updatedCategoryValue);
                    }}

                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: item.errorCategory!=="" ? errorColor : '',
                        padding:0
                      }),
                    }}

                  />

                  {item.errorCategory && <p style={{ color: errorColor, fontSize: errorFontSize}}>{item.errorCategory}</p>}

                  </>

                )}
                {!item.changes && <>{item.category_name}</>}
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
                    onClick={() => handleSaveCategoryValue(item.id, item)}
                    color="default"
                  >
                    <SaveIcon />
                  </IconButton>
                )}

              {!item.changes && <IconButton
                  onClick={() => handleDeleteCategoryValue(item.id)}
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

export default CategoryValueList;
