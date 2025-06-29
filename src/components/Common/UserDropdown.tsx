"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useLogout } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function UserDropdown({ user }: { user: any }) {
  const router = useRouter();
  const { logout } = useLogout({
    onSuccess: () => router.push("/auth/signin"),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-8 h-8 lg:w-10 lg:h-10 ring-1 ring-muted-foreground/10 hover:ring-primary transition">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback className="uppercase font-medium text-sm bg-muted text-foreground">
            {user?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 bg-card-box border border-border shadow-xl mt-2 rounded-md">
        <DropdownMenuLabel className="text-sm font-semibold px-3 py-2">
          <div className="text-foreground">{user?.name}</div>
          <div className="text-muted-foreground text-xs truncate">
            {user?.email}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="w-full text-sm px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded"
          >
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border"  />

        <DropdownMenuItem
          onClick={logout}
          className="text-sm text-destructive hover:text-destructive bg-transparent px-3 py-2 cursor-pointer hover:bg-destructive/10 rounded"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
