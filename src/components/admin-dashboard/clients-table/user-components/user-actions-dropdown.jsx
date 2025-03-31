'use client'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVerticalIcon } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import resendInvitationEmail from "@/api/POST/permissions/resend-invitation"
import removeUserFromClient from "@/api/DELETE/delete-user-from-client"

export function UserDropdownMenu({ user, client }) {
  // init router for component re-render on change
  const router = useRouter();

  // handles user delete and client feedback messaging 
  const handleDeleteUser = async ({ user_id, client_id }) => {
    const result = await removeUserFromClient({ user_id: user_id, client_id: client_id });
    if (result.success) {
      toast.message('User deleted successfully!')
      router.refresh();
    }
    if (!result.success) {
      console.log(result.error)
      toast.error('Failed to delete user: ' + result.error)
    }
  };

  // handles resend email invitation and client feedback messaging
  const handleResendInvitation = async (email) => {
    const result = await resendInvitationEmail(email);
    if (result.success) {
      toast.message('Email resent successfully!')
    }
    if (!result.success) {
      toast.error('Failed to send email: ', result?.error)
    }
  };

    return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="icon" className={'hover:bg-muted/50 absolute top-2 right-2'}>
                <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteUser({ user_id: user.id, client_id: client.id })} variant="destructive">
                Delete User
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleResendInvitation(user.email)}>
                Resend Invitation
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Move User
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
}