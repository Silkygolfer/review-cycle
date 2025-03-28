'use client'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVerticalIcon } from "lucide-react"
import deleteUser from "@/api/DELETE/delete-user"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import resendInvitationEmail from "@/api/POST/permissions/resend-invitation"

export function UserDropdownMenu({ user }) {
  // init router for component re-render on change
  const router = useRouter();

  // handles user delete and client feedback messaging 
  const handleDeleteUser = async (id) => {
    const result = await deleteUser(id);
    if (result.success) {
      toast.message('User deleted successfully!')
      router.refresh();
    }
    if (!result.success) {
      toast.error('Failed to delete user: ', result?.error)
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
              <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} variant="destructive">
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