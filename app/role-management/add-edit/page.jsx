"use client";
import { Fragment, useState, useEffect, useCallback } from "react";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import { debounce } from "lodash";

// Project Import
import withLayout from "@/components/hoc/withLayout";
import { PageHeader, CustomOptions } from "@/components";
import {
  ASSEST_BASE_URL,
  ERROR_TEXT,
  ROUTE,
  ACTIVE_IN_ACTIVE_MENU,
} from "@/constants";
import { API } from "@/app/api/apiConstant";
import ToastMessage from "@/components/ToastMessage";
import { getApi } from "@/app/api/clientApi";

//Material UI import
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/system";
import { Paper, Autocomplete, TextField } from "@mui/material";

const FormController = dynamic(() => import("@/components/FormController"), {
  ssr: false,
});

const initialValues = {
  title: "",
  status: "",
  user_list: [],
};

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

const REGISTER_FORM = [
  { id: "title", label: "Title", component: "TEXT" },
  {
    id: "status",
    label: "Status",
    component: "SELECT",
    options: ACTIVE_IN_ACTIVE_MENU,
  },
];

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  status: Yup.string().required("Status is required"),
});

const AddEditRole = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditMode = Boolean(id);

  const [userOptions, setUserOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [postApi, setPostApi] = useState(null);

  useEffect(() => {
    const loadApi = async () => {
      const { postApi } = await import("@/app/api/clientApi");
      setPostApi(() => postApi);
      setLoading(false);
    };
    loadApi();
  }, []);

  useEffect(() => {
    if (isEditMode && getApi) {
      fetchUserData();
    }
  }, [isEditMode, getApi]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getApi(`${API.GET_ROLE_BY_ID}/${id}`);

      if (!response.error) {
        const {
          data: { data },
        } = response;
        if (data) {
          formik.setValues({
            title: data?.name,
            status: data?.status,
          });
        }
      } else {
        ToastMessage("error", response.message);
      }
    } catch (error) {
      ToastMessage("error", "Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      if (!postApi) {
        ToastMessage("error", ERROR_TEXT.API_LOAD_ERROR);
        return;
      }
      const apiUrl = isEditMode ? API.UPDATE_ROLE : API.CREATE_ROLE;
      let payload = {
        name: values?.title,
        status: values?.status,
        users: values?.users,
      };
      if (isEditMode) {
        payload.id = id;
        delete payload.users;
      }

      const response = await postApi(apiUrl, payload);
      if (response?.error) {
        ToastMessage("error", response?.message);
      } else {
        router.push(ROUTE.ROLE_MANAGEMENT);
        ToastMessage("success", isEditMode ? "Task Updated" : "Task Added");
      }
    } catch (error) {
      ToastMessage("error", ERROR_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
    enableReinitialize: true,
  });

  const { setFieldValue, values, handleSubmit, touched, errors, isSubmitting } =
    formik;

  // Debounced API Call
  const fetchSearchResults = useCallback(
    debounce(async (query) => {
      if (!query) return;

      setLoading(true);
      try {
        const response = await getApi(
          `${API.GET_USERS}?search=${query}&type=2&limit=15`
        );

        const userDataList = response?.data?.data?.data;
        console.log("userDataList==>", userDataList);

        const userOptions = userDataList.map((user) => ({
          label: user.name,
          value: user.id,
          image: user.image ? `${ASSEST_BASE_URL}${user.image}` : null,
          role: user?.role?.slug,
        }));

        setUserOptions(userOptions);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
      setLoading(false);
    }, 500),
    []
  );

  // Handle Input Change
  const handleSearch = (event, value) => {
    fetchSearchResults(value);
  };

  return (
    <Fragment>
      <PageHeader
        text={isEditMode ? "Edit Role" : "Add Role"}
        buttonText="Back"
        onButtonClick={() => router.back()}
        icon={<ArrowBackIcon height={20} width={20} />}
      />

      <Paper className="mt-5 min-h-[60vh] p-12 bg-white shadow-md rounded-lg">
        <StyledForm noValidate onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REGISTER_FORM.map((fieldObj) => (
              <FormController
                key={fieldObj?.id}
                fieldObj={fieldObj}
                values={values}
                touched={touched}
                errors={errors}
                setFieldValue={setFieldValue}
              />
            ))}

            {!isEditMode && (
              <Autocomplete
                multiple
                freeSolo
                options={userOptions}
                value={selectedOption || []}
                getOptionLabel={(option) => option.label || ""}
                loading={loading}
                onInputChange={handleSearch}
                onChange={(event, newValue) => {
                  setSelectedOption(newValue);
                  setFieldValue(
                    "user_list",
                    newValue.map((item) => item.value)
                  );
                }}
                renderOption={(props, option) => (
                  <li {...props}>
                    <CustomOptions
                      img={option.image}
                      label={
                        <>
                          {`${option.label}`}{" "}
                          <span style={{ textTransform: "capitalize" }}>
                            ({`${option.role}`})
                          </span>
                        </>
                      }
                      isAvatar={true}
                    />
                  </li>
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <CustomOptions
                      key={index}
                      img={option.image}
                      label={
                        <>
                          {`${option.label}`}{" "}
                          <span style={{ textTransform: "capitalize" }}>
                            ({`${option.role}`})
                          </span>
                        </>
                      }
                      isAvatar={true}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign To"
                    variant="outlined"
                    className="w-full"
                    error={!!errors.user_list}
                    helperText={errors.user_list || ""}
                  />
                )}
              />
            )}
          </div>

          <div className="flex justify-end col-span-1 sm:col-span-2 lg:col-span-4 text-center mt-10">
            <button
              type="submit"
              className="gap-1 flex justify-center items-center bg-[#005B96] border-2 border-[#005B96] 
             rounded-[5px] text-white text-lg font-semibold no-underline p-2 px-5 
             hover:bg-white hover:text-[#005B96] hover:border-[#005B96] 
             transition duration-300 ease-in-out"
            >
              {isSubmitting
                ? "Processing..."
                : isEditMode
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </StyledForm>
      </Paper>
    </Fragment>
  );
};

export default withLayout(AddEditRole);

// const handleOptionChange = (value) => {
//   setSelectedOption(value);
//   setFieldValue("assign_to", value.value);
// };

// const [options, setOptions] = useState([]);
// const [postApi, setPostApi] = useState(null);
