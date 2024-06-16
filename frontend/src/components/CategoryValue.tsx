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

  useEffect(() => {
    retrieveCategoryValue();
  }, []);

  const retrieveCategoryValue = () => {
    CategoryValueService.getAll()
      .then((response) => {
        setCategoryValues(response.data);
      })
      .catch((e) => {
        console.log(e);
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
    };
    setCategoryValues((prev) =>
      prev.map((item) =>
        item.id === ChangesCategoryValue.id ? ChangesCategoryValue : item
      )
    );
  };

  const handleSaveCategoryValue = async (
    id: number,
    updatedCategoryValue: CategoryValueTab
  ) => {
    const inApiCategoryValue: CategoryValuecCeateUpdate = {
      id: updatedCategoryValue.id,
      name: updatedCategoryValue._name,
      category_id: updatedCategoryValue._category_id,
    };

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
      };
      setCategoryValues(
        CategoryValues.map((categoryValue) =>
          categoryValue.id === id ? inStateCategoryValue : categoryValue
        )
      );
    } catch (error) {
      // setErrorApi(error instanceof Error ? error.message : 'Неизвестная ошибка');
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
    CategoryValueService.remove(id)
      .then((response) => {
        setCategoryValues(
          CategoryValues.filter((categoryValues) => categoryValues.id !== id)
        );
      })
      .catch((e) => {
        console.log(e);
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
                    onChange={(e) => {
                      const updatedCategoryValue: CategoryValueTab = {
                        ...item,
                        ...{ _name: e.target.value },
                      };
                      handleUpdateCategoryValue(item.id, updatedCategoryValue);
                    }}
                  />
                )}
                {!item.changes && <>{item.name}</>}
              </TableCell>

              <TableCell>
                {item.changes && (
                  <AsyncSelect
                    loadOptions={loadOptions}
                    onChange={(selectOpt: any) => {
                      const updatedCategoryValue = {
                        ...item,
                        ...{
                          _category_name: selectOpt?.label,
                          _category_id: Number(selectOpt.value),
                        },
                      };
                      handleUpdateCategoryValue(item.id, updatedCategoryValue);
                    }}
                  />
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

                <IconButton
                  onClick={() => handleDeleteCategoryValue(item.id)}
                  aria-label="delete"
                  color="warning"
                >
                  <DeleteIcon />
                </IconButton>

                {item.changes && (
                  <IconButton onClick={() => handleCancel(item.id)}>
                    <CancelIcon/>
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryValueList;
