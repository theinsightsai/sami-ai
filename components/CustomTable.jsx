import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Chip, Tooltip, Avatar, Typography } from "@mui/material";
import {
  getRoleStatusById,
  getRoleColorById,
  getRoleNameById,
  getPriorityIconById,
  getPriorityById,
  getTaskColorById,
} from "@/utils";
import { FONT_STYLES } from "@/constants";

const getColorByStatus = (value) => {
  switch (value) {
    case "Completed":
    case "Active":
      return "success";

    case "Pending":
    case "In-Active":
      return "error";

    default:
      return "default";
  }
};

const NameSection = ({ row }) => {
  return (
    <div className="flex items-center" style={FONT_STYLES}>
      <Avatar
        alt={row.name}
        sx={{ marginRight: 2, textTransform: "capitalize" }}
        src={row.image}
      />
      <div>
        <Typography
          variant="body1"
          sx={{ textTransform: "capitalize", ...FONT_STYLES }}
        >
          {row.username}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={FONT_STYLES}>
          {row.email}
        </Typography>
      </div>
    </div>
  );
};

export default function CustomTable({
  ACTION_MENU,
  onActionClick,
  columns,
  rows,
  setPage,
  page,
  setRowsPerPage,
  rowsPerPage,
  totalCount,
}) {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const ActionSection = ({ ACTION_MENU, row }) => {
    return (
      <>
        {ACTION_MENU.map((actionObj, i) => (
          <Tooltip
            key={i}
            title={actionObj.toolTipLabel}
            onClick={(event) =>
              onActionClick(event, actionObj?.identifier, row)
            }
          >
            {!(
              actionObj?.identifier === "DELETE" &&
              row?.is_deletable !== 1 &&
              row?.is_deletable !== undefined
            ) && <span className="ml-2 inline-block">{actionObj.icon}</span>}
          </Tooltip>
        ))}
      </>
    );
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        marginTop: "50px",
        ...FONT_STYLES,
      }}
    >
      <TableContainer sx={{ maxHeight: 600, minHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    background: "lightgray",
                    textTransform: "uppercase",
                    display: column?.isVisible ? "-ms-flexbox" : "none",
                    ...FONT_STYLES,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {rows?.length > 0 ? (
            <TableBody>
              {rows.map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    if (column.isVisible) {
                      let cellContent;

                      // Check the column ID and render the corresponding content
                      switch (column.id) {
                        case "name":
                          cellContent = <NameSection row={row} />;
                          break;
                        case "action":
                          if (column.isVisible) {
                            cellContent = (
                              <ActionSection
                                ACTION_MENU={ACTION_MENU}
                                row={row}
                              />
                            );
                          }
                          break;

                        case "taskId":
                          cellContent = (
                            <div style={{ fontWeight: 600 }}>
                              {row[column.id]}
                            </div>
                          );
                          break;
                        case "roleId":
                          cellContent = (
                            <div style={{ fontWeight: 600 }}>
                              {getRoleNameById(row[column.id])}
                            </div>
                          );

                          break;
                        case "task_status":
                          cellContent = (
                            <Tooltip title={row[column.id]}>
                              <Chip
                                sx={{
                                  cursor: "pointer",
                                  textTransform: "capitalize",
                                }}
                                label={row[column.id]}
                                color={getTaskColorById(row[column.id])}
                                variant="outlined"
                              />
                            </Tooltip>
                          );
                          break;
                        case "roleStatus":
                          cellContent = (
                            <Tooltip title={getRoleStatusById(row[column.id])}>
                              <Chip
                                sx={{ cursor: "pointer" }}
                                label={getRoleStatusById(row[column.id])}
                                color={getRoleColorById(row[column.id])}
                                variant="outlined"
                              />
                            </Tooltip>
                          );
                          break;

                        case "taskPriority":
                          cellContent = (
                            <div className="flex items-center gap-1">
                              {getPriorityIconById(row[column.id])}
                              <Tooltip title={getPriorityById(row[column.id])}>
                                {getPriorityById(row[column.id])}
                              </Tooltip>
                            </div>
                          );
                          break;

                        case "email_verified":
                        case "active_status":
                          cellContent = (
                            <Tooltip
                              title={row[column.id]}
                              sx={{ textTransform: "capitalize" }}
                            >
                              <Chip
                                sx={{ cursor: "pointer" }}
                                label={row[column.id]}
                                color={getColorByStatus(row[column.id])}
                                variant="outlined"
                              />
                            </Tooltip>
                          );
                          break;

                        case "taskDesc":
                        case "roleDesc":
                          cellContent = (
                            <div className="italic">{row[column.id]}</div>
                          );
                          break;
                        case "sno":
                          cellContent = (
                            <div style={{ fontWeight: 600 }}>{index + 1}.</div>
                          );
                          break;
                        default:
                          cellContent = row[column.id];
                      }

                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{
                            maxWidth: column.maxWidth,
                            minWidth: column.minWidth,
                            ...FONT_STYLES, // Apply font styles to table cells
                          }}
                        >
                          {cellContent}
                        </TableCell>
                      );
                    }
                    return null;
                  })}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    ...FONT_STYLES, // Apply font styles here too
                  }}
                >
                  <div
                    style={{
                      textTransform: "uppercase",
                    }}
                  >
                    No Data Found
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
