import { useState, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from "@tanstack/react-table";

import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import { Modal } from "antd";

import {
  handleOk,
  handleRoleChange,
  handlePrevPage,
  handleNextPage,
  handleEmailChange,
  handleFirstPage,
  handleIdChange,
  handleLastPage,
  handleNameChange,
  handleDeleteSelected
} from "./helpers";

import "./styles.css";
import fetchData from "./fetchData";

export default function App() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState([]);

  useEffect(() => {
    fetchData().then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    setNumberOfPages(() => {
      const arr = [];
      for (let i = 0; i < data.length / 10; i++) {
        arr[i] = i + 1;
      }
      return arr;
    });
  }, [data]);

  function closeModal() {
    setIsOpen(false);
  }

  function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
    const ref = useRef(null);

    useEffect(() => {
      if (typeof indeterminate === "boolean") {
        ref.current.indeterminate = !rest.checked && indeterminate;
      }
    }, [ref, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={ref}
        className={className + " cursor-pointer"}
        {...rest}
      />
    );
  }

  const columnHelper = createColumnHelper();

  const columns = [
    {
      id: "select",
      width: 200,
      header: ({ table }) => {
        return (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllPageRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllPageRowsSelectedHandler()
            }}
          />
        );
      },
      cell: ({ row }) => (
        <div>
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        </div>
      )
    },
    columnHelper.accessor((row) => row.id, {
      id: "id",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Id</span>
    }),
    columnHelper.accessor((row) => row.name, {
      id: "name",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Name</span>
    }),
    columnHelper.accessor((row) => row.email, {
      id: "email",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>email</span>
    }),
    columnHelper.accessor((row) => row.role, {
      id: "role",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Role</span>
    }),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="div__actions">
          <BsFillPencilFill
            onClick={() => {
              setIsOpen(true);
              setSelectedEmail(row?.original?.email);
              setSelectedId(row?.original?.id);
              setSelectedRole(row?.original?.role);
              setSelectedName(row?.original?.name);
              setSelectedRowId(row?.id);
            }}
          />
          <BsFillTrashFill
            onClick={() => {
              setData((records) =>
                records.filter((record, index) => {
                  if (!(row.id === String(index))) {
                    return true;
                  }
                  return false;
                })
              );
            }}
          ></BsFillTrashFill>
        </div>
      )
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
      rowSelection: rowSelection
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection
  });

  return (
    <div className="w3-container App">
      <input
        placeholder="Search by name, email or role"
        className="input__filterValues"
        onChange={(e) => setFiltering(e.target.value)}
        value={filtering}
      ></input>
      <table className="w3-table w3-bordered w3-centered">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {
                    { asc: "🔼", desc: "🔽" }[
                      header.column.getIsSorted() ?? null
                    ]
                  }
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="div__pagination">
        <button
          style={{ padding: "5px" }}
          disabled={!Object.keys(rowSelection).length}
          onClick={() => {
            handleDeleteSelected({ setData, rowSelection, setRowSelection });
          }}
        >
          Delete Selected
        </button>
        <div className="div__pagination--buttons">
          <button
            disabled={!table.getCanPreviousPage()}
            onClick={() => handleFirstPage(table)}
          >
            &lt;&lt;
          </button>
          {numberOfPages.map((pageNumber, index) => {
            return (
              <button
                key={index}
                onClick={() => table.setPageIndex(pageNumber - 1)}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            disabled={!table.getCanPreviousPage()}
            onClick={() => handlePrevPage(table)}
          >
            &lt;
          </button>
          <button
            disabled={!table.getCanNextPage()}
            onClick={() => handleNextPage(table)}
          >
            &gt;
          </button>
          <button
            disabled={!table.getCanNextPage()}
            onClick={() => handleLastPage(table)}
          >
            &gt;&gt;
          </button>
        </div>
        {modalIsOpen && (
          <Modal
            title="Edit"
            open={modalIsOpen}
            onOk={() =>
              handleOk({
                data,
                selectedEmail,
                selectedId,
                selectedName,
                selectedRole,
                selectedRowId,
                setData,
                setIsOpen
              })
            }
            onCancel={closeModal}
          >
            <label htmlFor="id">Id</label>
            <input
              id="id"
              value={selectedId}
              onChange={(e) => handleIdChange({ e, setSelectedId })}
            ></input>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={selectedName}
              onChange={(e) => handleNameChange({ e, setSelectedName })}
            ></input>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={selectedEmail}
              onChange={(e) => handleEmailChange({ e, setSelectedEmail })}
            ></input>
            <label htmlFor="role">Role</label>
            <input
              id="role"
              value={selectedRole}
              onChange={(e) => handleRoleChange({ e, setSelectedRole })}
            ></input>
          </Modal>
        )}
      </div>
    </div>
  );
}
