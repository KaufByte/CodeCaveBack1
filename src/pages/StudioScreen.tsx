import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Select,
  MenuItem,
  Button,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from "@mui/icons-material/Replay";
import { authFetch } from "../utils/authFetch";
import EditUserModal from "../components/EditUserModal";
interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  subscription_name: string;
  display_name?: string;
  subscription_status: string;
  subscription_price: string;
  balance: string;
}

const subscriptionOptions = [
  { name: "Free", price: "0.00" },
  { name: "Junior", price: "5.00" },
  { name: "Chilli", price: "10.00" },
  { name: "Powerful SEO", price: "20.00" },
];

const StudioPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [edited, setEdited] = useState<Record<number, string>>({});
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const fetchUsers = async () => {
    const res = await authFetch("https://codecaveback2.onrender.com/api/users/");
    if (!res || !res.ok) return;
    const data = await res.json();
    setUsers(data);
  };

  const handleSaveSubscription = async (id: number) => {
    const subName = edited[id];
    const subData = subscriptionOptions.find((s) => s.name === subName);
    if (!subData) return;

    const res = await authFetch(`https://codecaveback2.onrender.com/api/users/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription_name: subName,
        subscription_price: subData.price,
        subscription_status: "active",
      }),
    });
    if (res && res.ok) {
      const updatedUser = await res.json();

      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      if (currentUser.id === id) {
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }

      setEdited((prev) => {
        const clone = { ...prev };
        delete clone[id];
        return clone;
      });

      fetchUsers();
    } else {
      console.warn("❌ PATCH failed", res?.status);
    }
  };  
 const handleSaveUser = async (updated: { id: number; email: string; username: string; role: string,display_name:string}) => {
  const res = await authFetch(`https://codecaveback2.onrender.com/api/users/${updated.id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: updated.email,
      username: updated.username,
      role: updated.role,
      display_name: updated.display_name, 
    }),
  });

  if (res && res.ok) {
    const updatedUser = await res.json();

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.id === updatedUser.id) {
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }

    fetchUsers();
  }
};


  const handleCancelSub = async (id: number) => {
    const res = await authFetch(`https://codecaveback2.onrender.com/api/admin/cancel-subscription/${id}/`, {
      method: "POST"
    });
    if (res && res.ok) {
      fetchUsers();
    } else {
      console.error("Не вдалось відмінити підписку:", res?.status);
    }
  };


  const handleReactivate = async (id: number) => {
    const res = await authFetch(`https://codecaveback2.onrender.com/api/users/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription_status: "active" }),
    });
    if (res && res.ok) {
      fetchUsers();
    }
  };


  const handleDeleteUser = async (id: number) => {
    const res = await authFetch(`https://codecaveback2.onrender.com/api/users/${id}/`, {
      method: "DELETE",
    });
    if (res && res.ok) {
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Studio - User Management
      </Typography>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Subscription</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Balance (€)</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.role}</TableCell>

              <TableCell>
                <FormControl size="small" fullWidth>
                  <Select
                    value={edited[u.id] ?? u.subscription_name}
                    onChange={(e) =>
                      setEdited((prev) => ({
                        ...prev,
                        [u.id]: e.target.value,
                      }))
                    }
                  >
                    {subscriptionOptions.map((opt) => (
                      <MenuItem key={opt.name} value={opt.name}>
                        {opt.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>

              <TableCell>{u.subscription_status}</TableCell>
              <TableCell>{u.subscription_price}</TableCell>
              <TableCell>{u.balance}</TableCell>

              <TableCell>
                {edited[u.id] && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleSaveSubscription(u.id)}
                    sx={{ mb: 1, mr: 1 ,"&:focus": {
                    outline: "none",
                    boxShadow: "none",
                    }}}
                  >
                    Save
                  </Button>
                )}

               <IconButton
                  onClick={() => {
                    setSelectedUser(u);
                    setEditUserModalOpen(true);
                  }}
                  sx={{ mb: 1, mr: 1 ,color: "#f7266e","&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  }}}
                  title="Редагувати користувача"
                >
                  <EditIcon />
                </IconButton>
                {u.subscription_status === "canceled" && (
                  <IconButton
                    onClick={() => handleReactivate(u.id)}
                    sx={{ mb: 1, mr: 1 ,"&:focus": {
                      outline: "none",
                      boxShadow: "none",
                    }}}
                    title="Активувати знову"
                  >
                    <ReplayIcon />
                  </IconButton>
                )}

                <IconButton
                  onClick={() => handleCancelSub(u.id)}
                   sx={{ mb: 1, mr: 1 ,"&:focus": {
                      outline: "none",
                      boxShadow: "none",
                  }}}
                  title="Скасувати підписку"
                >
                  <CancelIcon />
                </IconButton>

                <IconButton
                  onClick={() => handleDeleteUser(u.id)}
                  title="Видалити користувача"
                  sx={{ mb: 1, mr: 1 ,"&:focus": {
                      outline: "none",
                      boxShadow: "none",
                   }}}
                  >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditUserModal
        open={editUserModalOpen}
        onClose={() => setEditUserModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </Box>
    
  );
};

export default StudioPage;
