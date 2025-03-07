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
import { ASSEST_BASE_URL, ERROR_TEXT, ROUTE } from "@/constants";
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
  priority: "",
  status: "",
  description: "",
  assign_to: "",
};

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
}));

import { getPriorityIconById } from "@/utils";

export const TASK_PRIORITY_MENU_OPTIONS = [
  {
    label: (
      <CustomOptions
        img={getPriorityIconById("highest")}
        label={"Highest"}
        isAvatar={false}
        isIcon={true}
      />
    ),
    value: "highest",
  },
  {
    label: (
      <CustomOptions
        img={getPriorityIconById("high")}
        label={"High"}
        isAvatar={false}
        isIcon={true}
      />
    ),
    value: "high",
  },
  {
    label: (
      <CustomOptions
        img={getPriorityIconById("medium")}
        label={"medium"}
        isAvatar={false}
        isIcon={true}
      />
    ),
    value: "medium",
  },
  {
    label: (
      <CustomOptions
        img={getPriorityIconById("low")}
        label={"Low"}
        isAvatar={false}
        isIcon={true}
      />
    ),
    value: "low",
  },
  {
    label: (
      <CustomOptions
        img={getPriorityIconById("lowest")}
        label={"Lowest"}
        isAvatar={false}
        isIcon={true}
      />
    ),
    value: "lowest",
  },
];

const AddEditTask = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditMode = Boolean(id);

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [postApi, setPostApi] = useState(null);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    priority: Yup.string().required("Priority is required"),
    assign_to: Yup.string().required("Assign To is required"),
    status: isEditMode
      ? Yup.string().required("Status is required")
      : Yup.mixed().nullable(),
    description: Yup.string().required("Description is required"),
  });

  const REGISTER_FORM = [
    { id: "title", label: "Title", component: "TEXT" },
    {
      id: "priority",
      label: "Priority",
      component: "SELECT",
      options: TASK_PRIORITY_MENU_OPTIONS,
    },
    isEditMode && {
      id: "status",
      label: "Status",
      component: "SELECT",
      options: TASK_STATUS_MENU_OPTIONS,
    },
    {
      id: "description",
      label: "Description",
      component: "TEXT_AREA",
    },
  ];

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
      const response = await getApi(`${API.GET_TASK_BY_ID}/${id}`);
      if (!response.error) {
        const {
          data: { data },
        } = response;
        if (data) {
          formik.setValues({
            title: data?.title,
            description: data?.description,
            status: data?.status,
            assign_to: data?.assign_to?.id,
            priority: data?.priority,
          });

          setSelectedOption({
            label: data?.assign_to?.name,
            value: data?.assign_to?.id,
            image: `${ASSEST_BASE_URL}${data?.assign_to?.image}`,
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
      const apiUrl = isEditMode ? API.UPDATE_TASK : API.CREATE_TASK;

      let payload = {
        title: values?.title,
        priority: values?.priority,
        description: values?.description,
        assign_to: values?.assign_to,
      };
      if (isEditMode) {
        payload.status = values.status;
        payload.id = id;
      }

      const response = await postApi(apiUrl, payload);
      if (response?.error) {
        ToastMessage("error", response?.message);
      } else {
        router.push(ROUTE.TASK_MANAGEMENT);
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

        const userOptions = userDataList.map((user) => ({
          label: user.name,
          value: user.id,
          image: user.image ? `${ASSEST_BASE_URL}${user.image}` : null,
        }));

        setOptions(userOptions);
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

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    setFieldValue("assign_to", value.value);
  };

  return (
    <Fragment>
      <PageHeader
        text={isEditMode ? "Edit Task" : "Add Task"}
        buttonText="Back"
        onButtonClick={() => router.back()}
        icon={<ArrowBackIcon height={20} width={20} />}
      />

      <Paper className="mt-5 min-h-[60vh] p-12 bg-white shadow-md rounded-lg">
        <StyledForm noValidate onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Autocomplete
              freeSolo
              options={options}
              value={selectedOption}
              getOptionLabel={(option) => option.label || ""}
              loading={loading}
              onInputChange={handleSearch}
              onChange={(event, newValue) => {
                setSelectedOption(newValue);
                setFieldValue("assign_to", newValue?.value || "");
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  <CustomOptions
                    img={option.image}
                    label={option.label}
                    isAvatar={true}
                  />
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign To"
                  variant="outlined"
                  className="w-full"
                  error={!!errors.assign_to}
                  helperText={errors.assign_to || ""}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: selectedOption && (
                      <CustomOptions
                        img={selectedOption.image}
                        label={selectedOption.label}
                        isAvatar={true}
                      />
                    ),
                  }}
                />
              )}
            />

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

export default withLayout(AddEditTask);

// (
//   <CustomOptions
//     img={`${ASSEST_BASE_URL}${data?.user?.image}`}
//     label={data?.user?.name}
//     isAvatar={true}
//   />
// )
