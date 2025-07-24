import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../store/tableSlice";
import EditForm from "./EditForm";
import AddForm from "./AddForm";
import { Input } from "./ui/input";
import * as XLSX from "xlsx";

// Generates a random 10-digit phone number
function generatePhoneNumber() {
  let phone = "";
  for (let i = 0; i < 10; i++) {
    phone += Math.floor(Math.random() * 10);
  }
  return phone;
}

// Creates dummy data with 100 rows for demonstration
const dummyData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  contact_owner: `User ${i + 1}`,
  account_name: `Account ${i + 1}`,
  name: `Name ${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: generatePhoneNumber(),
}));

export default function CustomTable() {
  const data = useSelector((state) => state.table.data);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState(null);
  const [addForm, setAddForm] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const entriesPerPage = 10;

  // Exports table data to an Excel file
  const exportToExcel = (data, fileName = "table_data.xlsx") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName);
  };

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(globalSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage) || 1;

  // Sorts filtered data based on the current sort configuration
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key]?.toString().toLowerCase();
    const valB = b[sortConfig.key]?.toString().toLowerCase();
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Get the data for the current page
  const currentData = sortedData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Handle global search input change
  const handleGlobalSearch = (e) => {
    setGlobalSearch(e.target.value);
    setCurrentPage(1);
  };

  // Toggle sorting for a given column
  const handleSort = (column) => {
    setSortConfig((prev) => {
      if (prev.key === column) {
        return {
          key: column,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key: column, direction: "asc" };
    });
  };

  const resetSort = () => {
    setSortConfig({ key: null, direction: "asc" });
  };

  useEffect(() => {
    dispatch(setData(dummyData));
  }, [dispatch]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {editingRow ? (
        // Modal
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <EditForm
              rowData={editingRow}
              closeModal={() => setEditingRow(null)}
            />
          </div>
        </div>
      ) : addForm ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <AddForm setAddForm={setAddForm} />
          </div>
        </div>
      ) : (
        <>
          {/* Table Wrapper */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <div className="p-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Add New Button */}
              <div>
                <Button
                  onClick={() => setAddForm(true)}
                  className="bg-blue-600 text-white text-sm font-medium"
                >
                  + Add New
                </Button>
                <Button
                  className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => exportToExcel(filteredData)}
                >
                  Export Excel
                </Button>
              </div>

              {/* Search and Reset */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-3/5 justify-end">
                <Input
                  onChange={handleGlobalSearch}
                  placeholder="Global Search"
                  className="w-full sm:w-1/2"
                />
                <Button
                  className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition w-full sm:w-auto"
                  onClick={resetSort}
                >
                  Reset Sort
                </Button>
              </div>
            </div>

            <Table className="w-full text-sm sm:text-base border-collapse">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-600">
                    Edit
                  </TableHead>
                  <TableHead
                    className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-600"
                    onClick={() => handleSort("contact_owner")}
                  >
                    Contact Owner{" "}
                    {sortConfig.key === "contact_owner" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </TableHead>
                  <TableHead
                    className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-600"
                    onClick={() => handleSort("account_name")}
                  >
                    Account Name{" "}
                    {sortConfig.key === "account_name" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </TableHead>
                  <TableHead
                    className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-600"
                    onClick={() => handleSort("name")}
                  >
                    Name{" "}
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </TableHead>
                  <TableHead
                    className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-600"
                    onClick={() => handleSort("email")}
                  >
                    Email{" "}
                    {sortConfig.key === "email" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </TableHead>
                  <TableHead
                    className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-600"
                    onClick={() => handleSort("phone")}
                  >
                    Phone{" "}
                    {sortConfig.key === "phone" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-3 py-2 sm:px-4 sm:py-3">
                      <span
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer transition"
                        onClick={() => setEditingRow(item)}
                      >
                        Edit <Edit className="w-4 h-4" />
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-2 sm:px-4 sm:py-3">
                      {item.contact_owner}
                    </TableCell>
                    <TableCell className="px-3 py-2 sm:px-4 sm:py-3">
                      {item.account_name}
                    </TableCell>
                    <TableCell className="px-3 py-2 sm:px-4 sm:py-3">
                      {item.name}
                    </TableCell>
                    <TableCell className="px-3 py-2 sm:px-4 sm:py-3">
                      {item.email}
                    </TableCell>
                    <TableCell className="px-3 py-2 sm:px-4 sm:py-3">
                      {item.phone}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-6 text-sm">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="text-gray-500 text-center sm:text-left">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </span>

            <Button
              variant="outline"
              className="w-full sm:w-auto px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
