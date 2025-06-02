import * as React from "react"
import { Search, UserPlus, Filter, X, Users, Eye, EyeOff, Edit3 } from "lucide-react"
import axios from "axios"
//import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
//import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";

// Mock AG-Grid styles and components since we can't import the actual library
const AgGridReact = ({ 
  rowData, 
  columnDefs, 
  onGridReady, 
  defaultColDef, 
  pagination, 
  paginationPageSize, 
  suppressRowClickSelection, 
  rowSelection, 
  animateRows, 
  headerHeight, 
  rowHeight,
  domLayout,
  onFilterChanged,
  getRowStyle
}) => {
  const [sortModel, setSortModel] = React.useState([])
  const [filterModel, setFilterModel] = React.useState({})
  
  // Simple sorting implementation
  const sortedData = React.useMemo(() => {
    if (!sortModel.length) return rowData
    
    const { colId, sort } = sortModel[0]
    return [...rowData].sort((a, b) => {
      const aValue = a[colId]
      const bValue = b[colId]
      
      if (sort === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [rowData, sortModel])

  const handleSort = (colId) => {
    setSortModel(prev => {
      const existing = prev.find(s => s.colId === colId)
      if (!existing) return [{ colId, sort: 'asc' }]
      if (existing.sort === 'asc') return [{ colId, sort: 'desc' }]
      return []
    })
  }

  const getSortIcon = (colId) => {
    const sort = sortModel.find(s => s.colId === colId)?.sort
    if (sort === 'asc') return '↑'
    if (sort === 'desc') return '↓'
    return ''
  }

  return (
    <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-0">
            {columnDefs.map((col, index) => (
              <div
                key={col.field || index}
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0 cursor-pointer hover:bg-gray-100 ${
                  col.flex ? `col-span-${Math.floor(col.flex * 3)}` : 
                  col.width ? (col.width < 120 ? 'col-span-1' : 'col-span-2') : 'col-span-2'
                }`}
                onClick={() => col.field && handleSort(col.field)}
              >
                <div className="flex items-center justify-between">
                  <span>{col.headerName}</span>
                  {col.field && <span className="text-gray-400">{getSortIcon(col.field)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="max-h-96 overflow-y-auto">
          {sortedData.map((row, rowIndex) => (
            <div
              key={row.Id || rowIndex}
              className="grid grid-cols-12 gap-0 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              style={getRowStyle ? getRowStyle({ data: row }) : {}}
            >
              {columnDefs.map((col, colIndex) => (
                <div
                  key={col.field || colIndex}
                  className={`px-4 py-3 border-r border-gray-100 last:border-r-0 ${
                    col.flex ? `col-span-${Math.floor(col.flex * 3)}` : 
                    col.width ? (col.width < 120 ? 'col-span-1' : 'col-span-2') : 'col-span-2'
                  }`}
                >
                  {col.cellRenderer ? 
                    col.cellRenderer({ data: row, value: row[col.field] }) : 
                    <span className="text-sm text-gray-900">{row[col.field]}</span>
                  }
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {sortedData.length} of {rowData.length} entries
            </div>
            <div className="text-sm text-gray-500">
              Page 1 of 1
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface User {
  Id: number
  IsActive: boolean
  Role: string
  UserName: string
  FullName: string
  Permissions: string[]
  CreatedDate: string
  LastLogin: string
}

export function UserManagement() {
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [gridApi, setGridApi] = React.useState(null)
  const [filters, setFilters] = React.useState({
    active: "all",
    role: "all",
    search: "",
  })

  const navigate = useNavigate();

  const stored : User = JSON.parse(localStorage.getItem("userdetails"));

  // Simulate API call to fetch users (like your original code)
  const fetchUsers = React.useCallback(async () => {
    setLoading(true)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if(stored.Role === ("Administrator")) { 
        const userData = {
             Role: stored.Role        
          };          
        
        axios(
          {
            method: "POST",
            url: "https://j34183xbc8.execute-api.eu-west-2.amazonaws.com/dev/getSystemUsers",
            headers: { "x-api-key" : "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu" },
            data: userData
          }            
      )
      .then(response => { 
        
        const results = [];
        // Store results in the results array
        response.data.map((value) => {
           results.push({
            Id: value.Id,
            UserName: value.UserName,
            FullName: value.FullName,
            Role: value.Role,
            Permissions: value.UserPermissions.split(","),
            IsActive:true        
          });
    
        setUsers(results);
        setLoading(false)            
      });
  
  
      })
    }
  }, [])

  React.useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const roles = ["Administrator", "Shipper", "Hub Worker", "Shipper CS"]

  // Custom cell renderers for AG-Grid
  const StatusRenderer = ({ value, data }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      value 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {value ? (
        <>
          <Eye className="w-3 h-3 mr-1" />
          Active
        </>
      ) : (
        <>
          <EyeOff className="w-3 h-3 mr-1" />
          Inactive
        </>
      )}
    </span>
  )

  const RoleRenderer = ({ value }) => {
    const roleColors = {
      'Administrator': 'bg-purple-100 text-purple-800 border-purple-200',
      'Hub Supervisor': 'bg-blue-100 text-blue-800 border-blue-200',
      'Shipper': 'bg-orange-100 text-orange-800 border-orange-200',
      'Hub Worker': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Customer Services Advisor': 'bg-pink-100 text-pink-800 border-pink-200',
      'Carrier': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        roleColors[value] || 'bg-gray-100 text-gray-800 border-gray-200'
      }`}>
        {value}
      </span>
    )
  }

  const ActionsRenderer = ({ data }) => (
    <div className="flex space-x-2">
      <button
        onClick={() => handleEditUser(data.UserName)}
        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
        title="Edit User"
      >
        <Edit3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleToggleActive(data.Id)}
        className={`p-1.5 rounded-md transition-colors ${
          data.IsActive 
            ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
            : 'text-green-600 hover:text-green-800 hover:bg-green-50'
        }`}
        title={data.IsActive ? "Deactivate User" : "Activate User"}
      >
        {data.IsActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )

  const UserNameRenderer = ({ data }) => (
    <div>
      <div className="text-sm font-medium text-gray-900">{data.UserName}</div>      
    </div>
  )

  const UserIdRenderer = ({ data }) => (
    <div>
      <div className="text-sm font-medium text-gray-900">{data.Id}</div>      
    </div>
  )

  const EmailRenderer = ({ data }) => (
    <div>
      <div className="text-sm font-medium text-gray-900">{data.UserName}</div>      
    </div>
  )

  const FullNameRenderer = ({ data }) => (
    <div>
      <div className="text-sm font-medium text-gray-900">{data.FullName}</div>      
    </div>
  )

  // AG-Grid column definitions
  const columnDefs = React.useMemo(() => [
    {
      field: "Id",
      headerName: "ID",
      width: 100,
      cellRenderer: UserIdRenderer,
      sortable: true,
    },
    {
      field: "FullName",
      headerName: "FULL NAME",
      cellRenderer: FullNameRenderer,
      width: 250,
      sortable: true,
    },
    {
      field: "Email",
      headerName: "EMAIL",
      cellRenderer: EmailRenderer,
      width: 150,
      sortable: true,
    },
    {
      field: "Role",
      headerName: "ROLE",
      width: 200,
      cellRenderer: RoleRenderer,
      sortable: true,
    },
    {
      field: "IsActive",
      headerName: "STATUS",
      width: 120,
      cellRenderer: StatusRenderer,
      sortable: true,
    },
    {
      headerName: "ACTIONS",
      width: 50,
      cellRenderer: ActionsRenderer,
      sortable: false,
      filter: false,
    },
  ], [])

  const defaultColDef = React.useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: false,
  }), [])

  const onGridReady = (params) => {
    setGridApi(params.api)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  const clearFilters = () => {
    setFilters({ active: "all", role: "all", search: "" })
  }

  const handleAddUser = () => {
    navigate("/settings/manage-access/create");
  }

  const handleEditUser = (userName) => {
    navigate("/settings/manage-access/edit", {
      state: { UserName : userName }
    })
  }

  const handleToggleActive = (userId: number) => {
    setUsers((prev) => 
      prev.map((user) => 
        user.Id === userId ? { ...user, IsActive: !user.IsActive } : user
      )
    )
  }

  // Filter users based on current filters (AG-Grid would normally handle this)
  const filteredUsers = React.useMemo(() => {
    debugger;
    return users.filter((user) => {
      const activeMatch =
        filters.active === "all" ||
        (filters.active === "active" && user.IsActive) ||
        (filters.active === "inactive" && !user.IsActive)

      const roleMatch = filters.role === "all" || user.Role === filters.role

      const searchMatch =
        filters.search === "" ||        
        user.FullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.UserName.toLowerCase().includes(filters.search.toLowerCase())

      return activeMatch && roleMatch && searchMatch
    })
  }, [users, filters])

  // Row styling based on status
  const getRowStyle = ({ data }) => {
    if (!data.IsActive) {
      return { backgroundColor: '#fef2f2' } // Light red background for inactive users
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Total Users: {filteredUsers.length}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1 text-green-600" />
                  <span>Active: {filteredUsers.filter(u => u.IsActive).length}</span>
                </div>
                <div className="flex items-center">
                  <EyeOff className="w-4 h-4 mr-1 text-red-600" />
                  <span>Inactive: {filteredUsers.filter(u => !u.IsActive).length}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleAddUser}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700">Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    placeholder="Search by name, username, or email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.active}
                  onChange={(e) => handleFilterChange("active", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="all">All Roles</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filter Button */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AG-Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <div className="text-gray-500">Loading users...</div>
              </div>
            </div>
          ) : (
            <AgGridReact
              rowData={filteredUsers}
              columnDefs={columnDefs}
              onGridReady={onGridReady}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={20}
              suppressRowClickSelection={true}
              rowSelection="multiple"
              animateRows={true}
              headerHeight={40}
              rowHeight={60}
              domLayout="normal"
              getRowStyle={getRowStyle}
              onFilterChanged={() => {
                if (gridApi) {
                  gridApi.setQuickFilter(filters.search)
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}