"use client";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// Project import
import { PageHeader, CustomTable, ConfirmationModal } from "@/components";
import withLayout from "@/components/hoc/withLayout";
import {
  ROUTE,
  ROLE_ID_BY_NAME,
  FONT_STYLES,
  ASSEST_BASE_URL,
  ACTION_IDENTIFIER,
} from "@/constants";
import { getApi } from "@/app/api/clientApi";
import { API } from "@/app/api/apiConstant";
import { formatDate } from "@/utils";
import ToastMessage from "@/components/ToastMessage";

// Material UI import
import DeleteIcon from "@mui/icons-material/Delete";
import FeedIcon from "@mui/icons-material/Feed";
import { TextField } from "@mui/material";

export const TABEL_ACTION = [
  {
    toolTipLabel: "Delete",
    icon: <DeleteIcon className="cursor-pointer hover:text-[#005B96]" />,
    identifier: ACTION_IDENTIFIER.DELETE,
  },
];

const createData = (
  id,
  action,
  created_at,
  updated_at,
  ip_address,
  name,
  email,
  image
) => {
  return {
    id,
    action_performed: action,
    created_at: formatDate(created_at),
    ip_address,
    username: name,
    email,
    image: image ? `${ASSEST_BASE_URL}${image}` : null,
  };
};

const Logs = () => {
  const router = useRouter();
  const role_id = useSelector((state) => state?.auth?.role_id);

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [postApi, setPostApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadApi = async () => {
      const { postApi } = await import("@/app/api/clientApi");
      setPostApi(() => postApi);
      setLoading(false);
    };

    loadApi();
  }, []);

  const handleCloseModal = () => {
    setOpenConfirmation(false);
    setSelectedData(null);
  };

  const onActionClick = (event, identifier, row) => {
    if (identifier == "EDIT") {
      router.push(`${ROUTE.LOGS}${ROUTE.ADD_EDIT}?id=${row?.id}`);
    } else {
      setOpenConfirmation(true);
      setSelectedData({ ...row });
    }
  };

  const handleConfirmClick = async () => {
    try {
      setLoading(true);
      if (!postApi) {
        ToastMessage("error", ERROR_TEXT.API_LOAD_ERROR);
        return;
      }
      const response = await postApi(`${API.DELETE_LOG}`, {
        id: selectedData?.id,
      });
      if (response?.error) {
        ToastMessage("error", response?.message);
      } else if (!response?.error) {
        setRefresh(!refresh);
        ToastMessage("success", response?.data?.message);
      }
    } catch (error) {
      ToastMessage("error", ERROR_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      handleCloseModal();
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getApi(
          `${API.GET_LOGS_LIST}?limit=${rowsPerPage}&page=${
            page + 1
          }&search=${search}`
        );

        if (!response.error) {
          const {
            data: {
              data: { data },
            },
          } = response;
          const formattedData = data?.map((user) =>
            createData(
              user.id,
              user.action,
              user.created_at,
              user.updated_at,
              user.ip_address,
              user.user.name,
              user.user.email,
              user.user.image
            )
          );
          setTotalCount(response?.data?.data?.total);
          setTableData(formattedData);
        } else {
          ToastMessage("error", response.message);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    };

    fetchData();
  }, [refresh, page, rowsPerPage, search]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const COLUMNS = [
    {
      id: "sno",
      label: "S.No",
      minWidth: 70,
      maxWidth: 70,
      align: "left",
      isVisible: true,
    },
    {
      id: "name",
      label: "Perfomed By",
      minWidth: 100,
      maxWidth: 100,
      align: "left",
      isVisible: true,
    },
    {
      id: "action_performed",
      label: "Action",
      minWidth: 120,
      maxWidth: 120,
      align: "left",
      isVisible: true,
    },
    {
      id: "ip_address",
      label: "ip address",
      minWidth: 120,
      maxWidth: 120,
      align: "left",
      isVisible: true,
    },

    {
      id: "created_at",
      label: "log Date",
      minWidth: 100,
      maxWidth: 100,
      align: "left",
      isVisible: true,
    },

    {
      id: "action",
      label: "Action",
      minWidth: 100,
      maxWidth: 100,
      align: "left",
      isVisible: role_id === ROLE_ID_BY_NAME.ADMIN,
    },
  ];

  return (
    <Fragment>
      <PageHeader
        text="Logs"
        buttonText={""}
        onButtonClick={() => alert("dummy")}
        icon={
          <FeedIcon height={20} width={20} style={{ marginBottom: "4px" }} />
        }
      />
      <div className="grid grid-cols-1 mt-7 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <TextField
          key="search"
          variant="outlined"
          margin="normal"
          fullWidth
          id="search"
          label="Search (By Action & IP Address)"
          name="search"
          autoComplete="search"
          onChange={handleSearch}
          autoFocus
          value={search}
          style={{ ...FONT_STYLES, marginTop: "0px" }}
        />
      </div>

      <CustomTable
        ACTION_MENU={TABEL_ACTION}
        onActionClick={onActionClick}
        columns={COLUMNS}
        rows={tableData}
        setPage={setPage}
        page={page}
        setRowsPerPage={setRowsPerPage}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
      />
      <ConfirmationModal
        open={openConfirmation}
        handleClose={handleCloseModal}
        handleConfirmClick={handleConfirmClick}
        buttontext="Delete"
        user={{
          user: "this Log",
          userType: "Log",
        }}
      />
    </Fragment>
  );
};
export default withLayout(Logs);
