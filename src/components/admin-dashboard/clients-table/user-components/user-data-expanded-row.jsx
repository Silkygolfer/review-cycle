import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserCircle, Mail, Phone, EllipsisVerticalIcon } from "lucide-react";
import React from "react";
import { useState } from "react";
import CreateUserDialogForm from "./create-user-form";
import { UserDropdownMenu } from "./user-actions-dropdown";

export default function ClientAssignments({ client }) {
  // set state for opening and closing the create user dialog form
  const [isOpen, setIsOpen] = useState(false);

  // init router and define refreshData fn
  const router = useRouter()
  function refreshData() {
      router.refresh();
  };

  console.log('client', client)

  
  return (
    <div className="p-4">
      {isOpen && (
            <CreateUserDialogForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            refreshPage={refreshData}
            account_id={client.account_id}
            client_id={client.id} 
            />
        )}
      <div className="flex w-full items-center mb-3">
        <h3 className="text-md font-medium">Assigned Users</h3>
        <Button className={'flex ml-auto border-1 hover:border-green-700'} variant={'outline'} onClick={() => setIsOpen(true)}>Add User</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {client.client_assignments.map((assignment, index) => {
          const user = assignment.users;
          return (
            <div key={index} className="border rounded-md p-3 relative">
              <UserDropdownMenu user={user} client={client} />
              <div className="flex items-center">
                <UserCircle className="text-blue-500 mr-2" size={20} />
                <div className="font-medium">{user.first_name} {user.last_name}</div>
              </div>
              <div className="text-sm mt-1">{user.role}</div>
              <div className="mt-2 space-y-1">
                <div className="text-sm flex items-center">
                  <Mail className="mr-2" size={14} />
                  {user.email}
                </div>
                {assignment.phone && (
                  <div className="text-sm flex items-center">
                  <Phone className="mr-2" size={14} />
                  {user.phone}
                </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};